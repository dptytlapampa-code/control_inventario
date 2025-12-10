<?php

namespace App\Services;

use App\Models\Auditoria;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class AuditoriaService
{
    public static function registrar($accion, $modulo, $objetoId = null, $antes = null, $despues = null): void
    {
        try {
            if (!$accion || !$modulo) {
                return;
            }

            $request = request();
            $user = auth()->user();
            $roles = self::extraerRoles($user);

            Auditoria::create([
                'user_id' => $user?->id,
                'user_name' => $user?->name ?? $user?->username ?? $user?->email,
                'user_email' => $user?->email,
                'user_role' => $roles,
                'ip_address' => $request?->attributes->get('ip_address') ?? $request?->ip(),
                'accion' => $accion,
                'modulo' => $modulo,
                'objeto_id' => $objetoId,
                'antes' => self::sanitizarDatos($antes),
                'despues' => self::sanitizarDatos($despues),
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error registrando auditoría', [
                'accion' => $accion,
                'modulo' => $modulo,
                'objeto_id' => $objetoId,
                'error' => $exception->getMessage(),
            ]);
        }
    }

    private static function sanitizarDatos($data)
    {
        if (is_null($data)) {
            return null;
        }

        $arrayData = json_decode(json_encode($data), true);

        $sensibles = ['password', 'contrasena', 'token', 'secret', 'remember_token'];

        $filtrar = function ($value) use (&$filtrar, $sensibles) {
            if (!is_array($value)) {
                return $value;
            }

            $sanitizado = [];

            foreach ($value as $clave => $contenido) {
                if (in_array(strtolower((string) $clave), $sensibles, true)) {
                    continue;
                }

                $sanitizado[$clave] = $filtrar($contenido);
            }

            return $sanitizado;
        };

        return $filtrar($arrayData);
    }

    private static function extraerRoles($user): ?string
    {
        if (!$user) {
            return null;
        }

        if (method_exists($user, 'getRolesAttribute')) {
            $roles = $user->roles ?? [];
        } else {
            $roles = $user->roles ?? ($user->role ?? null);
        }

        if (is_array($roles)) {
            return implode(',', Arr::flatten($roles));
        }

        return $roles ? (string) $roles : null;
    }
}
