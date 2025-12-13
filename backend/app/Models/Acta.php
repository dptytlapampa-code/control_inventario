<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Acta extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'tipo',
        'equipo_id',
        'hospital_id',
        'created_by',
        'receptor_nombre',
        'receptor_identificacion',
        'receptor_cargo',
        'motivo',
        'data',
        'path',
    ];

    protected $casts = [
        'data' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function equipo()
    {
        return $this->belongsTo(Equipo::class);
    }

    public function hospital()
    {
        return $this->belongsTo(Institucion::class, 'hospital_id');
    }

    public function scopeApplyFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['q'] ?? null, function (Builder $builder, string $texto) {
                $builder->where(function (Builder $nested) use ($texto) {
                    $nested->where('motivo', 'like', "%{$texto}%")
                        ->orWhere('tipo', 'like', "%{$texto}%")
                        ->orWhere('receptor_nombre', 'like', "%{$texto}%");
                });
            })
            ->when($filters['hospital_id'] ?? null, fn (Builder $builder, string $hospitalId) => $builder->where('hospital_id', $hospitalId))
            ->when($filters['tipo'] ?? null, fn (Builder $builder, string $tipo) => $builder->where('tipo', $tipo))
            ->when($filters['fecha_desde'] ?? null, fn (Builder $builder, string $desde) => $builder->whereDate('created_at', '>=', $desde))
            ->when($filters['fecha_hasta'] ?? null, fn (Builder $builder, string $hasta) => $builder->whereDate('created_at', '<=', $hasta));
    }
}
