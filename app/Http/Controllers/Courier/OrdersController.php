<?php

namespace App\Http\Controllers\Courier;

use App\Events\Orders\OrderEvent;
use App\Models\OrderLocations;
use App\Models\Orders;
use App\Models\User;
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

    public function pastOrders(): \Inertia\Response
    {
        return Inertia::render('Courier/Orders/PastOrders');
    }

    public function listPastOrders(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            "status" => true,
            "orders" => Orders::getCourierOrders()
        ]);
    }

    public function listPastOrdersForWidget(Request $request): \Illuminate\Http\JsonResponse
    {
        if ($request->has("listCount")) {
            return response()->json([
                "status" => true,
                "orders" => Orders::getCourierOrders($request->get("listCount"))
            ]);
        }
        return response()->json([
            "status" => false,
            "message" => "Liste Sayısı Belirtilmedi"
        ]);
    }

    public function show($id): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        $order = Orders::where('courier_id', auth()->user()->id)->where('id', $id)->count();
        if ($order == 1) {
            return Inertia::render('Courier/Orders/ShowPage', [
                'orderId' => $id
            ]);
        } else {
            return redirect()->route('courier.orders.pastOrders')->with('message', 'Sipariş Bulunamadı.')->with('type', 'error')->with("title", "Hata");
        }
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
            if ($record->order->status == "opened") {
                return Inertia::render("Courier/Orders/ReviewOrder", [
                    "orderId" => $orderId
                ]);
            }
        }
        return redirect()->route('courier.orders.newOrders')->with('message', $record->message)->with('type', 'error')->with("title", "Hata");

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
                    $returnResponse = false;
                    $message = (object)[
                        "title" => "Sipariş Kabul Edildi",
                        "message" => "Siparişiniz Kurye Tarafından Kabul Edildi",
                        "severity" => "success"
                    ];

                    if ($order->startTransporting()) {
                        $returnResponse = response()->json([
                            "status" => true,
                            "message" => "Sipariş Kabul Edildi"
                        ]);
                        $message->message = "Siparişiniz Taşınmaya Başlandı. Sipariş Numarası: " . $order->order_number;
                        $message->title = "Sipariş Taşınıyor";
                        $message->severity = "success";
                    } else {
                        $message->message = "Siparişiniz Taşınmaya Başlandı İlgili Firmaya Bildirim Yapılmadı. Sipariş Numarası: " . $order->order_number;
                        $message->title = "Sipariş Taşınıyor";
                        $message->severity = "success";
                        $returnResponse = response()->json([
                            "status" => false,
                            "message" => "Sipariş Kabul Edildi"
                        ]);
                    }
                    broadcast(new OrderEvent($order->business_id, $message, true, false))->toOthers();
                    return $returnResponse;
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

    public function deliverOrder($orderId): \Illuminate\Http\JsonResponse
    {
        $order = Orders::find($orderId);
        if ($order && $order->status == "transporting" && $order->courier_id == auth()->user()->id) {
            $order->status = "delivered";
            $order->delivered_at = now();
            $lastLocation = OrderLocations::where('order_id', $order->id)->orderBy('created_at', 'desc')->first();
            $order->end_location = json_encode([
                "latitude" => $lastLocation->latitude,
                "longitude" => $lastLocation->longitude,
            ]);
            if ($order->save()) {

                $message = (object)[
                    "title" => "Sipariş Teslim Edildi",
                    "message" => "Siparişiniz Başarıyla Teslim Edildi",
                    "severity" => "success"
                ];
                broadcast(new OrderEvent($order->business_id, $message, true, false))->toOthers();
                if ($order->deliveryOrder()) {
                    return response()->json([
                        "status" => true,
                        "message" => "Sipariş Başarıyla Teslim Edildi"
                    ]);
                } else {
                    return response()->json([
                        "status" => false,
                        "message" => "Sipariş Teslim Edildi İlgili Firmaya Bildirim Yapılmadı " . $order->marketplace
                    ]);
                }
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Sipariş Teslim Edilemedi"
                ]);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Sipariş Bulunamadı"
            ]);
        }
    }

    public function getStatusMessage($key): string
    {
        $statuses = [
            'wrongAddress' => 'Yanlış Adres',
            'notInAddress' => 'Adreste Yok',
            'addressMismatch' => 'Adres Uyuşmaması',
            'accident' => 'Kaza',
            'heavyTraffic' => 'Yoğun Trafik',
            'productDamaged' => 'Ürün Hasar Aldı',
            'tireBust' => 'Lastik Patladı',
        ];

        return $statuses[$key] ?? 'Bilinmeyen Durum';
    }

    public function getCancelReasonCodeForTrendyol($key)
    {
        $cancelReasons = [
            'wrongAddress' => 601,
            'notInAddress' => 602,
            'addressMismatch' => 607,
            'accident' => 641,
            'heavyTraffic' => 642,
            'productDamaged' => 647,
            'tireBust' => 645,
            // Diğer nedenler burada
        ];
        return $cancelReasons[$key] ?? null;
    }

    public function emergencyAction(Request $request, $orderId): \Illuminate\Http\JsonResponse
    {
        $order = Orders::find($orderId);
        if ($order) {
            if ($order->status == "transporting" && $order->courier_id == auth()->user()->id) {
                try {
                    $request->validate([
                        "reason" => ['required', 'in:wrongAddress,notInAddress,addressMismatch,accident,heavyTraffic,productDamaged,tireBust'],
                    ]);
                    $order->cancellation_accepted = 1;
                    $order->status = "canceled";
                    $order->cancellation_reason = $this->getStatusMessage($request->reason);
                    $order->cancellation_requested_by = "courier";
                    $order->cancellation_accepted_by = User::where("role", "admin")->first()->id;
                    $order->canceled_at = now();
                    if ($order->save()) {
                        $message = (object)[
                            "title" => "Sipariş İptal Edildi",
                            "message" => "Siparişiniz Kurye Tarafından İptal Edildi. İptal Sebebi: " . $this->getStatusMessage($request->reason),
                            "severity" => "error"
                        ];
                        if ($order->marketplace !== "web") {
                            $message->message = "Siparişiniz Kurye Tarafından İptal Edildi İlgili Firmaya Bildirim Yapılmadı." . $order->marketplace . ". İptal Sebebi: " . $this->getStatusMessage($request->reason);
                        }
                        broadcast(new OrderEvent($order->business_id, $message, true, false))->toOthers();
                        return response()->json([
                            "status" => true,
                            "message" => $message->message
                        ]);
                    } else {
                        return response()->json([
                            "status" => false,
                            "message" => "Sipariş İptal Edilemedi"
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
                    "message" => "Sipariş Size Ait Değil"
                ]);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Sipariş Bulunamadı"
            ]);
        }
    }

    public function getLocations(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        $order = Orders::where('courier_id', auth()->user()->id)->where('id', $id)->first();
        if ($order) {
            $locations = OrderLocations::getLocations($order->id);
            return response()->json([
                'locations' => $locations,
                'status' => true
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Sipariş bulunamadı.'
            ]);
        }
    }

    public function getOrder(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        $order = Orders::where('courier_id', auth()->user()->id)->where('id', $id)->first(["id"]);
        if ($order) {
            return response()->json([
                'order' => Orders::findOrder($order->id, true)->order,
                'status' => true
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Sipariş bulunamadı.'
            ]);
        }
    }
}
