<?php

namespace App\Console\Commands;

use Database\Seeders\DistritoGourmetSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class InitializeRestaurant extends Command
{
    protected $signature = 'restaurant:initialize';

    protected $description = 'Load initial restaurant data only into an empty database';

    public function handle(): int
    {
        return DB::transaction(function () {
            DB::table('restaurant_locks')->where('id', 1)->lockForUpdate()->first();

            foreach (DistritoGourmetSeeder::TABLES as $table) {
                if (DB::table($table)->exists()) {
                    $this->info('Existing restaurant data preserved; initialization skipped.');

                    return self::SUCCESS;
                }
            }

            return $this->call('db:seed', ['--class' => DistritoGourmetSeeder::class, '--force' => true]);
        });
    }
}
