<?php

namespace App\Http\Requests\Actas;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActaFilterRequest extends FormRequest
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
            'tipo' => ['nullable', 'string', Rule::in(['entrega', 'traslado', 'baja', 'prestamo'])],
            'fecha_desde' => 'nullable|date',
            'fecha_hasta' => 'nullable|date',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}
