<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipo extends Model
{
    use HasFactory;

    protected $table = 'equipos';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'nombre',
        'serie',
        'bien_patrimonial',
        'hospital_id',
        'servicio_id',
        'oficina_id',
        'estado',
        'descripcion',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function adjuntos()
    {
        return $this->hasMany(EquipoAdjunto::class, 'equipo_id');
    }

    public function historial()
    {
        return $this->hasMany(EquipoHistorial::class, 'equipo_id');
    }
}
