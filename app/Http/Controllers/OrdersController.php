<?php

namespace App\Http\Controllers;

use App\Models\CustomerAddresses;
use App\Models\Customers;
use App\Models\OrderLocations;
use App\Models\Orders;
use App\Models\User;

class OrdersController extends Controller
{
    public function getOrderDetails($orderId): \Illuminate\Http\JsonResponse
    {
        $user = auth()->user();
        if ($user->role == "admin") {
            $order = Orders::find($orderId);
        } elseif ($user->role == "courier") {
            $order = Orders::where('id', $orderId)
                ->where(function ($query) use ($user) {
                    $query->where('status', 'opened')
                        ->orWhere('courier_id', $user->id);
                })
                ->first();
        } elseif ($user->role == "business") {
            $order = Orders::where('id', $orderId)->where('business_id', $user->id)->first();
        }
        if ($order) {
            $order->customer = Customers::find($order->customer_id);
            $order->address = CustomerAddresses::find($order->address_id);
            $order->start_location = json_decode($order->start_location);
            $order->end_location = json_decode($order->end_location);
            $order->courier = User::getCourier($order->courier_id);
            $order->business = User::getBusiness($order->business_id);
            if($order->marketplace == "trendyol"){
                $order->marketplace_customer = json_decode($order->marketplace_customer);
                $order->marketplace_order_details = json_decode($order->marketplace_order_details);
            }
            if ($order->cancellation_accepted_by != null) {
                $order->cancellation_accepted_by = User::where('id', $order->cancellation_accepted_by)->first(["id", "name"]);
            }
            return response()->json([
                'status' => true,
                'order' => $order
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => "Sipariş bulunamadı."
            ]);
        }
    }

    public function getOrderLocations($orderId): \Illuminate\Http\JsonResponse
    {
        $user = auth()->user();
        if ($user->role == "admin") {
            $order = Orders::find($orderId);
        } elseif ($user->role == "courier") {
            $order = Orders::where('id', $orderId)->where('courier_id', $user->id)->first();
        } elseif ($user->role == "business") {
            $order = Orders::where('id', $orderId)->where('business_id', $user->id)->first();
        }
        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => "Sipariş bulunamadı."
            ]);
        }
        $locations = OrderLocations::getLocations($order->id);
        return response()->json([
            'locations' => $locations,
            'status' => true
        ]);

    }
}
