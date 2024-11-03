<?php

namespace App\Http\Controllers\Business;

use App\Events\Orders\OrderEvent;
use App\Http\Controllers\Controller;
use App\Models\CustomerAddresses;
use App\Models\Customers;
use App\Models\Integrations;
use App\Models\OrderLocations;
use App\Models\Orders;
use App\Models\User;
use App\Services\IntegrationHelper;
use furkanmeclis\Tools\TrendyolYemekApi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\ResponseFactory;

class OrdersController extends Controller
{
    /**
     * @return Response|ResponseFactory
     */
    public function index(): Response|ResponseFactory
    {
        return Inertia::render('Business/Orders/All');
    }

    public function listOrders(Request $request): \Illuminate\Http\JsonResponse
    {
        $orders = Orders::where('business_id', auth()->user()->id)->orderBy('updated_at', 'desc')->get()->map(function ($order) {
            $order->customer = Customers::find($order->customer_id);
            $order->address = CustomerAddresses::find($order->address_id);
            $order->start_location = json_decode($order->start_location);
            $order->end_location = json_decode($order->end_location);
            $order->courier = User::getCourier($order->courier_id);
            if ($order->cancellation_accepted_by != null) {
                $order->cancellation_accepted_by = User::where('id', $order->cancellation_accepted_by)->first(["id", "name"]);
            }
            return $order;
        });
        return response()->json([
            'orders' => $orders,
            'status' => true
        ]);
    }

    public function create(): Response|ResponseFactory
    {
        return Inertia::render('Business/Orders/Create');
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'customer_id' => 'required|integer|exists:customers,id',
                'address_id' => 'required|integer|exists:customer_addresses,id',
                'customer_note' => 'nullable|string|max:255',
                'location' => 'nullable',
                'price' => 'required|min:1|max:255'
            ]);
            $newOrder = new Orders();
            $newOrder->customer_id = $request->customer_id;
            $newOrder->address_id = $request->address_id;
            $newOrder->customer_note = $request->customer_note;
            $newOrder->business_id = auth()->user()->id;
            $newOrder->status = "preparing";
            $newOrder->order_number = Orders::generateOrderNumber($newOrder->business_id);
            $newOrder->price = $request->price;
            if ($request->location != null) {
                $newOrder->start_location = json_encode($request->location);
                $location = json_decode($newOrder->start_location);
                User::find(auth()->user()->id)->update([
                    "latitude" => $location->latitude,
                    "longitude" => $location->longitude
                ]);
            }
            if ($newOrder->save()) {
                $message = (object)[
                    "title" => "Yeni Sipariş",
                    "message" => "Yeni bir sipariş oluşturuldu. Sipariş No: " . $newOrder->order_number,
                    "severity" => "success"
                ];
                broadcast(new OrderEvent($newOrder->business_id, $message, true, false, true, "business"))->toOthers();
                if ($request->location != null) {
                    OrderLocations::addLocation($newOrder->id, $request->location['latitude'], $request->location['longitude']);
                }
                return response()->json([
                    "status" => true,
                    "message" => "Sipariş başarıyla eklendi."
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Sipariş eklenirken bir hata oluştu."
                ]);
            }
        } catch (ValidationException $e) {
            return response()->json([
                "status" => false,
                "message" => $e->getMessage(),
                "errors" => $e->errors()
            ]);
        }
    }

    public function updateStatus(Request $request, $orderId)
    {
        $order = Orders::find($orderId);
        if ($order) {
            $updateStatus = $request->status;
            if ($updateStatus == "canceled") {
                if ($request->has("cancellation_reason")) {
                    $order->cancellation_accepted = 0;
                    $order->cancellation_reason = $request->cancellation_reason;
                    $order->status = "canceled";
                    if ($order->save()) {
                        $message = (object)[
                            "title" => "Başarılı",
                            "message" => "Sipariş iptal talebi oluşturuldu. Sipariş Numarası" . $order->order_number,
                            "severity" => "info"
                        ];

                        broadcast(new OrderEvent($order->business_id, $message, true, "business"))->toOthers();
                        return response()->json([
                            "status" => true,
                            "message" => "Sipariş iptal edildi. Yönetici onayından sonra iptal işlemi tamamlanacaktır."
                        ]);
                    }
                } else {
                    return response()->json([
                        "status" => false,
                        "message" => "İptal sebebi belirtilmelidir."
                    ]);
                }
            } else {
                try {
                    $request->validate([
                        'status' => 'required|string|in:opened,transporting,delivered,canceled,preparing'
                    ]);
                    $message = (object)[
                        "title" => "",
                        "message" => "",
                        "severity" => ""
                    ];
                    $returnResponse = false;
                    if ($request->status == "opened") {
                        if ($order->finishPrepare()) {
                            $returnResponse = response()->json([
                                "status" => true,
                                "message" => "Sipariş Hazırlandı Kurye Bekleniyor."
                            ]);
                            $message->title = "Sipariş Hazırlandı";
                            $message->message = "Sipariş Hazırlandı Kurye Bekleniyor. Sipariş Numarası: " . $order->order_number;
                            $message->severity = "info";
                        } else {
                            $returnResponse = response()->json([
                                "status" => false,
                                "message" => "Sipariş hazırlanırken bir hata oluştu."
                            ]);
                        }
                    } elseif ($request->status == "transporting") {
                        if ($order->startTransporting()) {
                            $returnResponse = response()->json([
                                "status" => true,
                                "message" => "Sipariş Teslimata çıkarıldı."
                            ]);
                            $message->title = "Sipariş Teslimata Çıkarıldı";
                            $message->message = "Sipariş Teslimata çıkarıldı. Sipariş Numarası: " . $order->order_number;
                            $message->severity = "info";
                        } else {
                            $returnResponse = response()->json([
                                "status" => false,
                                "message" => "Sipariş teslimata çıkarılırken bir hata oluştu."
                            ]);
                        }

                    } else {
                        $order->status = $request->status;
                        if ($order->save()) {
                            $returnResponse = response()->json([
                                "status" => true,
                                "message" => "Sipariş durumu güncellendi."
                            ]);
                            $message->title = "Sipariş Durumu Güncellendi";
                            $message->message = "Sipariş durumu güncellendi. Sipariş Numarası: " . $order->order_number;
                            $message->severity = "info";
                        } else {
                            $returnResponse = response()->json([
                                "status" => false,
                                "message" => "Sipariş durumu güncellenirken bir hata oluştu."
                            ]);
                        }
                    }
                    broadcast(new OrderEvent($order->business_id, $message, true, "business"))->toOthers();
                    return $returnResponse;
                } catch (ValidationException $e) {
                    return response()->json([
                        "status" => false,
                        "message" => $e->getMessage(),
                        "errors" => $e->errors()
                    ]);
                }
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Sipariş bulunamadı."
            ]);
        }
    }

    public function destroy($id): \Illuminate\Http\JsonResponse
    {
        $order = Orders::find($id);
        if ($order) {
            if ($order->status == "draft") {
                if ($order->delete()) {
                    broadcast(new OrderEvent($order->business_id, (object)[
                        "title" => "Sipariş Silme",
                        "message" => "Sipariş başarıyla silindi.Sipariş Numarası:" . $order->order_number,
                        "severity" => "success"
                    ], true))->toOthers();
                    return response()->json([
                        "status" => true,
                        "message" => "Sipariş başarıyla silindi."
                    ]);
                } else {
                    return response()->json([
                        "status" => false,
                        "message" => "Sipariş silinirken bir hata oluştu."
                    ]);
                }
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Sipariş durumu 'Taslak' olmayan siparişler silinemez."
                ]);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Sipariş bulunamadı."
            ]);
        }
    }

    /**
     * @param $id
     * @return JsonResponse
     */
    public function getOrder($id): \Illuminate\Http\JsonResponse
    {
        $order = Orders::where('business_id', auth()->user()->id)->where('id', $id)->first();
        if ($order) {
            $order->customer = Customers::find($order->customer_id);
            $order->address = CustomerAddresses::find($order->address_id);
            $order->start_location = json_decode($order->start_location);
            $order->end_location = json_decode($order->end_location);
            $order->courier = User::getCourier($order->courier_id);
            if ($order->cancellation_accepted_by != null) {
                $order->cancellation_accepted_by = User::where('id', $order->cancellation_accepted_by)->first(["id", "name"]);
            }
            return response()->json([
                'order' => $order,
                'status' => true
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Sipariş bulunamadı.'
            ]);
        }
    }

    /**
     * @param $id
     * @return Response|RedirectResponse
     */
    public function show($id): Response|\Illuminate\Http\RedirectResponse
    {
        $order = Orders::where('business_id', auth()->user()->id)->where('id', $id)->count();
        if ($order == 1) {
            return Inertia::render('Business/Orders/ShowPage', [
                'orderId' => $id
            ]);
        } else {
            return redirect()->route('business.orders.index')->with('message', 'Sipariş Bulunamadı.')->with('type', 'error')->with("title", "Hata");
        }
    }

    public function getLocations($id): JsonResponse
    {
        $order = Orders::where('business_id', auth()->user()->id)->where('id', $id)->first();
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

    /**
     * @throws \Exception
     */
    public function listTrendyolOrders(): JsonResponse
    {
        $trendyolClient = IntegrationHelper::getTrendyolClient(auth()->id());
        if ($trendyolClient->status) {
            $response = Orders::matchTrendyolOrders($trendyolClient->client->getPackages()["content"]);
            return response()->json([
                "status" => $response->status,
                "message" => $response->message,
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Trendyol ayarları bulunamadı."
            ]);
        }
    }

}
