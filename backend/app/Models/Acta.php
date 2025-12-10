<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Acta extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'tipo',
        'equipo_id',
        'hospital_id',
        'usuario_id',
        'receptor_nombre',
        'receptor_identificacion',
        'receptor_cargo',
        'motivo',
        'data',
        'path',
    ];

    protected $casts = [
        'data' => 'array',
    ];
}
