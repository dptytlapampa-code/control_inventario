<?php

namespace App\Http\Resources\Mantenimientos;

use App\Http\Resources\Equipos\EquipoResource;
use App\Http\Resources\InstitucionResource;
use App\Http\Resources\UnidadOrganizacionalResource;
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
            'created_by' => $this->created_by,
            'equipo' => new EquipoResource($this->whenLoaded('equipo')),
            'hospital' => new InstitucionResource($this->whenLoaded('hospital')),
            'servicio' => new UnidadOrganizacionalResource($this->whenLoaded('servicio')),
            'oficina' => new UnidadOrganizacionalResource($this->whenLoaded('oficina')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
