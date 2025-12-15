<?php

namespace App\Http\Requests\Mantenimientos;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MantenimientoUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'equipo_id' => ['sometimes', 'uuid', 'exists:equipos,id'],
            'hospital_id' => ['sometimes', 'uuid', 'exists:instituciones,id'],
            'servicio_id' => ['sometimes', 'nullable', 'uuid', 'exists:unidades_organizacionales,id'],
            'oficina_id' => ['sometimes', 'nullable', 'uuid', 'exists:unidades_organizacionales,id'],
            'tipo' => ['sometimes', 'string', 'max:255'],
            'descripcion' => ['sometimes', 'nullable', 'string'],
            'estado' => ['sometimes', 'string', Rule::in(['pendiente', 'en_progreso', 'completado', 'cancelado'])],
            'fecha' => ['sometimes', 'date'],
            'costo' => ['sometimes', 'nullable', 'numeric', 'min:0'],
        ];
    }
}
