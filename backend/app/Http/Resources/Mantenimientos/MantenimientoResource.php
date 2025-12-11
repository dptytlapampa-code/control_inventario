<?php

namespace App\Http\Resources\Mantenimientos;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MantenimientoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'equipo_id' => $this->equipo_id,
            'hospital_id' => $this->hospital_id,
            'servicio_id' => $this->servicio_id,
            'oficina_id' => $this->oficina_id,
            'tipo' => $this->tipo,
            'descripcion' => $this->descripcion,
            'estado' => $this->estado,
            'fecha' => $this->fecha,
            'costo' => $this->costo ?? null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
