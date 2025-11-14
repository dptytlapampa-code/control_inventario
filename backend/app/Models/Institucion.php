<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Institucion extends Model
{
    use HasFactory;

    protected $table = 'instituciones';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'tipo_institucion_id',
        'nombre',
        'localidad',
        'domicilio',
        'telefono',
        'zona_sanitaria',
        'latitud',
        'longitud',
        'activo',
    ];

    public function tipo()
    {
        return $this->belongsTo(TipoInstitucion::class, 'tipo_institucion_id');
    }

    public function unidades()
    {
        return $this->hasMany(UnidadOrganizacional::class, 'institucion_id');
    }
}
