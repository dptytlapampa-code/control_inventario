<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mantenimiento extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'mantenimientos';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'equipo_id',
        'hospital_id',
        'servicio_id',
        'oficina_id',
        'tipo',
        'descripcion',
        'estado',
        'fecha',
        'costo',
        'created_by',
    ];

    protected $casts = [
        'fecha' => 'date',
        'costo' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function equipo()
    {
        return $this->belongsTo(Equipo::class, 'equipo_id');
    }

    public function hospital()
    {
        return $this->belongsTo(Institucion::class, 'hospital_id');
    }

    public function servicio()
    {
        return $this->belongsTo(UnidadOrganizacional::class, 'servicio_id');
    }

    public function oficina()
    {
        return $this->belongsTo(UnidadOrganizacional::class, 'oficina_id');
    }

    public function scopeApplyFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['q'] ?? null, function (Builder $builder, string $texto) {
                $builder->where(function (Builder $nested) use ($texto) {
                    $nested->where('descripcion', 'like', "%{$texto}%")
                        ->orWhere('tipo', 'like', "%{$texto}%");
                });
            })
            ->when($filters['hospital_id'] ?? null, fn (Builder $builder, string $hospitalId) => $builder->where('hospital_id', $hospitalId))
            ->when($filters['servicio_id'] ?? null, fn (Builder $builder, string $servicioId) => $builder->where('servicio_id', $servicioId))
            ->when($filters['oficina_id'] ?? null, fn (Builder $builder, string $oficinaId) => $builder->where('oficina_id', $oficinaId))
            ->when($filters['estado'] ?? null, fn (Builder $builder, string $estado) => $builder->where('estado', $estado))
            ->when($filters['fecha_desde'] ?? null, fn (Builder $builder, string $desde) => $builder->whereDate('fecha', '>=', $desde))
            ->when($filters['fecha_hasta'] ?? null, fn (Builder $builder, string $hasta) => $builder->whereDate('fecha', '<=', $hasta));
    }
}
