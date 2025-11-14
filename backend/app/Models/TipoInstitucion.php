<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TipoInstitucion extends Model
{
    use HasFactory;

    protected $table = 'tipos_institucion';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'nombre',
        'descripcion',
        'activo',
    ];

    public function instituciones()
    {
        return $this->hasMany(Institucion::class, 'tipo_institucion_id');
    }
}
