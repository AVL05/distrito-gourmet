<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Modelo de pedido
class Order extends Model
{
    protected $fillable = ['user_id', 'status', 'type', 'total', 'address', 'delivery_instructions'];

    // Relación: un pedido tiene muchos artículos
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Relación: un pedido pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
