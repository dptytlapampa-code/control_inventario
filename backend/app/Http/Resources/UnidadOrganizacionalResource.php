<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UnidadOrganizacionalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'institucion_id' => $this->institucion_id,
            'parent_id' => $this->parent_id,
            'nombre' => $this->nombre,
            'tipo' => $this->tipo,
            'descripcion' => $this->descripcion,
            'activo' => $this->activo,
        ];
    }
}
