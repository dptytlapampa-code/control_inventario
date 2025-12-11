<?php

namespace App\Http\Requests\Equipos;

use Illuminate\Foundation\Http\FormRequest;

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
            'hospital_id' => 'nullable|string',
            'servicio_id' => 'nullable|string',
            'oficina_id' => 'nullable|string',
            'estado' => 'nullable|string',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}
