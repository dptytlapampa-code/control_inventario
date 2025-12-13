<?php

namespace App\Http\Controllers;

use App\Http\Requests\Actas\ActaFilterRequest;
use App\Http\Requests\Actas\ActaStoreRequest;
use App\Http\Requests\Actas\ActaUpdateRequest;
use App\Http\Resources\Actas\ActaResource;
use App\Models\Acta;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ActasController extends Controller
{
    public function index(ActaFilterRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $perPage = (int) ($filters['per_page'] ?? 15);
        $page = (int) ($filters['page'] ?? 1);

        /** @var LengthAwarePaginator $paginator */
        $paginator = Acta::with(['equipo', 'hospital'])
            ->applyFilters($filters)
            ->orderByDesc('created_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return ActaResource::collection($paginator)->response();
    }

    public function store(ActaStoreRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['created_by'] = $request->user()?->id;

        $acta = DB::transaction(fn () => Acta::create($data));

        return (new ActaResource($acta->load(['equipo', 'hospital'])))->response()->setStatusCode(201);
    }

    public function show(Acta $acta): JsonResponse
    {
        return (new ActaResource($acta->load(['equipo', 'hospital'])))->response();
    }

    public function update(ActaUpdateRequest $request, Acta $acta): JsonResponse
    {
        $acta->fill($request->validated());
        $acta->save();

        return (new ActaResource($acta->load(['equipo', 'hospital'])))->response();
    }

    public function destroy(Acta $acta): JsonResponse
    {
        $acta->delete();

        return response()->json(null, 204);
    }
}
