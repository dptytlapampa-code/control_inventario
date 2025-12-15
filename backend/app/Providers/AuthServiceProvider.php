<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Auth;
use App\Services\Auth\KeycloakGuard;
use App\Models\EquipoHistorial;
use App\Policies\EquipoHistorialPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        EquipoHistorial::class => EquipoHistorialPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot()
    {
        $this->registerPolicies();

        Auth::extend('keycloak', function ($app, $name, array $config) {
            return new KeycloakGuard();
        });
    }
}
