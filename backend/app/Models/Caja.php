<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Caja extends Model
{
    use HasFactory;

    protected $table = 'cajas';

    protected $fillable = [
        'user_id',
        'estado',
        'saldo_inicial',
        'saldo_final',
        'total_efectivo',
        'total_debito',
        'total_credito',
        'total_transferencia',
        'total_descuentos',
        'total_costo',
        'total_ventas',
        'diferencia_efectivo',
        'abierta_en',
        'cerrada_en',
    ];

    protected $casts = [
        'saldo_inicial' => 'decimal:2',
        'saldo_final' => 'decimal:2',
        'total_efectivo' => 'decimal:2',
        'total_debito' => 'decimal:2',
        'total_credito' => 'decimal:2',
        'total_transferencia' => 'decimal:2',
        'total_descuentos' => 'decimal:2',
        'total_costo' => 'decimal:2',
        'total_ventas' => 'decimal:2',
        'diferencia_efectivo' => 'decimal:2',
        'abierta_en' => 'datetime',
        'cerrada_en' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ventas(): HasMany
    {
        return $this->hasMany(Venta::class);
    }
}
