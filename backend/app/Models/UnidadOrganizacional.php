<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UnidadOrganizacional extends Model
{
    use HasFactory;

    protected $table = 'unidades_organizacionales';
    public $incrementing = false;
    protected $keyType = 'string';

    public const TIPOS = [
        'servicio',
        'oficina',
        'subsecretaria',
        'direccion',
        'departamento',
        'coordinacion',
        'area',
        'otro',
    ];

    protected $fillable = [
        'id',
        'institucion_id',
        'parent_id',
        'nombre',
        'tipo',
        'descripcion',
        'activo',
    ];

    public function institucion()
    {
        return $this->belongsTo(Institucion::class, 'institucion_id');
    }

    public function parent()
    {
        return $this->belongsTo(UnidadOrganizacional::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(UnidadOrganizacional::class, 'parent_id');
    }
}
