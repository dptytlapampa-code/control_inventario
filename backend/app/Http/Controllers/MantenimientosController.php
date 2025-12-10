<?php

namespace App\Http\Controllers;

use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class MantenimientosController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'q' => 'nullable|string|max:255',
            'hospital_id' => 'nullable|string',
            'servicio_id' => 'nullable|string',
            'oficina_id' => 'nullable|string',
            'estado' => 'nullable|string',
            'fecha_desde' => 'nullable|date',
            'fecha_hasta' => 'nullable|date',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = DB::table('mantenimientos')
            ->when($validated['q'] ?? null, function (Builder $builder, string $search) {
                $builder->where(function (Builder $query) use ($search) {
                    $query->where('descripcion', 'like', "%{$search}%")
                        ->orWhere('tipo', 'like', "%{$search}%")
                        ->orWhere('estado', 'like', "%{$search}%");
                });
            })
            ->when($validated['hospital_id'] ?? null, fn (Builder $builder, string $hospitalId) => $builder->where('hospital_id', $hospitalId))
            ->when($validated['servicio_id'] ?? null, fn (Builder $builder, string $servicioId) => $builder->where('servicio_id', $servicioId))
            ->when($validated['oficina_id'] ?? null, fn (Builder $builder, string $oficinaId) => $builder->where('oficina_id', $oficinaId))
            ->when($validated['estado'] ?? null, fn (Builder $builder, string $estado) => $builder->where('estado', $estado))
            ->when($validated['fecha_desde'] ?? null, fn (Builder $builder, string $desde) => $builder->whereDate('fecha', '>=', $desde))
            ->when($validated['fecha_hasta'] ?? null, fn (Builder $builder, string $hasta) => $builder->whereDate('fecha', '<=', $hasta))
            ->orderByDesc('fecha');

        return $this->formatResponse($this->paginate($query, $validated));
    }

    private function paginate(Builder $query, array $filters): LengthAwarePaginator
    {
        $page = (int) ($filters['page'] ?? 1);
        $perPage = (int) ($filters['per_page'] ?? 15);

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    private function formatResponse(LengthAwarePaginator $paginator)
    {
        return response()->json([
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }
}
