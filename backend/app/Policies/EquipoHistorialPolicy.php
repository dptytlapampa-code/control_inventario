<?php

namespace App\Policies;

use App\Models\EquipoHistorial;
use App\Services\Auth\KeycloakUser;

class EquipoHistorialPolicy
{
    protected function hasInventoryRole(?KeycloakUser $user): bool
    {
        return in_array('superadmin', $user?->roles ?? []);
    }

    public function viewAny(?KeycloakUser $user, string $equipoId): bool
    {
        return $this->hasInventoryRole($user);
    }

    public function create(?KeycloakUser $user): bool
    {
        return $this->hasInventoryRole($user);
    }

    public function update(?KeycloakUser $user, EquipoHistorial $historial): bool
    {
        return $this->hasInventoryRole($user);
    }

    public function delete(?KeycloakUser $user, EquipoHistorial $historial): bool
    {
        return $this->hasInventoryRole($user);
    }
}
