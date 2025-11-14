<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class KeycloakRoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        $user = auth()->user();

        if (!$user || !in_array($role, $user->roles ?? [])) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
