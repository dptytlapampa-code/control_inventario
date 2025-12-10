<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pos\StoreVentaRequest;
use App\Models\Caja;
use App\Models\Producto;
use App\Models\StockMovimiento;
use App\Models\Venta;
use App\Services\Arca\ArcaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    protected ArcaService $arcaService;

    public function __construct(ArcaService $arcaService)
    {
        $this->arcaService = $arcaService;
    }

    public function index(): JsonResponse
    {
        $userId = auth()->id();
        $cajaId = request()->get('caja_id');
        $fechaDesde = request()->get('desde');
        $fechaHasta = request()->get('hasta');

        $query = Venta::with(['items.producto', 'pagos'])
            ->when($cajaId, fn($q) => $q->where('caja_id', $cajaId))
            ->when(!$cajaId, function ($q) use ($userId) {
                $caja = Caja::where('user_id', $userId)->where('estado', 'abierta')->first();
                if ($caja) {
                    $q->where('caja_id', $caja->id);
                }
            })
            ->when($fechaDesde, fn($q) => $q->whereDate('created_at', '>=', $fechaDesde))
            ->when($fechaHasta, fn($q) => $q->whereDate('created_at', '<=', $fechaHasta))
            ->orderByDesc('created_at');

        return response()->json(['data' => $query->paginate(20)]);
    }

    public function show(int $id): JsonResponse
    {
        $venta = Venta::with(['items.producto', 'pagos', 'caja'])->find($id);

        if (!$venta) {
            return response()->json(['message' => 'Venta no encontrada.'], 404);
        }

        return response()->json(['data' => $venta]);
    }

    public function store(StoreVentaRequest $request): JsonResponse
    {
        $userId = auth()->id();
        $roles = $this->obtenerRoles();

        $caja = Caja::where('user_id', $userId)->where('estado', 'abierta')->first();
        if (!$caja) {
            return response()->json(['message' => 'Debes abrir una caja antes de registrar ventas.'], 422);
        }

        $descuentoPorcentaje = (float) $request->input('descuento_porcentaje', 0);
        if (in_array('cajero', $roles) && $descuentoPorcentaje > 10) {
            return response()->json(['message' => 'Descuento no permitido para rol cajero.'], 422);
        }

        $itemsData = $request->input('items', []);
        $productos = Producto::whereIn('id', collect($itemsData)->pluck('producto_id'))->get()->keyBy('id');

        $subtotal = 0;
        $totalCosto = 0;

        foreach ($itemsData as $item) {
            $producto = $productos->get($item['producto_id']);
            if (!$producto) {
                return response()->json(['message' => 'Producto no encontrado.'], 404);
            }
            if ($producto->stock < $item['cantidad']) {
                return response()->json(['message' => 'Stock insuficiente para el producto ' . $producto->nombre], 422);
            }
            $subtotal += $producto->precio_venta * $item['cantidad'];
            $totalCosto += $producto->costo * $item['cantidad'];
        }

        $descuentoMonto = $subtotal * ($descuentoPorcentaje / 100);
        $total = $subtotal - $descuentoMonto;
        $ventaDebajoCosto = $total < $totalCosto;

        if ($ventaDebajoCosto && in_array('cajero', $roles)) {
            return response()->json(['message' => 'No se puede vender por debajo del costo con rol cajero.'], 422);
        }

        $pagos = $request->input('pagos');
        $totalPagos = collect($pagos)->sum('monto');
        if ($totalPagos + 0.001 < $total) {
            return response()->json(['message' => 'Los pagos no cubren el total de la venta.'], 422);
        }

        $numeroTicket = (Venta::max('numero_ticket') ?? 0) + 1;

        $venta = DB::transaction(function () use (
            $caja,
            $userId,
            $descuentoPorcentaje,
            $descuentoMonto,
            $total,
            $totalCosto,
            $ventaDebajoCosto,
            $pagos,
            $itemsData,
            $productos,
            $numeroTicket,
            $request,
            $subtotal
        ) {
            $venta = Venta::create([
                'caja_id' => $caja->id,
                'user_id' => $userId,
                'numero_ticket' => $numeroTicket,
                'modo' => $request->input('modo', 'sin_arca'),
                'subtotal' => $subtotal,
                'descuento_porcentaje' => $descuentoPorcentaje,
                'descuento_monto' => $descuentoMonto,
                'total' => $total,
                'total_costo' => $totalCosto,
                'venta_debajo_costo' => $ventaDebajoCosto,
                'medio_pago_resumen' => $this->resumenPagos($pagos),
            ]);

            foreach ($itemsData as $item) {
                $producto = $productos->get($item['producto_id']);
                $venta->items()->create([
                    'producto_id' => $producto->id,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $producto->precio_venta,
                    'subtotal' => $producto->precio_venta * $item['cantidad'],
                    'costo_unitario' => $producto->costo,
                    'subtotal_costo' => $producto->costo * $item['cantidad'],
                ]);

                $producto->decrement('stock', $item['cantidad']);
                StockMovimiento::create([
                    'producto_id' => $producto->id,
                    'cantidad' => $item['cantidad'],
                    'tipo_movimiento' => 'venta_pos',
                    'referencia_id' => $venta->id,
                ]);
            }

            foreach ($pagos as $pago) {
                $venta->pagos()->create($pago);
            }

            return $venta->fresh(['items.producto', 'pagos', 'caja']);
        });

        $ticket = $this->construirTicket($venta, $pagos, $total);

        if ($venta->modo === 'con_arca') {
            $ticket['arca'] = $this->arcaService->enviarComprobante($venta);
        }

        return response()->json([
            'message' => 'Venta registrada correctamente.',
            'data' => $venta,
            'ticket' => $ticket,
        ], 201);
    }

    protected function obtenerRoles(): array
    {
        $user = auth()->user();
        $roles = $user?->roles ?? [];
        return is_array($roles) ? $roles : [];
    }

    protected function resumenPagos(array $pagos): string
    {
        $tipos = collect($pagos)->pluck('tipo')->map(fn($t) => strtoupper($t))->unique()->values();
        return $tipos->implode(' / ');
    }

    protected function construirTicket(Venta $venta, array $pagos, float $total): array
    {
        $efectivo = collect($pagos)->where('tipo', 'efectivo')->sum('monto');
        $otrosMedios = collect($pagos)->whereNotIn('tipo', ['efectivo'])->sum('monto');
        $vuelto = max($efectivo - max($total - $otrosMedios, 0), 0);

        return [
            'encabezado' => 'Comprobante NO fiscal – No válido como factura',
            'comercio' => [
                'nombre' => 'COMERCIO',
            ],
            'numero_ticket' => $venta->numero_ticket,
            'fecha' => $venta->created_at?->format('Y-m-d H:i:s'),
            'items' => $venta->items->map(function ($item) {
                return [
                    'descripcion' => $item->producto->nombre ?? 'Producto',
                    'cantidad' => $item->cantidad,
                    'precio_unitario' => $item->precio_unitario,
                    'subtotal' => $item->subtotal,
                ];
            }),
            'subtotal' => $venta->subtotal,
            'descuento_porcentaje' => $venta->descuento_porcentaje,
            'descuento_monto' => $venta->descuento_monto,
            'total' => $venta->total,
            'pagos' => $venta->pagos,
            'vuelto' => $vuelto,
        ];
    }
}
