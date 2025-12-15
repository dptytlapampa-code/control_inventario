<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InstitucionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'tipo_institucion_id' => $this->tipo_institucion_id,
            'tipo' => $this->tipo->nombre ?? null,
            'nombre' => $this->nombre,
            'localidad' => $this->localidad,
            'domicilio' => $this->domicilio,
            'telefono' => $this->telefono,
            'zona_sanitaria' => $this->zona_sanitaria,
            'latitud' => $this->latitud,
            'longitud' => $this->longitud,
            'activo' => $this->activo,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
