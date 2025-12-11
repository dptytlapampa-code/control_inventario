<?php

namespace App\Http\Resources\Equipos;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'serie' => $this->serie,
            'bien_patrimonial' => $this->bien_patrimonial,
            'hospital_id' => $this->hospital_id,
            'servicio_id' => $this->servicio_id,
            'oficina_id' => $this->oficina_id,
            'estado' => $this->estado,
            'descripcion' => $this->descripcion ?? null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
