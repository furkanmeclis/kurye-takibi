<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::prefix('admin')->name("admin.")->group(function () {
        Route::prefix('/couriers')->name("couriers.")->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\CouriersController::class, 'index'])->name('index');
            Route::get('/wait-approval', [\App\Http\Controllers\Admin\CouriersController::class, 'waitApproval'])->name('waitApproval');
            Route::post('/list-couriers/{type}',[\App\Http\Controllers\Admin\CouriersController::class, 'listCouriers'])->name("listCouriers");
            Route::post('/show-details/{id}',[\App\Http\Controllers\Admin\CouriersController::class, 'showDetails'])->name("showDetails");
            Route::get('/create', [\App\Http\Controllers\Admin\CouriersController::class, 'create'])->name('create');
            Route::post('/store', [\App\Http\Controllers\Admin\CouriersController::class, 'store'])->name('store');
            Route::get('/edit-courier/{id}', [\App\Http\Controllers\Admin\CouriersController::class, 'edit'])->name('edit');
            Route::put('/update-courier/{id}', [\App\Http\Controllers\Admin\CouriersController::class, 'update'])->name('update');
            Route::post('/approve-courier/{id}', [\App\Http\Controllers\Admin\CouriersController::class, 'approve'])->name('approve');
            Route::post('/multiple-approve-courier', [\App\Http\Controllers\Admin\CouriersController::class, 'multipleApprove'])->name('multipleApprove');
            Route::delete('/destroy-courier/{id}', [\App\Http\Controllers\Admin\CouriersController::class, 'destroy'])->name('destroy');
            Route::post('/multiple-destroy-courier', [\App\Http\Controllers\Admin\CouriersController::class, 'multipleDestroy'])->name('multipleDestroy');
        });
        Route::prefix('/businesses')->name("businesses.")->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\BusinessesController::class, 'index'])->name('index');
            Route::get('/wait-approval', [\App\Http\Controllers\Admin\BusinessesController::class, 'waitApproval'])->name('waitApproval');
            Route::post('/list-businesses/{type}',[\App\Http\Controllers\Admin\BusinessesController::class, 'listBusinesses'])->name("listBusinesses");
            Route::post('/show-details/{id}',[\App\Http\Controllers\Admin\BusinessesController::class, 'showDetails'])->name("showDetails");
            Route::get('/create', [\App\Http\Controllers\Admin\BusinessesController::class, 'create'])->name('create');
            Route::post('/store', [\App\Http\Controllers\Admin\BusinessesController::class, 'store'])->name('store');
            Route::get('/edit-business/{id}', [\App\Http\Controllers\Admin\BusinessesController::class, 'edit'])->name('edit');
            Route::put('/update-business/{id}', [\App\Http\Controllers\Admin\BusinessesController::class, 'update'])->name('update');
            Route::post('/approve-business/{id}', [\App\Http\Controllers\Admin\BusinessesController::class, 'approve'])->name('approve');
            Route::post('/multiple-approve-business', [\App\Http\Controllers\Admin\BusinessesController::class, 'multipleApprove'])->name('multipleApprove');
            Route::delete('/destroy-business/{id}', [\App\Http\Controllers\Admin\BusinessesController::class, 'destroy'])->name('destroy');
            Route::post('/multiple-destroy-business', [\App\Http\Controllers\Admin\BusinessesController::class, 'multipleDestroy'])->name('multipleDestroy');
        });
    });
});
Route::get('/deneme', function () {
    return redirect()->route('admin.couriers.index')->with('message', 'Kurye Onaylanmamış.')->with('type', 'error')->with("title", "Hata");
});
require __DIR__.'/auth.php';
