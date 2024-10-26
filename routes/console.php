<?php

\Illuminate\Support\Facades\Schedule::call(function(){
    \Illuminate\Support\Facades\Log::log('info', 'This is a scheduled task');
})->everyThirtySeconds();
