<?php

namespace App\Http\Controllers;

use App\Http\Requests\Equipos\EquipoFilterRequest;
use App\Http\Resources\Equipos\EquipoResource;
use App\Services\EquiposService;
use Illuminate\Http\JsonResponse;

class EquiposController extends Controller
{
    public function __construct(private readonly EquiposService $equiposService)
    {
    }

    public function index(EquipoFilterRequest $request): JsonResponse
    {
        $paginator = $this->equiposService->listar($request->validated());

        return response()->json([
            'data' => EquipoResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }
}
