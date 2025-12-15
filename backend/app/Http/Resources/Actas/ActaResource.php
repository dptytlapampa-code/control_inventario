<?php

namespace App\Http\Resources\Actas;

use App\Http\Resources\Equipos\EquipoResource;
use App\Http\Resources\InstitucionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ActaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tipo' => $this->tipo,
            'equipo_id' => $this->equipo_id,
            'hospital_id' => $this->hospital_id,
            'created_by' => $this->created_by,
            'receptor_nombre' => $this->receptor_nombre,
            'receptor_identificacion' => $this->receptor_identificacion,
            'receptor_cargo' => $this->receptor_cargo,
            'motivo' => $this->motivo,
            'data' => $this->data,
            'path' => $this->path,
            'url' => $this->path ? Storage::disk('public')->url($this->path) : null,
            'equipo' => new EquipoResource($this->whenLoaded('equipo')),
            'hospital' => new InstitucionResource($this->whenLoaded('hospital')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
