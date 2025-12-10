<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $userRoles = $this->extractRoles($request);
        foreach ($roles as $role) {
            if (in_array($role, $userRoles)) {
                return $next($request);
            }
        }

        return response()->json(['message' => 'Acceso no autorizado.'], 403);
    }

    protected function extractRoles(Request $request): array
    {
        $user = $request->user();
        if ($user && is_array($user->roles ?? null)) {
            return $user->roles;
        }

        $authHeader = $request->header('Authorization');
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $parts = explode('.', substr($authHeader, 7));
            if (count($parts) === 3) {
                $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])) ?? '', true);
                if (isset($payload['realm_access']['roles']) && is_array($payload['realm_access']['roles'])) {
                    return $payload['realm_access']['roles'];
                }
            }
        }

        return [];
    }
}
