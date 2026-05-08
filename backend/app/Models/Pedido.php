<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Representa un pedido realizado en la tienda Gourmet
class Pedido extends Model
{
    use HasFactory;

    protected $table = 'pedidos';
    const CREATED_AT = 'creado_a';
    const UPDATED_AT = 'actualizado_a';

    protected $fillable = [
        'usuario_id',
        'numero_pedido',
        'estado',
        'tipo_pedido',
        'subtotal',
        'impuestos',
        'total',
        'direccion',
        'hora_recogida',
        'fecha_recogida',
        'metodo_pago'
    ];

    // Relación con el usuario que realizó el pedido
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    // Relación con los artículos detallados en el pedido
    public function detalles()
    {
        return $this->hasMany(DetallePedido::class, 'pedido_id');
    }
}
