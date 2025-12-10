<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pos\CloseCajaRequest;
use App\Http\Requests\Pos\OpenCajaRequest;
use App\Models\Caja;
use App\Models\Venta;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class CajaController extends Controller
{
    public function abrir(OpenCajaRequest $request): JsonResponse
    {
        $userId = auth()->id();

        $cajaAbierta = Caja::where('user_id', $userId)->where('estado', 'abierta')->first();
        if ($cajaAbierta) {
            return response()->json(['message' => 'Ya existe una caja abierta para el usuario.'], 422);
        }

        $caja = Caja::create([
            'user_id' => $userId,
            'estado' => 'abierta',
            'saldo_inicial' => $request->input('saldo_inicial'),
            'abierta_en' => Carbon::now(),
        ]);

        return response()->json(['message' => 'Caja abierta correctamente.', 'data' => $caja]);
    }

    public function verCajaAbierta(): JsonResponse
    {
        $userId = auth()->id();
        $caja = Caja::where('user_id', $userId)->where('estado', 'abierta')->first();

        if (!$caja) {
            return response()->json(['message' => 'No hay caja abierta.'], 404);
        }

        return response()->json(['data' => $caja]);
    }

    public function cerrar(CloseCajaRequest $request): JsonResponse
    {
        $userId = auth()->id();
        $caja = Caja::where('user_id', $userId)->where('estado', 'abierta')->first();

        if (!$caja) {
            return response()->json(['message' => 'No hay caja abierta para cerrar.'], 422);
        }

        $ventas = Venta::with('pagos')
            ->where('caja_id', $caja->id)
            ->get();

        $totalesPago = [
            'efectivo' => 0,
            'debito' => 0,
            'credito' => 0,
            'transferencia' => 0,
        ];

        $totalDescuentos = 0;
        $totalCosto = 0;
        $totalVentas = 0;

        foreach ($ventas as $venta) {
            $totalDescuentos += $venta->descuento_monto;
            $totalCosto += $venta->total_costo;
            $totalVentas += $venta->total;
            foreach ($venta->pagos as $pago) {
                if (array_key_exists($pago->tipo, $totalesPago)) {
                    $totalesPago[$pago->tipo] += (float) $pago->monto;
                }
            }
        }

        $caja->update([
            'estado' => 'cerrada',
            'saldo_final' => $totalesPago['efectivo'] + $totalesPago['debito'] + $totalesPago['credito'] + $totalesPago['transferencia'],
            'total_efectivo' => $totalesPago['efectivo'],
            'total_debito' => $totalesPago['debito'],
            'total_credito' => $totalesPago['credito'],
            'total_transferencia' => $totalesPago['transferencia'],
            'total_descuentos' => $totalDescuentos,
            'total_costo' => $totalCosto,
            'total_ventas' => $totalVentas,
            'diferencia_efectivo' => $request->efectivo_real - $totalesPago['efectivo'],
            'cerrada_en' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Caja cerrada correctamente.',
            'data' => $caja->fresh(),
        ]);
    }
}
