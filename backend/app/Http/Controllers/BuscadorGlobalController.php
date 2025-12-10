<?php

namespace App\Http\Controllers;

use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class BuscadorGlobalController extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'q' => 'required|string|min:2|max:255',
            'modulo' => 'nullable|in:equipos,hospitales,oficinas,mantenimientos,actas,all,servicios',
            'hospital_id' => 'nullable|string',
            'estado_equipo' => 'nullable|string',
            'fecha_desde' => 'nullable|date',
            'fecha_hasta' => 'nullable|date',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $modulo = $validated['modulo'] ?? 'all';

        return match ($modulo) {
            'equipos' => $this->formatPaginatedResponse($this->searchEquipos($validated)),
            'hospitales' => $this->formatPaginatedResponse($this->searchHospitales($validated)),
            'servicios' => $this->formatPaginatedResponse($this->searchServicios($validated)),
            'oficinas' => $this->formatPaginatedResponse($this->searchOficinas($validated)),
            'mantenimientos' => $this->formatPaginatedResponse($this->searchMantenimientos($validated)),
            'actas' => $this->formatPaginatedResponse($this->searchActas($validated)),
            default => $this->formatPaginatedResponse($this->searchAll($validated)),
        };
    }

    private function searchEquipos(array $filters): LengthAwarePaginator
    {
        $query = $this->applyEquipoFilters($filters);

        return $this->paginate($query, $filters);
    }

    private function searchHospitales(array $filters): LengthAwarePaginator
    {
        return $this->paginate($this->buildHospitalQuery($filters), $filters);
    }

    private function searchServicios(array $filters): LengthAwarePaginator
    {
        return $this->paginate($this->applyUnidadFilters('servicio', $filters), $filters);
    }

    private function searchOficinas(array $filters): LengthAwarePaginator
    {
        return $this->paginate($this->applyUnidadFilters('oficina', $filters), $filters);
    }

    private function searchMantenimientos(array $filters): LengthAwarePaginator
    {
        return $this->paginate($this->buildMantenimientoQuery($filters), $filters);
    }

    private function searchActas(array $filters): LengthAwarePaginator
    {
        return $this->paginate($this->buildActaQuery($filters), $filters);
    }

    private function searchAll(array $filters): LengthAwarePaginator
    {
        $queries = [
            $this->applyEquipoFilters($filters),
            $this->buildHospitalQuery($filters),
            $this->applyUnidadFilters('servicio', $filters),
            $this->applyUnidadFilters('oficina', $filters),
            $this->buildMantenimientoQuery($filters),
            $this->buildActaQuery($filters),
        ];

        /** @var Builder|null $union */
        $union = null;
        foreach ($queries as $query) {
            if ($query instanceof Builder) {
                $union = $union ? $union->unionAll($query) : $query;
            }
        }

        if (!$union) {
            return new LengthAwarePaginator([], 0, $filters['per_page'] ?? 15, $filters['page'] ?? 1);
        }

        $wrapped = DB::query()
            ->fromSub($union, 'resultados')
            ->orderByDesc('fecha')
            ->orderBy('nombre');

        return $this->paginate($wrapped, $filters);
    }

    private function applyEquipoFilters(array $filters): Builder
    {
        return DB::table('equipos')
            ->select([
                'id',
                'nombre',
                'estado',
                'hospital_id',
                'servicio_id',
                'oficina_id',
                DB::raw('NULL as fecha'),
                DB::raw('NULL as descripcion'),
                DB::raw("'equipo' as tipo"),
            ])
            ->when(isset($filters['q']), function (Builder $builder) use ($filters) {
                $builder->where(function (Builder $query) use ($filters) {
                    $query->where('nombre', 'like', '%' . $filters['q'] . '%')
                        ->orWhere('serie', 'like', '%' . $filters['q'] . '%')
                        ->orWhere('bien_patrimonial', 'like', '%' . $filters['q'] . '%');
                });
            })
            ->when(isset($filters['hospital_id']), fn (Builder $builder) => $builder->where('hospital_id', $filters['hospital_id']))
            ->when(isset($filters['estado_equipo']), fn (Builder $builder) => $builder->where('estado', $filters['estado_equipo']))
            ->orderBy('nombre');
    }

    private function applyUnidadFilters(string $tipo, array $filters): Builder
    {
        return DB::table('unidades_organizacionales')
            ->select([
                'id',
                'nombre',
                DB::raw('NULL as estado'),
                'institucion_id as hospital_id',
                DB::raw('NULL as servicio_id'),
                DB::raw('NULL as oficina_id'),
                DB::raw('NULL as fecha'),
                'descripcion',
                DB::raw("'{$tipo}' as tipo"),
            ])
            ->where('tipo', $tipo)
            ->when(isset($filters['q']), function (Builder $builder) use ($filters) {
                $builder->where(function (Builder $query) use ($filters) {
                    $query->where('nombre', 'like', '%' . $filters['q'] . '%')
                        ->orWhere('descripcion', 'like', '%' . $filters['q'] . '%');
                });
            })
            ->when(isset($filters['hospital_id']), fn (Builder $builder) => $builder->where('institucion_id', $filters['hospital_id']))
            ->orderBy('nombre');
    }

    private function buildHospitalQuery(array $filters): Builder
    {
        return DB::table('instituciones')
            ->select([
                'id',
                'nombre',
                'localidad as descripcion',
                DB::raw('NULL as estado'),
                DB::raw('NULL as hospital_id'),
                DB::raw('NULL as servicio_id'),
                DB::raw('NULL as oficina_id'),
                DB::raw('NULL as fecha'),
                DB::raw("'hospital' as tipo"),
            ])
            ->where(function (Builder $builder) use ($filters) {
                $builder->where('nombre', 'like', '%' . $filters['q'] . '%')
                    ->orWhere('localidad', 'like', '%' . $filters['q'] . '%')
                    ->orWhere('domicilio', 'like', '%' . $filters['q'] . '%');
            });
    }

    private function buildMantenimientoQuery(array $filters): Builder
    {
        return DB::table('mantenimientos')
            ->select([
                'id',
                DB::raw('COALESCE(descripcion, tipo, "Mantenimiento") as nombre'),
                'estado',
                'hospital_id',
                'servicio_id',
                'oficina_id',
                'fecha',
                DB::raw('descripcion'),
                DB::raw("'mantenimiento' as tipo"),
            ])
            ->when(isset($filters['q']), function (Builder $builder) use ($filters) {
                $builder->where(function (Builder $query) use ($filters) {
                    $query->where('descripcion', 'like', '%' . $filters['q'] . '%')
                        ->orWhere('tipo', 'like', '%' . $filters['q'] . '%')
                        ->orWhere('estado', 'like', '%' . $filters['q'] . '%');
                });
            })
            ->when(isset($filters['hospital_id']), fn (Builder $builder) => $builder->where('hospital_id', $filters['hospital_id']))
            ->when(isset($filters['fecha_desde']), fn (Builder $builder) => $builder->whereDate('fecha', '>=', $filters['fecha_desde']))
            ->when(isset($filters['fecha_hasta']), fn (Builder $builder) => $builder->whereDate('fecha', '<=', $filters['fecha_hasta']))
            ->orderByDesc('fecha');
    }

    private function buildActaQuery(array $filters): Builder
    {
        return DB::table('actas')
            ->select([
                'id',
                DB::raw('CONCAT("Acta ", tipo) as nombre'),
                'tipo as estado',
                'hospital_id',
                DB::raw('NULL as servicio_id'),
                DB::raw('NULL as oficina_id'),
                'created_at as fecha',
                DB::raw('motivo as descripcion'),
                DB::raw("'acta' as tipo"),
            ])
            ->when(isset($filters['q']), function (Builder $builder) use ($filters) {
                $builder->where(function (Builder $query) use ($filters) {
                    $query->where('motivo', 'like', '%' . $filters['q'] . '%')
                        ->orWhere('tipo', 'like', '%' . $filters['q'] . '%')
                        ->orWhere('receptor_nombre', 'like', '%' . $filters['q'] . '%');
                });
            })
            ->when(isset($filters['hospital_id']), fn (Builder $builder) => $builder->where('hospital_id', $filters['hospital_id']))
            ->when(isset($filters['fecha_desde']), fn (Builder $builder) => $builder->whereDate('created_at', '>=', $filters['fecha_desde']))
            ->when(isset($filters['fecha_hasta']), fn (Builder $builder) => $builder->whereDate('created_at', '<=', $filters['fecha_hasta']))
            ->orderByDesc('created_at');
    }

    private function paginate(Builder $query, array $filters): LengthAwarePaginator
    {
        $page = (int) ($filters['page'] ?? 1);
        $perPage = (int) ($filters['per_page'] ?? 15);

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    private function formatPaginatedResponse(LengthAwarePaginator $paginator)
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
