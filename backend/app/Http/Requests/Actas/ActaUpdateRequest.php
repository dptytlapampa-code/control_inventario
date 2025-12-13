<?php

namespace App\Http\Requests\Actas;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActaUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo' => ['sometimes', 'string', Rule::in(['entrega', 'traslado', 'baja', 'prestamo'])],
            'equipo_id' => ['sometimes', 'uuid', 'exists:equipos,id'],
            'hospital_id' => ['sometimes', 'nullable', 'uuid', 'exists:instituciones,id'],
            'receptor_nombre' => ['sometimes', 'string', 'max:255'],
            'receptor_identificacion' => ['sometimes', 'nullable', 'string', 'max:255'],
            'receptor_cargo' => ['sometimes', 'nullable', 'string', 'max:255'],
            'motivo' => ['sometimes', 'string', 'max:2000'],
            'data' => ['sometimes', 'nullable', 'array'],
            'path' => ['sometimes', 'nullable', 'string', 'max:1024'],
        ];
    }
}
