<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEquipoHistorialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo_evento' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'fecha_evento' => ['required', 'date'],
            'oficina_origen_id' => ['nullable', 'uuid', Rule::exists('unidades_organizacionales', 'id')],
            'oficina_destino_id' => ['nullable', 'uuid', Rule::exists('unidades_organizacionales', 'id')],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $origen = $this->input('oficina_origen_id');
            $destino = $this->input('oficina_destino_id');

            if ($origen && $destino && $origen === $destino) {
                $validator->errors()->add('oficina_destino_id', 'La oficina de destino debe ser diferente a la de origen.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'tipo_evento.required' => 'El tipo de evento es obligatorio.',
            'tipo_evento.max' => 'El tipo de evento no puede superar 255 caracteres.',
            'fecha_evento.required' => 'La fecha del evento es obligatoria.',
            'fecha_evento.date' => 'La fecha del evento debe ser una fecha válida.',
            'oficina_origen_id.uuid' => 'La oficina de origen debe tener un identificador válido.',
            'oficina_destino_id.uuid' => 'La oficina de destino debe tener un identificador válido.',
            'oficina_origen_id.exists' => 'La oficina de origen seleccionada no existe.',
            'oficina_destino_id.exists' => 'La oficina de destino seleccionada no existe.',
        ];
    }
}
