<?php

namespace App\Http\Controllers\Business;

use App\Events\Orders\NewOrder;
use App\Events\Orders\UpdateOrder;
use App\Http\Controllers\Controller;
use App\Models\CustomerAddresses;
use App\Models\Customers;
use App\Models\Orders;
use App\Models\User;
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

    public function store(Request $request)
    {
        try {
            $request->validate([
                'customer_id' => 'required|integer|exists:customers,id',
                'address_id' => 'required|integer|exists:customer_addresses,id',
                'customer_note' => 'nullable|string|max:255',
                'location' => 'nullable',
            ]);
            $newOrder = new Orders();
            $newOrder->customer_id = $request->customer_id;
            $newOrder->address_id = $request->address_id;
            $newOrder->customer_note = $request->customer_note;
            $newOrder->business_id = auth()->user()->id;
            $newOrder->status = "draft";
            if ($request->location != null) {
                $newOrder->start_location = json_encode($request->location);
            }
            if ($newOrder->save()) {
                broadcast(new NewOrder($newOrder->id))->toOthers();
                broadcast(new UpdateOrder(null, "", "", "", true, $newOrder->business_id))->toOthers();
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
                    $autoAccepted = false;
                    if ($order->status == "opened") {
                        $order->cancellation_accepted = 1;
                        $order->cancellation_accepted_by = User::where('role', 'admin')->first()->id;
                        $autoAccepted = true;
                    }
                    $order->cancellation_reason = $request->cancellation_reason . ($autoAccepted ? " (Otomatik kabul edildi)" : "");
                    $order->status = "canceled";
                    $order->canceled_at = now();
                    if ($order->save()) {
                        $message = $autoAccepted ? "Sipariş Talep Üzerine Sistem Tarafından İptal Edildi" : "Sipariş İptal Talebi Oluşturuldu";
                        $title = $autoAccepted ? "Sipariş İptal Edildi" : "Sipariş İptal Talebi";
                        broadcast(new UpdateOrder($order->id, "error", $message, $title, true, $order->business_id))->toOthers();
                        broadcast(new UpdateOrder(null, "error", $message, $title, true, $order->business_id))->toOthers();
                        return response()->json([
                            "status" => true,
                            "message" => "Sipariş iptal edildi." . ($autoAccepted ? " İptal talebi otomatik olarak kabul edildi." : " Yönetici onayından sonra iptal işlemi tamamlanacaktır.")
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
                        'status' => 'required|string|in:opened,transporting,delivered,canceled'
                    ]);
                    $order->status = $request->status;
                    if ($order->save()) {
                        broadcast(new UpdateOrder($order->id, "info", "Sipariş Durumu Güncellendi", "Sipariş Durumu", true, $order->business_id))->toOthers();
                        broadcast(new UpdateOrder(null, "info", "Sipariş Durumu Güncellendi", "Sipariş Durumu", true, $order->business_id))->toOthers();
                        return response()->json([
                            "status" => true,
                            "message" => "Sipariş durumu güncellendi."
                        ]);
                    } else {
                        return response()->json([
                            "status" => false,
                            "message" => "Sipariş durumu güncellenirken bir hata oluştu."
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
                    broadcast(new UpdateOrder(null, "info", "", "", true, $order->business_id))->toOthers();
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
            return Inertia::render('Business/Orders/Show', [
                'orderId' => $id
            ]);
        } else {
            return redirect()->route('business.orders.index')->with('message', 'Sipariş Bulunamadı.')->with('type', 'error')->with("title", "Hata");
        }
    }
}
