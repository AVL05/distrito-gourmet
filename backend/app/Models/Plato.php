<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Representa un plato individual de la carta
class Plato extends Model
{
    use HasFactory;

    protected $table = 'platos';
    public $timestamps = false; // Manejado manualmente o no requerido

    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'precio',
        'categoria_menu_id',
        'alergenos',
        'disponible',
        'visible_en_carta',
        'visible_en_degustacion',
        'disponible_para_llevar',
        'es_por_unidad',
        'maximo_por_pedido'
    ];

    // Relación con la categoría del menú a la que pertenece el plato
    public function categoria()
    {
        return $this->belongsTo(CategoriaMenu::class, 'categoria_menu_id');
    }
}
