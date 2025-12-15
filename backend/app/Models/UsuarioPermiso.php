<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuarioPermiso extends Model
{
    use HasFactory;

    protected $table = 'usuario_permisos';

    protected $fillable = [
        'user_id',
        'hospital_id',
        'modulo',
        'puede_ver',
        'puede_crear',
        'puede_editar',
        'puede_eliminar',
    ];

    protected $casts = [
        'puede_ver' => 'boolean',
        'puede_crear' => 'boolean',
        'puede_editar' => 'boolean',
        'puede_eliminar' => 'boolean',
    ];
}
