<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovimiento extends Model
{
    use HasFactory;

    protected $table = 'stock_movimientos';

    protected $fillable = [
        'producto_id',
        'cantidad',
        'tipo_movimiento',
        'referencia_id',
    ];

    protected $casts = [
        'cantidad' => 'decimal:2',
    ];

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }
}
