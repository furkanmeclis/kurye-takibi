<?php

namespace Database\Seeders;

use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test Admin',
            'email' => 'testadmin@414express.com.tr',
            'role' => "admin",
            'password' => Hash::make("414Express")
        ]);
        User::factory()->create([
            'name' => 'Test Restoran',
            'email' => 'testrestoran@414express.com.tr',
            'role' => "business",
            'password' => Hash::make("414Express")
        ]);
        User::factory()->create([
            'name' => 'Test Kurye',
            'email' => 'testkurye@414express.com.tr',
            'role' => "courier",
            'password' => Hash::make("414Express")
        ]);
    }
}
