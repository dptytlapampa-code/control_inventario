<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipoAdjunto extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'equipo_id',
        'nombre_original',
        'nombre_archivo',
        'mime',
        'size',
        'path',
    ];
}
