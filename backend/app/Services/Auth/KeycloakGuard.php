<?php

namespace App\Services\Auth;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\Authenticatable;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\UnencryptedToken;
use GuzzleHttp\Client;
use Lcobucci\Clock\SystemClock;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Validation\Constraint\StrictValidAt;

class KeycloakGuard implements Guard
{
    protected $user;
    protected $config;
    protected $jwtConfig;

    public function __construct()
    {
        $this->config = config('keycloak');

        $this->jwtConfig = Configuration::forAsymmetricSigner(
            new \Lcobucci\JWT\Signer\Rsa\Sha256(),
            \Lcobucci\JWT\Signer\Key\InMemory::plainText(''),
            \Lcobucci\JWT\Signer\Key\InMemory::plainText($this->getPublicKey())
        );

        $this->jwtConfig->setValidationConstraints(
            new SignedWith($this->jwtConfig->signer(), $this->jwtConfig->verificationKey()),
            new StrictValidAt(new SystemClock(new \DateTimeZone('UTC')))
        );
    }

    /**
     * Obtiene la clave pública del realm Keycloak
     */
    protected function getPublicKey()
    {
        $client = new Client();
        $baseUrl = rtrim($this->config['auth_server_url'] ?? '', '/');
        $realm = $this->config['realm'] ?? '';
        $url = "{$baseUrl}/realms/{$realm}/protocol/openid-connect/certs";

        $response = $client->get($url);
        $certs = json_decode($response->getBody()->getContents(), true);

        // Tomamos la primera clave
        $pem = $certs['keys'][0]['x5c'][0];
        return "-----BEGIN CERTIFICATE-----\n" . $pem . "\n-----END CERTIFICATE-----";
    }

    /**
     * Intenta autenticar usando el token Bearer
     */
    protected function getTokenFromRequest()
    {
        $header = request()->header('Authorization');

        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return null;
        }

        return substr($header, 7);
    }

    public function user()
    {
        if ($this->user) {
            return $this->user;
        }

        $token = $this->getTokenFromRequest();

        if (!$token) {
            return null;
        }

        $parsedToken = $this->jwtConfig->parser()->parse($token);

        if (!$parsedToken instanceof UnencryptedToken) {
            return null;
        }

        // Validar firma
        $constraints = $this->jwtConfig->validationConstraints();

        if (!$this->jwtConfig->validator()->validate($parsedToken, ...$constraints)) {
            return null;
        }

        // Extraer claims
        $claims = $parsedToken->claims();

        $this->user = new KeycloakUser([
            'id' => $claims->get('sub'),
            'email' => $claims->get('email'),
            'username' => $claims->get('preferred_username'),
            'roles' => $claims->get('realm_access')['roles'] ?? []
        ]);

        return $this->user;
    }

    public function validate(array $credentials = [])
    {
        return (bool) $this->user();
    }

    public function check()
    {
        return $this->user() !== null;
    }

    public function guest()
    {
        return !$this->check();
    }

    public function id()
    {
        return $this->user()?->id;
    }

    public function setUser(Authenticatable $user)
    {
        $this->user = $user;
    }
}
