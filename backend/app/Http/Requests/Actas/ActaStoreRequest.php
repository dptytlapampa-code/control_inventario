<?php

namespace App\Http\Requests\Actas;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActaStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo' => ['required', 'string', Rule::in(['entrega', 'traslado', 'baja', 'prestamo'])],
            'equipo_id' => ['required', 'uuid', 'exists:equipos,id'],
            'hospital_id' => ['nullable', 'uuid', 'exists:instituciones,id'],
            'receptor_nombre' => ['required', 'string', 'max:255'],
            'receptor_identificacion' => ['nullable', 'string', 'max:255'],
            'receptor_cargo' => ['nullable', 'string', 'max:255'],
            'motivo' => ['required', 'string', 'max:2000'],
            'data' => ['nullable', 'array'],
            'path' => ['nullable', 'string', 'max:1024'],
        ];
    }
}
