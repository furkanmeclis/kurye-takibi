<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});


Route::get('/access-denied', function () {
    return Inertia::render('Auth/AccessDenied');
})->name('access.denied');
Route::middleware('auth')->group(function () {
    Route::get('/home', function () {
        if(request()->user()->role == "admin"){
            return Inertia::render("Admin/Dashboard");
        }else if(request()->user()->role == "business"){
            return Inertia::render("Business/Dashboard");
        }else if(request()->user()->role == "courier"){
            return Inertia::render("Courier/Dashboard");
        }
    })->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::prefix('admin')->name("admin.")->middleware("only:admin")->group(function () {
        Route::prefix('/couriers')->name("couriers.")->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\CouriersController::class, 'index'])->name('index');
            Route::get('/wait-approval', [\App\Http\Controllers\Admin\CouriersController::class, 'waitApproval'])->name('waitApproval');
            Route::post('/list-couriers/{type}',[\App\Http\Controllers\Admin\CouriersController::class, 'listCouriers'])->name("listCouriers");
            Route::post('/list-wait-approvals-couriers',[\App\Http\Controllers\Admin\CouriersController::class, 'getWaitApprovalCouriers'])->name("getWaitApprovalCouriers");
            Route::post('/show-details/{id}',[\App\Http\Controllers\Admin\CouriersController::class, 'showDetails'])->name("showDetails");
            Route::get('/create', [\App\Http\Controllers\Admin\CouriersController::class, 'create'])->name('create');
            Route::post('/store', [\App\Http\Controllers\Admin\CouriersController::class, 'store'])->name('store');
            Route::get('/edit-courier/{id}', [\App\Http\Controllers\Admin\CouriersController::class, 'edit'])->name('edit');
            Route::put('/update-courier/{id}', [\App\Http\Controllers\Admin\CouriersController::class, 'update'])->name('update');
            Route::post('/approve-courier/{id}', [\App\Http\Controllers\Admin\CouriersController::class, 'approve'])->name('approve');
            Route::post('/approve-details/{id}', [\App\Http\Controllers\Admin\CouriersController::class, 'approveDetails'])->name('approveDetails');
            Route::post('/multiple-approve-courier', [\App\Http\Controllers\Admin\CouriersController::class, 'multipleApprove'])->name('multipleApprove');
            Route::delete('/destroy-courier/{id}', [\App\Http\Controllers\Admin\CouriersController::class, 'destroy'])->name('destroy');
            Route::post('/multiple-destroy-courier', [\App\Http\Controllers\Admin\CouriersController::class, 'multipleDestroy'])->name('multipleDestroy');
        });
        Route::prefix('/businesses')->name("businesses.")->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\BusinessesController::class, 'index'])->name('index');
            Route::get('/wait-approval', [\App\Http\Controllers\Admin\BusinessesController::class, 'waitApproval'])->name('waitApproval');
            Route::post('/list-businesses/{type}',[\App\Http\Controllers\Admin\BusinessesController::class, 'listBusinesses'])->name("listBusinesses");
            Route::post('/list-wait-approvals-businesses',[\App\Http\Controllers\Admin\BusinessesController::class, 'getWaitApprovalBusinesses'])->name("getWaitApprovalBusinesses");
            Route::post('/show-details/{id}',[\App\Http\Controllers\Admin\BusinessesController::class, 'showDetails'])->name("showDetails");
            Route::get('/create', [\App\Http\Controllers\Admin\BusinessesController::class, 'create'])->name('create');
            Route::post('/store', [\App\Http\Controllers\Admin\BusinessesController::class, 'store'])->name('store');
            Route::get('/edit-business/{id}', [\App\Http\Controllers\Admin\BusinessesController::class, 'edit'])->name('edit');
            Route::put('/update-business/{id}', [\App\Http\Controllers\Admin\BusinessesController::class, 'update'])->name('update');
            Route::post('/approve-business/{id}', [\App\Http\Controllers\Admin\BusinessesController::class, 'approve'])->name('approve');
            Route::post('/approve-details/{id}', [\App\Http\Controllers\Admin\BusinessesController::class, 'approveDetails'])->name('approveDetails');
            Route::post('/multiple-approve-business', [\App\Http\Controllers\Admin\BusinessesController::class, 'multipleApprove'])->name('multipleApprove');
            Route::delete('/destroy-business/{id}', [\App\Http\Controllers\Admin\BusinessesController::class, 'destroy'])->name('destroy');
            Route::post('/multiple-destroy-business', [\App\Http\Controllers\Admin\BusinessesController::class, 'multipleDestroy'])->name('multipleDestroy');
        });
    });
    Route::prefix("business")->name("business.")->middleware("only:business")->group(function () {
        Route::get('/', function (){
            return Inertia::render('Courier/Dashboard');
        })->name('dashboard');
        Route::post('/profile-information-get-details', [\App\Http\Controllers\Business\ProfileController::class, 'getPersonalInformation'])->name('getPersonalInformation');
        Route::post('/profile-information-save', [\App\Http\Controllers\Business\ProfileController::class, 'savePersonalInformation'])->name('savePersonalInformation');
    });
    Route::prefix("courier")->name("courier.")->middleware("only:courier")->group(function () {
        Route::get('/', function (){
            return Inertia::render('Courier/Dashboard');
        })->name('dashboard');
        Route::post('/profile-information-get-details', [\App\Http\Controllers\Courier\ProfileController::class, 'getPersonalInformation'])->name('getPersonalInformation');
        Route::post('/profile-information-save', [\App\Http\Controllers\Courier\ProfileController::class, 'savePersonalInformation'])->name('savePersonalInformation');
    });
});

require __DIR__.'/auth.php';
