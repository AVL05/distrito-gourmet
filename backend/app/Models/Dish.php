<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Modelo de plato del menú
class Dish extends Model
{
    protected $guarded = [];

    // Relación: cada plato pertenece a una categoría del menú
    public function category()
    {
        return $this->belongsTo(MenuCategory::class, 'menu_category_id');
    }
}
