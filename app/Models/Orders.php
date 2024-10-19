<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class Orders extends Model
{
    use HasFactory;

    public static int $earthRadius = 6371;

    public function businessDetails(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(BusinessDetails::class, 'business_id', 'business_id');
    }


    public static function getNearbyOrders($lat, $lon, $limit = false): Collection
    {
        $radius = 10;
        $earthRadius = self::$earthRadius;
        Session::put("courier_lat", $lat);
        Session::put("courier_lon", $lon);
        $instance = self::join('business_details', 'orders.business_id', '=', 'business_details.business_id')
            ->whereNotNull('business_details.latitude')
            ->whereNotNull('business_details.longitude')
            ->select(
                'orders.*',
                DB::raw("(
                $earthRadius * ACOS(
                    COS(RADIANS($lat)) * COS(RADIANS(business_details.latitude)) *
                    COS(RADIANS(business_details.longitude) - RADIANS($lon)) +
                    SIN(RADIANS($lat)) * SIN(RADIANS(business_details.latitude))
                )
            ) AS distance")
            )
            ->having('distance', '<=', $radius)
            ->where('orders.status', 'opened')
            ->orderBy('distance', 'asc');
        if ($limit !== false) {
            $instance = $instance->offset(0)->limit($limit);
        }
        return $instance->get()->map(function ($order) {
            $order->distance = round($order->distance, 2);
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
    }

    public static function calculateDistance($latFrom, $lonFrom, $latTo, $lonTo): float
    {
        $latFrom = deg2rad($latFrom);
        $lonFrom = deg2rad($lonFrom);
        $latTo = deg2rad($latTo);
        $lonTo = deg2rad($lonTo);
        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;
        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos($latFrom) * cos($latTo) *
            sin($lonDelta / 2) * sin($lonDelta / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return round(self::$earthRadius * $c, 2);
    }

    public static function findOrder($id, $withDetails = false, $withLocations = false): object
    {
        $order = self::find($id);
        if ($order) {
            if (!Session::has("courier_lat") || !Session::has("courier_lon")) {
                return (object)[
                    "status" => false,
                    "message" => "Kurye Konumu Alınamadı",
                    "getLocation" => true
                ];
            } else {
                if (
                    $order->status != "opened" &&
                    auth()->user()->role == "courier" &&
                    auth()->user()->id != $order->courier_id
                ) {
                    return (object)[
                        "status" => false,
                        "message" => "Bu İşlemi Yapmaya Yetkiniz Yok"
                    ];
                }
                if ($withDetails) {
                    $latFrom = Session::get("courier_lat");
                    $lonFrom = Session::get("courier_lon");
                    $order->customer = Customers::find($order->customer_id);
                    $order->address = CustomerAddresses::find($order->address_id);
                    $order->start_location = json_decode($order->start_location);
                    $order->end_location = json_decode($order->end_location);
                    $order->courier = User::getCourier($order->courier_id);
                    $order->business = User::getBusiness($order->business_id);
                    if ($order->cancellation_accepted_by != null) {
                        $order->cancellation_accepted_by = User::where('id', $order->cancellation_accepted_by)->first(["id", "name"]);
                    }
                    $latTo = $order->business->details->latitude;
                    $lonTo = $order->business->details->longitude;
                    $order->distance = self::calculateDistance($latFrom, $lonFrom, $latTo, $lonTo);
                }
                if ($withLocations) {
                    $order->locations = OrderLocations::getLocations($order->id);
                }
                return (object)[
                    "status" => true,
                    "order" => $order,
                    "message" => $order->status != "opened" ? "Bu Sipariş Görüntülemeye Müsait Değildir" : "Sipariş Görüntülendi"
                ];
            }
        }
        return (object)[
            "status" => false,
            "message" => "Sipariş Bulunamadı"
        ];
    }

    public static function getCourierOrders()
    {
        $courierId = auth()->user()->id;
        return self::where('courier_id', $courierId)->orderBy('updated_at', 'desc')->get()->map(function ($order) {
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
    }

    public static function getCourierStatics(int $days = 7): object
    {
        $courierId = auth()->user()->id;
        $startDate = Carbon::now()->subDays($days);
        $orders = self::where('courier_id', $courierId)
            ->where('status', "delivered")
            ->where('updated_at', '>=', $startDate)
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($order) {
                $acceptedAt = Carbon::parse($order->courier_accepted_at);
                $deliveredAt = Carbon::parse($order->delivered_at);
                $hours = $acceptedAt->diffInHours($deliveredAt);
                $start_location = json_decode($order->start_location);
                $end_location = json_decode($order->end_location);
                $distance = self::calculateDistance(
                    $start_location->latitude,
                    $start_location->longitude,
                    $end_location->latitude,
                    $end_location->longitude);
                $order->average_speed = $hours > 0 ? $distance / $hours : 0;
                $order->delivery_time = $acceptedAt->diffInMinutes($deliveredAt);
                return $order;
            });

        $sumSpeed = 0;
        $sumTime = 0;
        $sumPrice = 0;
        $ordersCount = count($orders);

        foreach ($orders as $order) {
            $sumSpeed += $order->average_speed;
            $sumTime += $order->delivery_time;
            $sumPrice += $order->price;
        }

        $averageSpeed = $ordersCount > 0 ? ($sumSpeed / $ordersCount) : 0;
        $averageTime = $ordersCount > 0 ? ($sumTime / $ordersCount) : 0;

        return (object)[
            "price" => $sumPrice,
            "speed" => round($averageSpeed, 2),
            "time" => round($averageTime, 2),
            "count" => $ordersCount
        ];
    }

}
