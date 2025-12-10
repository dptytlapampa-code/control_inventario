<?php

namespace App\Http\Controllers\Pos;

use App\Http\Controllers\Controller;
use App\Services\Arca\ArcaService;
use Illuminate\Http\JsonResponse;

class ArcaController extends Controller
{
    protected ArcaService $arcaService;

    public function __construct(ArcaService $arcaService)
    {
        $this->arcaService = $arcaService;
    }

    public function test(): JsonResponse
    {
        return response()->json($this->arcaService->enviarComprobante(new \App\Models\Venta([
            'id' => 0,
            'numero_ticket' => 0,
        ])));
    }
}
