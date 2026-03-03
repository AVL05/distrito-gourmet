<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Modelo de artículo dentro de un pedido
class OrderItem extends Model
{
    protected $fillable = ['order_id', 'dish_id', 'wine_id', 'item_name', 'quantity', 'price'];

    // Relación: cada artículo puede estar vinculado a un plato
    public function dish()
    {
        return $this->belongsTo(Dish::class);
    }
}
