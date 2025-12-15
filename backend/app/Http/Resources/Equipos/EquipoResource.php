<?php

namespace App\Http\Resources\Equipos;

use App\Http\Resources\InstitucionResource;
use App\Http\Resources\UnidadOrganizacionalResource;
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
            'created_by' => $this->created_by,
            'hospital' => new InstitucionResource($this->whenLoaded('hospital')),
            'servicio' => new UnidadOrganizacionalResource($this->whenLoaded('servicio')),
            'oficina' => new UnidadOrganizacionalResource($this->whenLoaded('oficina')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
