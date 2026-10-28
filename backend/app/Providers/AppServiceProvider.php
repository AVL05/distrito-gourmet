<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('auth', function (Request $request) {
            $email = $request->input('email');
            $account = hash('sha256', is_string($email) ? strtolower(trim($email)) : '');

            return [
                Limit::perMinute(30)->by('ip:'.$request->ip()),
                Limit::perMinute(10)->by('account:'.$account),
                Limit::perMinute(5)->by('pair:'.$account.'|'.$request->ip()),
            ];
        });

        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(120)->by($request->user()?->id ? 'user:'.$request->user()->id : 'ip:'.$request->ip())
        );
        RateLimiter::for('contact', fn (Request $request) => Limit::perMinute(5)->by($request->ip()));
        RateLimiter::for('profile', fn (Request $request) => Limit::perMinute(10)->by($request->user()->id));
        RateLimiter::for('orders', fn (Request $request) => [
            Limit::perMinute(5)->by('minute:'.$request->user()->id),
            Limit::perHour(30)->by('hour:'.$request->user()->id),
        ]);
        RateLimiter::for('reservations', fn (Request $request) => [
            Limit::perMinute(5)->by('minute:'.$request->user()->id),
            Limit::perHour(20)->by('hour:'.$request->user()->id),
        ]);
    }
}
