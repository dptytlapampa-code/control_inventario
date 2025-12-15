<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEquipoAdjuntoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'archivo' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'archivo.required' => 'El archivo es obligatorio.',
            'archivo.file' => 'El adjunto debe ser un archivo válido.',
            'archivo.mimes' => 'Tipos permitidos: pdf, jpg, jpeg, png.',
            'archivo.max' => 'El tamaño máximo permitido es de 5 MB.',
        ];
    }
}
