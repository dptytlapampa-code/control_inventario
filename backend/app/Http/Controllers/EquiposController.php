<?php

namespace App\Http\Controllers;

use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class EquiposController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'q' => 'nullable|string|max:255',
            'hospital_id' => 'nullable|string',
            'servicio_id' => 'nullable|string',
            'oficina_id' => 'nullable|string',
            'estado' => 'nullable|string',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = DB::table('equipos')
            ->when($validated['q'] ?? null, function (Builder $builder, string $texto) {
                $builder->where(function (Builder $query) use ($texto) {
                    $query->where('nombre', 'like', "%{$texto}%")
                        ->orWhere('serie', 'like', "%{$texto}%")
                        ->orWhere('bien_patrimonial', 'like', "%{$texto}%");
                });
            })
            ->when($validated['hospital_id'] ?? null, fn (Builder $builder, string $hospitalId) => $builder->where('hospital_id', $hospitalId))
            ->when($validated['servicio_id'] ?? null, fn (Builder $builder, string $servicioId) => $builder->where('servicio_id', $servicioId))
            ->when($validated['oficina_id'] ?? null, fn (Builder $builder, string $oficinaId) => $builder->where('oficina_id', $oficinaId))
            ->when($validated['estado'] ?? null, fn (Builder $builder, string $estado) => $builder->where('estado', $estado))
            ->orderBy('nombre');

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
