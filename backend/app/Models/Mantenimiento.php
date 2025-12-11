<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mantenimiento extends Model
{
    use HasFactory;

    protected $table = 'mantenimientos';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'equipo_id',
        'hospital_id',
        'servicio_id',
        'oficina_id',
        'tipo',
        'descripcion',
        'estado',
        'fecha',
        'costo',
    ];

    protected $casts = [
        'fecha' => 'date',
        'costo' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
