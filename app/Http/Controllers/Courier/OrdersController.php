<?php

namespace App\Http\Controllers\Courier;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OrdersController extends \App\Http\Controllers\Controller
{
    public function newOrders(): \Inertia\Response
    {
        return Inertia::render('Courier/Orders/NewOrders');
    }

    public function listNearbyOrders(Request $request): \Illuminate\Http\JsonResponse
    {
        $courier = auth()->user();
        $availabilityService = $courier->getCourierAvailability();
        if (!$availabilityService->available) {
            return response()->json([
                "status" => false,
                "message" => $availabilityService->message,
            ]);
        } else {
            try {
                $request->validate([
                    "latitude" => "required",
                    "longitude" => "required",
                ], [
                    "latitude.required" => "Enlem Bilgisi Gerekli",
                    "longitude.required" => "Boylam Bilgisi Gerekli",
                ]);
                $orders = \App\Models\Orders::getNearbyOrders($request->latitude, $request->longitude);
                return response()->json([
                    "status" => true,
                    "orders" => $orders,
                ]);
            } catch (ValidationException $e) {
                return response()->json([
                    "status" => false,
                    "message" => $e->getMessage(),
                ]);
            }
        }
    }
}
