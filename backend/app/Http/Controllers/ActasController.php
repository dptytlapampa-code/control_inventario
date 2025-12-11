<?php

namespace App\Http\Controllers;

use App\Http\Requests\Actas\ActaFilterRequest;
use App\Http\Requests\Actas\ActaGenerateRequest;
use App\Http\Resources\Actas\ActaResource;
use App\Models\Acta;
use App\Services\ActasService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ActasController extends Controller
{
    public function __construct(private readonly ActasService $actasService)
    {
    }

    public function index(ActaFilterRequest $request): JsonResponse
    {
        $paginator = $this->actasService->listar($request->validated());

        return response()->json([
            'data' => ActaResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    public function generarEntrega(ActaGenerateRequest $request, string $equipoId): JsonResponse
    {
        $acta = $this->actasService->generar('entrega', array_merge($request->validated(), ['equipo_id' => $equipoId]), $request->user());

        return (new ActaResource($acta))
            ->response()
            ->setStatusCode(201);
    }

    public function generarTraslado(ActaGenerateRequest $request, string $equipoId): JsonResponse
    {
        $acta = $this->actasService->generar('traslado', array_merge($request->validated(), ['equipo_id' => $equipoId]), $request->user());

        return (new ActaResource($acta))
            ->response()
            ->setStatusCode(201);
    }

    public function generarBaja(ActaGenerateRequest $request, string $equipoId): JsonResponse
    {
        $acta = $this->actasService->generar('baja', array_merge($request->validated(), ['equipo_id' => $equipoId]), $request->user());

        return (new ActaResource($acta))
            ->response()
            ->setStatusCode(201);
    }

    public function generarPrestamo(ActaGenerateRequest $request, string $equipoId): JsonResponse
    {
        $acta = $this->actasService->generar('prestamo', array_merge($request->validated(), ['equipo_id' => $equipoId]), $request->user());

        return (new ActaResource($acta))
            ->response()
            ->setStatusCode(201);
    }

    public function download(string $id)
    {
        $acta = Acta::findOrFail($id);
        $this->ensureActaPermission($acta);

        return $this->actasService->descargar($acta);
    }

    private function ensureActaPermission(Acta $acta): void
    {
        $user = request()->user();

        if (Gate::forUser($user)->allows('viewAny', Acta::class)) {
            return;
        }

        $userHospital = $user->hospital_id ?? null;

        if ($acta->hospital_id && $userHospital && $acta->hospital_id !== $userHospital) {
            abort(403, 'No autorizado para acceder a esta acta.');
        }
    }
}
