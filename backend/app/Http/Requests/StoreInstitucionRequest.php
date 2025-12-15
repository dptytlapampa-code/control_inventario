<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInstitucionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo_institucion_id' => 'required|exists:tipos_institucion,id',
            'nombre' => 'required|string|max:255',
            'localidad' => 'required|string|max:255',
            'domicilio' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:50',
            'zona_sanitaria' => 'nullable|string|max:100',
            'latitud' => 'nullable|numeric|between:-90,90',
            'longitud' => 'nullable|numeric|between:-180,180',
            'activo' => 'boolean'
        ];
    }
}
