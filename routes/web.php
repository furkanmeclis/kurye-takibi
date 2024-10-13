<?php

use App\Http\Controllers\ProfileController;
use furkanmeclis\Tools\TrendyolYemekApi;
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
        if (request()->user()->role == "admin") {
            return Inertia::render("Admin/Dashboard");
        } else if (request()->user()->role == "business") {
            return Inertia::render("Business/Dashboard");
        } else if (request()->user()->role == "courier") {
            return Inertia::render("Courier/Dashboard");
        }
    })->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::prefix('admin')->name("admin.")->middleware("only:admin")->group(function () {
        Route::prefix('/couriers')->name("couriers.")->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\CouriersController::class, 'index'])->name('index');
            Route::get('/wait-approval', [\App\Http\Controllers\Admin\CouriersController::class, 'waitApproval'])->name('waitApproval');
            Route::post('/list-couriers/{type}', [\App\Http\Controllers\Admin\CouriersController::class, 'listCouriers'])->name("listCouriers");
            Route::post('/list-wait-approvals-couriers', [\App\Http\Controllers\Admin\CouriersController::class, 'getWaitApprovalCouriers'])->name("getWaitApprovalCouriers");
            Route::post('/show-details/{id}', [\App\Http\Controllers\Admin\CouriersController::class, 'showDetails'])->name("showDetails");
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
            Route::post('/list-businesses/{type}', [\App\Http\Controllers\Admin\BusinessesController::class, 'listBusinesses'])->name("listBusinesses");
            Route::post('/list-wait-approvals-businesses', [\App\Http\Controllers\Admin\BusinessesController::class, 'getWaitApprovalBusinesses'])->name("getWaitApprovalBusinesses");
            Route::post('/show-details/{id}', [\App\Http\Controllers\Admin\BusinessesController::class, 'showDetails'])->name("showDetails");
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
        Route::prefix('/orders')->name("orders.")->group(function () {
            Route::get('/cancellation-requests', [\App\Http\Controllers\Admin\OrdersController::class, 'cancellationRequests'])->name('cancellationRequests');
            Route::post('/list-cancellation-requests', [\App\Http\Controllers\Admin\OrdersController::class, 'listCancellationRequests'])->name('listCancellationRequests');
            Route::post('/approve-cancellation/{id}', [\App\Http\Controllers\Admin\OrdersController::class, 'approveCancellation'])->name('approveCancellation');
        });
    });
    Route::prefix("business")->name("business.")->middleware("only:business")->group(function () {
        Route::get('/', function () {
            return Inertia::render('Courier/Dashboard');
        })->name('dashboard');
        Route::post('/profile-information-get-details', [\App\Http\Controllers\Business\ProfileController::class, 'getPersonalInformation'])->name('getPersonalInformation');
        Route::post('/profile-information-save', [\App\Http\Controllers\Business\ProfileController::class, 'savePersonalInformation'])->name('savePersonalInformation');
        Route::prefix("customers")->name("customers.")->group(function () {
            Route::post('/list-customers', [\App\Http\Controllers\Business\CustomersController::class, 'listCustomers'])->name('listCustomers');
            Route::get('/', [\App\Http\Controllers\Business\CustomersController::class, 'index'])->name('index');
            Route::get('/create', [\App\Http\Controllers\Business\CustomersController::class, 'create'])->name('create');
            Route::post('/store', [\App\Http\Controllers\Business\CustomersController::class, 'store'])->name('store');
            Route::post('/{id}/details', [\App\Http\Controllers\Business\CustomersController::class, 'getCustomer'])->name('getCustomer');
            Route::get('/{id}/edit', [\App\Http\Controllers\Business\CustomersController::class, 'edit'])->name('edit');
            Route::put('/{id}/update', [\App\Http\Controllers\Business\CustomersController::class, 'update'])->name('update');
            Route::delete('/{id}/destroy', [\App\Http\Controllers\Business\CustomersController::class, 'destroy'])->name('destroy');
            Route::post('/multiple-destroy-customers', [\App\Http\Controllers\Business\CustomersController::class, 'multipleDestroy'])->name('multipleDestroy');
            Route::post('/customer/{id}/adresses', [\App\Http\Controllers\Business\CustomersController::class, 'getAdresses'])->name('getAdresses');
            Route::post('/customer/{id}/store', [\App\Http\Controllers\Business\CustomersController::class, 'storeAdress'])->name('storeAdress');
            Route::put('/adress/{id}/update', [\App\Http\Controllers\Business\CustomersController::class, 'updateAdress'])->name('updateAdress');
            Route::delete('/adress/{id}/destroy', [\App\Http\Controllers\Business\CustomersController::class, 'destroyAdress'])->name('destroyAdress');
        });
        Route::prefix("orders")->name("orders.")->group(function () {
            Route::get('/', [\App\Http\Controllers\Business\OrdersController::class, 'index'])->name('index');
            Route::post('/list-orders', [\App\Http\Controllers\Business\OrdersController::class, 'listOrders'])->name('listOrders');
            Route::get('/create', [\App\Http\Controllers\Business\OrdersController::class, 'create'])->name('create');
            Route::post('/store', [\App\Http\Controllers\Business\OrdersController::class, 'store'])->name('store');
            Route::get('/{id}/show', [\App\Http\Controllers\Business\OrdersController::class, 'show'])->name('show');
            Route::put('/{id}/status-update', [\App\Http\Controllers\Business\OrdersController::class, 'updateStatus'])->name('updateStatus');
            Route::post('/{id}/get-details', [\App\Http\Controllers\Business\OrdersController::class, 'getOrder'])->name('getOrder');
            Route::post('/{id}/get-locations', [\App\Http\Controllers\Business\OrdersController::class, 'getLocations'])->name('getLocations');
            Route::delete('/{id}/destroy', [\App\Http\Controllers\Business\OrdersController::class, 'destroy'])->name('destroy');

        });

    });
    Route::prefix("courier")->name("courier.")->middleware("only:courier")->group(function () {
        Route::get('/', function () {
            return Inertia::render('Courier/Dashboard');
        })->name('dashboard');

        Route::post('/statics',[\App\Http\Controllers\Courier\ProfileController::class,'getStatics'])->name("getStatics");
        Route::get('/');
        Route::prefix('/orders')->middleware("only:courier")->name("orders.")->group(function () {
            Route::get('/new-orders', [\App\Http\Controllers\Courier\OrdersController::class, 'newOrders'])->name('newOrders');
            Route::get('/past-orders',[\App\Http\Controllers\Courier\OrdersController::class,'pastOrders'])->name('pastOrders');
            Route::post('/list-past-orders',[\App\Http\Controllers\Courier\OrdersController::class,'listPastOrders'])->name('listPastOrders');
            Route::post('/list-nearby-orders', [\App\Http\Controllers\Courier\OrdersController::class, 'listNearbyOrders'])->name('listNearbyOrders');
            Route::get('/review-order/{id}', [\App\Http\Controllers\Courier\OrdersController::class, 'reviewOrder'])->name('reviewOrder');
            Route::post('/list-review-order/{id}', [\App\Http\Controllers\Courier\OrdersController::class, 'listReviewOrder'])->name('listReviewOrder');
            Route::post('/accept-order-from-courier/{id}', [\App\Http\Controllers\Courier\OrdersController::class, 'acceptOrderFromCourier'])->name('acceptOrderFromCourier');
            Route::post('/get-active-order', [\App\Http\Controllers\Courier\OrdersController::class, 'activeOrder'])->name('activeOrder');
            Route::post('/update-courier-location', [\App\Http\Controllers\Courier\OrdersController::class, 'updateCourierLocation'])->name('updateCourierLocation');
            Route::post('/deliver-order/{id}', [\App\Http\Controllers\Courier\OrdersController::class, 'deliverOrder'])->name('deliverOrder');
        });
        Route::post('/profile-information-get-details', [\App\Http\Controllers\Courier\ProfileController::class, 'getPersonalInformation'])->name('getPersonalInformation');
        Route::post('/profile-information-save', [\App\Http\Controllers\Courier\ProfileController::class, 'savePersonalInformation'])->name('savePersonalInformation');
    });
});

Route::post('/add-location/{i}', function ($order_id) {
    return response()->json([
        'status' => false,
        'message' => 'Bu Özellik Kullanıma Kapatıldı(DEV)'
    ]);
})->name("demoAddLocation");
Route::post("/demo-deliver-order/{id}", function ($id) {
    return response()->json([
        'status' => false,
        'message' => 'Bu Özellik Kullanıma Kapatıldı(DEV)'
    ]);
})->name("demoDeliverOrder");

Route::get('/demo3',function (){
    return response()->json(\App\Models\Orders::getCourierStatics());
});
Route::get('/trendyol', function () {
    $api = new TrendyolYemekApi('1030310', '313143', 'ixLUAtJST8gKT4bEA7O5', 'N1wIvCznqVHJMIOVWVOR', 'furkanmeclis@icloud.com');
    $restaurant = $api->getPackages();
    return response()->json($restaurant);
});
require __DIR__ . '/auth.php';
