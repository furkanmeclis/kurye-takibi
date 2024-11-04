<?php

namespace App\Http\Controllers\Admin;

use App\Models\Orders;
use App\Models\User;

class ProfileController
{
    public function getStatics(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            "status" => true,
            "statics" => [
                'users' => User::getAdminUserStatics(),
                'orders' => Orders::getAdminOrderStatics(14),
            ]
        ]);
    }
}
