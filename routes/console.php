<?php

\Illuminate\Support\Facades\Schedule::call(function(){
    $messages = \App\Services\OrdersScheduleHelper::fetchOrders();
})->everyThirtySeconds();
