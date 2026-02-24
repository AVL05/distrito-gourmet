<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = ['order_id', 'dish_id', 'wine_id', 'item_name', 'quantity', 'price'];

    public function dish()
    {
        return $this->belongsTo(Dish::class);
    }
}
