<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class KeycloakRoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        $user = auth()->user();

        $requiredRoles = array_filter(explode('|', $role));
        $userRoles = $user->roles ?? [];

        $hasRole = !empty(array_intersect($requiredRoles, $userRoles));

        if (!$user || !$hasRole) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
