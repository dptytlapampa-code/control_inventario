<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTipoInstitucionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255|unique:tipos_institucion,nombre,' . $this->route('id'),
            'descripcion' => 'nullable|string|max:500',
            'activo' => 'boolean'
        ];
    }
}
