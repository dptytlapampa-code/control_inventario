<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUsuarioPermisoRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user && in_array('superadmin', $user->roles ?? []);
    }

    public function rules(): array
    {
        return [
            'permisos' => ['required', 'array', 'min:1'],
            'permisos.*.modulo' => ['required', 'string', 'max:100'],
            'permisos.*.hospital_id' => ['nullable', 'string', 'max:191'],
            'permisos.*.puede_ver' => ['sometimes', 'boolean'],
            'permisos.*.puede_crear' => ['sometimes', 'boolean'],
            'permisos.*.puede_editar' => ['sometimes', 'boolean'],
            'permisos.*.puede_eliminar' => ['sometimes', 'boolean'],
        ];
    }
}
