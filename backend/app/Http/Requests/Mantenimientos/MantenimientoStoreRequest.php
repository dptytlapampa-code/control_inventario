<?php

namespace App\Http\Requests\Mantenimientos;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MantenimientoStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'equipo_id' => ['required', 'uuid', 'exists:equipos,id'],
            'hospital_id' => ['required', 'uuid', 'exists:instituciones,id'],
            'servicio_id' => ['nullable', 'uuid', 'exists:unidades_organizacionales,id'],
            'oficina_id' => ['nullable', 'uuid', 'exists:unidades_organizacionales,id'],
            'tipo' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'estado' => ['required', 'string', Rule::in(['pendiente', 'en_progreso', 'completado', 'cancelado'])],
            'fecha' => ['required', 'date'],
            'costo' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
