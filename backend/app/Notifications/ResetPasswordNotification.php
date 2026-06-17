<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPassword
{
    protected function resetUrl($notifiable): string
    {
        $frontendUrl = rtrim(config('app.frontend_url', config('app.url')), '/');

        return "{$frontendUrl}/reset-password?token={$this->token}&email={$notifiable->getEmailForPasswordReset()}";
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Recuperación de contraseña — Distrito Gourmet')
            ->greeting('Hola,')
            ->line('Ha solicitado restablecer la contraseña de su cuenta.')
            ->action('Restablecer contraseña', $this->resetUrl($notifiable))
            ->line('Este enlace caduca en ' . config('auth.passwords.users.expire') . ' minutos.')
            ->line('Si no ha solicitado este cambio, puede ignorar este mensaje.')
            ->salutation('Distrito Gourmet');
    }
}
