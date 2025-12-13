<?php

namespace App\Http\Requests\Mantenimientos;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MantenimientoFilterRequest extends FormRequest
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
            'estado' => ['nullable', 'string', Rule::in(['pendiente', 'en_progreso', 'completado', 'cancelado'])],
            'fecha_desde' => 'nullable|date',
            'fecha_hasta' => 'nullable|date',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}
