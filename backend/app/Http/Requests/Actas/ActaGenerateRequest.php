<?php

namespace App\Http\Requests\Actas;

use Illuminate\Foundation\Http\FormRequest;

class ActaGenerateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'motivo' => 'required|string|max:2000',
            'receptor_nombre' => 'required|string|max:255',
            'receptor_identificacion' => 'nullable|string|max:255',
            'receptor_cargo' => 'nullable|string|max:255',
            'equipo' => 'nullable|array',
            'equipo.nombre' => 'nullable|string|max:255',
            'equipo.marca' => 'nullable|string|max:255',
            'equipo.modelo' => 'nullable|string|max:255',
            'equipo.serie' => 'nullable|string|max:255',
            'equipo.codigo' => 'nullable|string|max:255',
            'equipo.ubicacion' => 'nullable|string|max:255',
            'hospital_id' => 'nullable|string|max:255',
            'detalle' => 'nullable|string|max:4000',
        ];
    }
}
