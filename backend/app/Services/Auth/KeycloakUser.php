<?php

namespace App\Services\Auth;

use Illuminate\Contracts\Auth\Authenticatable;

class KeycloakUser implements Authenticatable
{
    protected $attributes = [];

    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }

    public function getAuthIdentifierName()
    {
        return 'id';
    }

    public function getAuthIdentifier()
    {
        return $this->attributes['id'] ?? null;
    }

    public function getAuthPassword()
    {
        return null; // no se usa, ya que la autenticación es vía JWT
    }

    public function getRememberToken() { return null; }
    public function setRememberToken($value) {}
    public function getRememberTokenName() { return null; }

    public function __get($key)
    {
        return $this->attributes[$key] ?? null;
    }

    public function toArray()
    {
        return $this->attributes;
    }
}
