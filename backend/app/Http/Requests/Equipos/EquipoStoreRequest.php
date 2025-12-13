<?php

namespace App\Http\Requests\Equipos;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EquipoStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'serie' => ['nullable', 'string', 'max:255'],
            'bien_patrimonial' => ['nullable', 'string', 'max:255'],
            'hospital_id' => ['required', 'uuid', 'exists:instituciones,id'],
            'servicio_id' => ['nullable', 'uuid', 'exists:unidades_organizacionales,id'],
            'oficina_id' => ['nullable', 'uuid', 'exists:unidades_organizacionales,id'],
            'estado' => ['required', 'string', Rule::in(['activo', 'inactivo', 'baja', 'mantenimiento'])],
            'descripcion' => ['nullable', 'string'],
        ];
    }
}
