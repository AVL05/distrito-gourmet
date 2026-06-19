<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pedido extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pedidos';
    const CREATED_AT = 'creado_a';
    const UPDATED_AT = 'actualizado_a';
    const DELETED_AT = 'eliminado_a';

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
