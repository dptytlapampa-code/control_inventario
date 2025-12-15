<?php

namespace App\Http\Requests\Equipos;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EquipoFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'q' => 'nullable|string|max:255',
            'hospital_id' => 'nullable|uuid|exists:instituciones,id',
            'servicio_id' => 'nullable|uuid|exists:unidades_organizacionales,id',
            'oficina_id' => 'nullable|uuid|exists:unidades_organizacionales,id',
            'estado' => ['nullable', 'string', Rule::in(['activo', 'inactivo', 'baja', 'mantenimiento'])],
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}
