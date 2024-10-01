<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class Orders extends Model
{
    use HasFactory;

    public function businessDetails(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(BusinessDetails::class, 'business_id', 'business_id');
    }

    public static function getNearbyOrders($lat, $lon, $radius = 10): Collection
    {
        $earthRadius = 6371;

        return self::join('business_details', 'orders.business_id', '=', 'business_details.business_id')
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
            ->orderBy('distance', 'asc')
            ->get()->map(function ($order) {
                $order->distance = round($order->distance,2);
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
}
