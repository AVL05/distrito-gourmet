<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Modelo de menú degustación
class TastingMenu extends Model
{
    protected $guarded = [];

    // Relación: un menú degustación tiene varios platos (tabla intermedia con orden y notas)
    public function dishes()
    {
        return $this->belongsToMany(Dish::class, 'tasting_menu_dishes')
            ->withPivot('course_number', 'notes')
            ->orderBy('course_number');
    }
}
