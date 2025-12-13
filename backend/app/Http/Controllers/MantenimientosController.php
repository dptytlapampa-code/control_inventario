<?php

namespace App\Http\Controllers;

use App\Http\Requests\Mantenimientos\MantenimientoFilterRequest;
use App\Http\Requests\Mantenimientos\MantenimientoStoreRequest;
use App\Http\Requests\Mantenimientos\MantenimientoUpdateRequest;
use App\Http\Resources\Mantenimientos\MantenimientoResource;
use App\Models\Mantenimiento;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class MantenimientosController extends Controller
{
    public function index(MantenimientoFilterRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $perPage = (int) ($filters['per_page'] ?? 15);
        $page = (int) ($filters['page'] ?? 1);

        /** @var LengthAwarePaginator $paginator */
        $paginator = Mantenimiento::with(['equipo', 'hospital', 'servicio', 'oficina'])
            ->applyFilters($filters)
            ->orderByDesc('fecha')
            ->paginate($perPage, ['*'], 'page', $page);

        return MantenimientoResource::collection($paginator)->response();
    }

    public function store(MantenimientoStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['created_by'] = $request->user()?->id;

        $mantenimiento = DB::transaction(fn () => Mantenimiento::create($data));

        return (new MantenimientoResource($mantenimiento->load(['equipo', 'hospital', 'servicio', 'oficina'])))->response()->setStatusCode(201);
    }

    public function show(Mantenimiento $mantenimiento): JsonResponse
    {
        return (new MantenimientoResource($mantenimiento->load(['equipo', 'hospital', 'servicio', 'oficina'])))->response();
    }

    public function update(MantenimientoUpdateRequest $request, Mantenimiento $mantenimiento): JsonResponse
    {
        $mantenimiento->fill($request->validated());
        $mantenimiento->save();

        return (new MantenimientoResource($mantenimiento->load(['equipo', 'hospital', 'servicio', 'oficina'])))->response();
    }

    public function destroy(Mantenimiento $mantenimiento): JsonResponse
    {
        $mantenimiento->delete();

        return response()->json(null, 204);
    }
}
