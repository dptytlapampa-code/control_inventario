<?php

namespace App\Services;

use App\Http\Resources\Mantenimientos\MantenimientoResource;
use App\Models\Mantenimiento;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class MantenimientosService
{
    public function listar(array $filters): LengthAwarePaginator
    {
        $query = Mantenimiento::query()
            ->when($filters['q'] ?? null, function (Builder $builder, string $search) {
                $builder->where(function (Builder $query) use ($search) {
                    $query->where('descripcion', 'like', "%{$search}%")
                        ->orWhere('tipo', 'like', "%{$search}%")
                        ->orWhere('estado', 'like', "%{$search}%");
                });
            })
            ->when($filters['hospital_id'] ?? null, fn (Builder $builder, string $hospitalId) => $builder->where('hospital_id', $hospitalId))
            ->when($filters['servicio_id'] ?? null, fn (Builder $builder, string $servicioId) => $builder->where('servicio_id', $servicioId))
            ->when($filters['oficina_id'] ?? null, fn (Builder $builder, string $oficinaId) => $builder->where('oficina_id', $oficinaId))
            ->when($filters['estado'] ?? null, fn (Builder $builder, string $estado) => $builder->where('estado', $estado))
            ->when($filters['fecha_desde'] ?? null, fn (Builder $builder, string $desde) => $builder->whereDate('fecha', '>=', $desde))
            ->when($filters['fecha_hasta'] ?? null, fn (Builder $builder, string $hasta) => $builder->whereDate('fecha', '<=', $hasta))
            ->orderByDesc('fecha');

        $page = (int) ($filters['page'] ?? 1);
        $perPage = (int) ($filters['per_page'] ?? 15);

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function transformarLista(LengthAwarePaginator $paginator): array
    {
        return [
            'data' => MantenimientoResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ];
    }
}
