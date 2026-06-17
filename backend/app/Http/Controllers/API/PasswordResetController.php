<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'mensaje' => 'Si el correo está registrado recibirá un enlace de recuperación en breve.',
            ]);
        }

        // Devolvemos el mismo mensaje genérico para no revelar si el email existe
        return response()->json([
            'mensaje' => 'Si el correo está registrado recibirá un enlace de recuperación en breve.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'    => 'required|string',
            'email'    => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'token.required'             => 'El token de recuperación es obligatorio.',
            'email.required'             => 'El correo electrónico es obligatorio.',
            'password.required'          => 'La nueva contraseña es obligatoria.',
            'password.min'               => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed'         => 'Las contraseñas no coinciden.',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'mensaje' => 'Contraseña restablecida correctamente. Por favor, inicie sesión.',
            ]);
        }

        return response()->json([
            'errors' => ['token' => [__($status)]],
        ], 422);
    }
}
