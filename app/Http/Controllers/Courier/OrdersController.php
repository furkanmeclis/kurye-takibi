<?php

namespace App\Http\Controllers\Courier;

use App\Models\OrderLocations;
use App\Models\Orders;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
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
                $listCount = false;
                if ($request->has("listCount")) {
                    $listCount = $request->get("listCount");
                }
                $orders = \App\Models\Orders::getNearbyOrders($request->latitude, $request->longitude, $listCount);
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


    public function reviewOrder($orderId): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        $record = Orders::findOrder($orderId);
        if ($record->status) {
            return Inertia::render("Courier/Orders/ReviewOrder", [
                "orderId" => $orderId
            ]);
        } else {
            return redirect()->route('courier.orders.newOrders')->with('message', $record->message)->with('type', 'error')->with("title", "Hata");
        }
    }

    public function listReviewOrder($orderId): \Illuminate\Http\JsonResponse
    {
        return response()->json(Orders::findOrder($orderId, true));
    }

    public function acceptOrderFromCourier(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        if (auth()->user()->isTransporting()) {
            return response()->json([
                "status" => false,
                "message" => "Zaten Bir Sipariş Taşıyorsunuz"
            ]);
        }
        $order = Orders::find($id);
        if ($order && $order->status == "opened" && $order->courier_id == null) {
            try {
                $request->validate([
                    "latitude" => "required",
                    "longitude" => "required",
                ], [
                    "latitude.required" => "Enlem Bilgisi Gerekli",
                    "longitude.required" => "Boylam Bilgisi Gerekli",
                ]);
                $order->courier_id = auth()->user()->id;
                $order->courier_accepted_at = now();
                $order->status = "transporting";
                $location = json_decode($order->start_location);
                if ($location->latitude == 0) {
                    $location->latitude = $request->latitude;
                    $location->longitude = $request->longitude;
                    $order->start_location = json_encode($location);
                }
                OrderLocations::addLocation($order->id, $request->latitude, $request->longitude, auth()->user()->id);
                if ($order->save()) {
                    return response()->json([
                        "status" => true,
                        "message" => "Sipariş Başarıyla Kabul Edildi"
                    ]);
                } else {
                    return response()->json([
                        "status" => false,
                        "message" => "Sipariş Kabul Edilemedi"
                    ]);
                }
            } catch (ValidationException $e) {
                return response()->json([
                    "status" => false,
                    "message" => $e->getMessage(),
                ]);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "İlgili Sipariş Bulunamadı"
            ]);
        }
    }

    public function activeOrder(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = auth()->user();
        if ($user->isTransporting()) {
            $order = Orders::where('courier_id', $user->id)->where('status', 'transporting')->first(["id"]);
            if ($order) {
                if ($request->has("latitude") && $request->has("longitude")) {
                    Session::put("courier_lat", $request->latitude);
                    Session::put("courier_lon", $request->longitude);
                }
                return response()->json(Orders::findOrder($order->id, true, true));
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Aktif Bir Siparişiniz Bulunmamaktadır"
                ]);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Aktif Bir Siparişiniz Bulunmamaktadır"
            ]);
        }
    }

    public function updateCourierLocation(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = auth()->user();
        if ($user->isTransporting()) {
            $order = Orders::where('courier_id', $user->id)->where('status', 'transporting')->first(["id"]);
            if ($order) {
                try {
                    $request->validate([
                        "latitude" => "required",
                        "longitude" => "required",
                    ], [
                        "latitude.required" => "Enlem Bilgisi Gerekli",
                        "longitude.required" => "Boylam Bilgisi Gerekli",
                    ]);
                    OrderLocations::addLocation($order->id, $request->latitude, $request->longitude, auth()->user()->id);
                    if ($order->save()) {
                        return response()->json([
                            "status" => true,
                            "message" => "Konum Eklendi"
                        ]);
                    } else {
                        return response()->json([
                            "status" => false,
                            "message" => "Konum Eklenemedi"
                        ]);
                    }
                } catch (ValidationException $e) {
                    return response()->json([
                        "status" => false,
                        "message" => $e->getMessage(),
                    ]);
                }
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Aktif Bir Siparişiniz Bulunmamaktadır"
                ]);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Aktif Bir Siparişiniz Bulunmamaktadır"
            ]);
        }
    }
}
