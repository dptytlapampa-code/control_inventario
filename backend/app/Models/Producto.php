<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'codigo',
        'precio_venta',
        'costo',
        'stock',
    ];

    protected $casts = [
        'precio_venta' => 'decimal:2',
        'costo' => 'decimal:2',
        'stock' => 'decimal:2',
    ];

    public function ventaItems(): HasMany
    {
        return $this->hasMany(VentaItem::class);
    }

    public function movimientos(): HasMany
    {
        return $this->hasMany(StockMovimiento::class);
    }
}
