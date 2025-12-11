<?php

namespace App\Http\Controllers;

use App\Http\Requests\Mantenimientos\MantenimientoFilterRequest;
use App\Http\Resources\Mantenimientos\MantenimientoResource;
use App\Services\MantenimientosService;
use Illuminate\Http\JsonResponse;

class MantenimientosController extends Controller
{
    public function __construct(private readonly MantenimientosService $mantenimientosService)
    {
    }

    public function index(MantenimientoFilterRequest $request): JsonResponse
    {
        $paginator = $this->mantenimientosService->listar($request->validated());

        return response()->json([
            'data' => MantenimientoResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }
}
