<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Desglose de artículos individuales dentro de un pedido
class DetallePedido extends Model
{
    use HasFactory;

    protected $table = 'detalles_pedido';
    public $timestamps = false;

    protected $fillable = [
        'pedido_id',
        'plato_id',
        'vino_id',
        'bebida_id',
        'menu_degustacion_id',
        'cantidad',
        'precio_unitario',
        'precio_total'
    ];

    // Relación con el pedido principal
    public function pedido()
    {
        return $this->belongsTo(Pedido::class, 'pedido_id');
    }

    // Relación opcional con un plato
    public function plato()
    {
        return $this->belongsTo(Plato::class, 'plato_id');
    }

    // Relación opcional con un vino
    public function vino()
    {
        return $this->belongsTo(Vino::class, 'vino_id');
    }

    // Relación opcional con una bebida
    public function bebida()
    {
        return $this->belongsTo(Bebida::class, 'bebida_id');
    }

    // Relación opcional con un menú degustación
    public function menu_degustacion()
    {
        return $this->belongsTo(MenuDegustacion::class, 'menu_degustacion_id');
    }
}
