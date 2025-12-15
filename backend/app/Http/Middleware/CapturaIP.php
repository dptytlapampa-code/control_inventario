<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CapturaIP
{
    public function handle(Request $request, Closure $next)
    {
        $ip = $request->header('X-Forwarded-For')
            ? trim(explode(',', $request->header('X-Forwarded-For'))[0])
            : $request->ip();

        $request->attributes->set('ip_address', $ip);

        return $next($request);
    }
}
