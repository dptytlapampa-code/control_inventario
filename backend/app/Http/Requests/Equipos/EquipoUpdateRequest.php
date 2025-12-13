<?php

namespace App\Http\Requests\Equipos;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EquipoUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['sometimes', 'string', 'max:255'],
            'serie' => ['sometimes', 'nullable', 'string', 'max:255'],
            'bien_patrimonial' => ['sometimes', 'nullable', 'string', 'max:255'],
            'hospital_id' => ['sometimes', 'uuid', 'exists:instituciones,id'],
            'servicio_id' => ['sometimes', 'nullable', 'uuid', 'exists:unidades_organizacionales,id'],
            'oficina_id' => ['sometimes', 'nullable', 'uuid', 'exists:unidades_organizacionales,id'],
            'estado' => ['sometimes', 'string', Rule::in(['activo', 'inactivo', 'baja', 'mantenimiento'])],
            'descripcion' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
