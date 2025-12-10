<?php

namespace App\Services\Arca;

use App\Models\Venta;

class ArcaService
{
    public function enviarComprobante(Venta $venta): array
    {
        return [
            'status' => 'pending',
            'message' => 'Integración con ARCA aún no implementada',
            'venta_id' => $venta->id,
        ];
    }
}
