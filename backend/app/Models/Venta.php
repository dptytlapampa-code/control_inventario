<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'ventas';

    protected $fillable = [
        'caja_id',
        'user_id',
        'numero_ticket',
        'modo',
        'subtotal',
        'descuento_porcentaje',
        'descuento_monto',
        'total',
        'total_costo',
        'venta_debajo_costo',
        'medio_pago_resumen',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'descuento_porcentaje' => 'decimal:2',
        'descuento_monto' => 'decimal:2',
        'total' => 'decimal:2',
        'total_costo' => 'decimal:2',
        'venta_debajo_costo' => 'boolean',
    ];

    public function caja(): BelongsTo
    {
        return $this->belongsTo(Caja::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(VentaItem::class);
    }

    public function pagos(): HasMany
    {
        return $this->hasMany(PagoVenta::class);
    }
}
