<?php

namespace App\Http\Controllers\Admin;

use App\Models\CustomerAddresses;
use App\Models\Customers;
use App\Models\Orders;
use App\Models\User;
use Inertia\Inertia;

class OrdersController
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('Admin/Orders/All');
    }

    public function cancellationRequests(): \Inertia\Response
    {
        return Inertia::render('Admin/Orders/CancellationRequests');
    }

    public function listCancellationRequests(): \Illuminate\Http\JsonResponse
    {
        $orders = Orders::where('status', 'canceled')->orderBy("created_at", "desc")->get()->map(function ($order) {
            $order->customer = Customers::find($order->customer_id);
            $order->address = CustomerAddresses::find($order->address_id);
            $order->start_location = json_decode($order->start_location);
            $order->end_location = json_decode($order->end_location);
            $order->courier = User::getCourier($order->courier_id);
            $order->business = User::getBusiness($order->business_id);
            if ($order->cancellation_accepted_by != null) {
                $order->cancellation_accepted_by = User::where('id', $order->cancellation_accepted_by)->first(["id", "name"]);
            }
            return $order;
        });
        return response()->json([
            "status" => true,
            "orders" => $orders
        ]);
    }

    public function listOrders(): \Illuminate\Http\JsonResponse
    {
        $orders = Orders::where('id', '>', 0)->orderBy("updated_at", "desc")->get()->map(function ($order) {
            $order->customer = Customers::find($order->customer_id);
            $order->address = CustomerAddresses::find($order->address_id);
            $order->start_location = json_decode($order->start_location);
            $order->end_location = json_decode($order->end_location);
            $order->courier = User::getCourier($order->courier_id);
            $order->business = User::getBusiness($order->business_id);
            return $order;
        });
        return response()->json([
            "status" => true,
            "orders" => $orders
        ]);
    }

    public function approveCancellation($orderId): \Illuminate\Http\JsonResponse
    {
        $order = Orders::find($orderId);
        if ($order) {
            $order->cancellation_accepted = 1;
            $order->cancellation_accepted_by = auth()->user()->id;
            $order->canceled_at = now();
            if ($order->save()) {
                return response()->json([
                    "status" => true,
                    "message" => "Sipariş İptali Onaylandı"
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Sipariş İptali Onaylanamadı"
                ]);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Sipariş Bulunamadı"
            ]);
        }
    }

    public function rejectCancellation($orderId): \Illuminate\Http\JsonResponse
    {
        $order = Orders::find($orderId);
        if ($order) {
            $order->cancellation_accepted = 0;
            $order->cancellation_rejected = 1;
            $order->cancellation_accepted_by = auth()->user()->id;
            if ($order->save()) {
                return response()->json([
                    "status" => true,
                    "message" => "Sipariş İptali Reddedildi"
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Sipariş İptali Reddedilemedi"
                ]);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Sipariş Bulunamadı"
            ]);
        }

    }
}
