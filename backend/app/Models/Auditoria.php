<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auditoria extends Model
{
    protected $table = 'auditorias';

    protected $fillable = [
        'user_id',
        'user_name',
        'user_email',
        'user_role',
        'ip_address',
        'accion',
        'modulo',
        'objeto_id',
        'antes',
        'despues',
    ];

    protected $casts = [
        'antes' => 'array',
        'despues' => 'array',
    ];
}
