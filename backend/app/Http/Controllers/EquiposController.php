<?php

namespace App\Http\Controllers;

use App\Http\Requests\Equipos\EquipoFilterRequest;
use App\Http\Requests\Equipos\EquipoStoreRequest;
use App\Http\Requests\Equipos\EquipoUpdateRequest;
use App\Http\Resources\Equipos\EquipoResource;
use App\Models\Equipo;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class EquiposController extends Controller
{
    public function index(EquipoFilterRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $perPage = (int) ($filters['per_page'] ?? 15);
        $page = (int) ($filters['page'] ?? 1);

        /** @var LengthAwarePaginator $paginator */
        $paginator = Equipo::with(['hospital', 'servicio', 'oficina'])
            ->applyFilters($filters)
            ->orderBy('nombre')
            ->paginate($perPage, ['*'], 'page', $page);

        return EquipoResource::collection($paginator)->response();
    }

    public function store(EquipoStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['created_by'] = $request->user()?->id;

        $equipo = DB::transaction(fn () => Equipo::create($data));

        return (new EquipoResource($equipo->load(['hospital', 'servicio', 'oficina'])))->response()->setStatusCode(201);
    }

    public function show(Equipo $equipo): JsonResponse
    {
        return (new EquipoResource($equipo->load(['hospital', 'servicio', 'oficina'])))->response();
    }

    public function update(EquipoUpdateRequest $request, Equipo $equipo): JsonResponse
    {
        $equipo->fill($request->validated());
        $equipo->save();

        return (new EquipoResource($equipo->load(['hospital', 'servicio', 'oficina'])))->response();
    }

    public function destroy(Equipo $equipo): JsonResponse
    {
        $equipo->delete();

        return response()->json(null, 204);
    }
}
