<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipoHistorial extends Model
{
    use HasFactory;

    protected $table = 'equipo_historial';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'equipo_id',
        'tipo_evento',
        'descripcion',
        'usuario_registra',
        'fecha_evento',
        'oficina_origen_id',
        'oficina_destino_id',
    ];

    protected $casts = [
        'fecha_evento' => 'datetime',
    ];

    public function oficinaOrigen()
    {
        return $this->belongsTo(UnidadOrganizacional::class, 'oficina_origen_id');
    }

    public function oficinaDestino()
    {
        return $this->belongsTo(UnidadOrganizacional::class, 'oficina_destino_id');
    }
}
