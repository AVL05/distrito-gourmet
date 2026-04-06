<?php
/**
 * @file User.php
 * @author Alex V. (DAW)
 * @date 2026-04-06
 * @description Modelo de elocuencia para la entidad Usuarios. Define roles, atributos protegidos y la integración con Sanctum para autenticación API.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * @var array $fillable
     * @description Atributos que se pueden asignar masivamente para evitar vulnerabilidades de asignación masiva inadvertida.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * @var array $hidden
     * @description Campos que se ocultan automáticamente al convertir el objeto a JSON (seguridad de contraseñas).
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @function casts
     * @description Define la conversión de tipos de datos al recuperar valores de la base de datos (ej. hashing automático de passwords).
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
