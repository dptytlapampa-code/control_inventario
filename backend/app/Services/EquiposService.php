<?php

namespace App\Services;

use App\Http\Resources\Equipos\EquipoResource;
use App\Models\Equipo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class EquiposService
{
    public function listar(array $filters): LengthAwarePaginator
    {
        $query = Equipo::query()
            ->when($filters['q'] ?? null, function (Builder $builder, string $texto) {
                $builder->where(function (Builder $query) use ($texto) {
                    $query->where('nombre', 'like', "%{$texto}%")
                        ->orWhere('serie', 'like', "%{$texto}%")
                        ->orWhere('bien_patrimonial', 'like', "%{$texto}%");
                });
            })
            ->when($filters['hospital_id'] ?? null, fn (Builder $builder, string $hospitalId) => $builder->where('hospital_id', $hospitalId))
            ->when($filters['servicio_id'] ?? null, fn (Builder $builder, string $servicioId) => $builder->where('servicio_id', $servicioId))
            ->when($filters['oficina_id'] ?? null, fn (Builder $builder, string $oficinaId) => $builder->where('oficina_id', $oficinaId))
            ->when($filters['estado'] ?? null, fn (Builder $builder, string $estado) => $builder->where('estado', $estado))
            ->orderBy('nombre');

        $page = (int) ($filters['page'] ?? 1);
        $perPage = (int) ($filters['per_page'] ?? 15);

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function transformarLista(LengthAwarePaginator $paginator): array
    {
        return [
            'data' => EquipoResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ];
    }
}
