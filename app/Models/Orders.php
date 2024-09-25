<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class Orders extends Model
{
    use HasFactory;

    /**
     * Kuryeye belirli bir çapta yakın siparişleri döndürür.
     *
     * @param float $lat Kuryenin enlemi
     * @param float $lon Kuryenin boylamı
     * @param float $radius Arama yarıçapı (km olarak), varsayılan 10 km
     * @return Collection Yakındaki siparişlerin koleksiyonu
     */
    public static function getNearbyOrders($lat, $lon, $radius = 10): Collection
    {
        $earthRadius = 6371;
        return self::select(
            'orders.*',
            DB::raw("(
                    $earthRadius * ACOS(
                        COS(RADIANS($lat)) * COS(RADIANS(JSON_EXTRACT(orders.start_location, '$.latitude'))) *
                        COS(RADIANS(JSON_EXTRACT(orders.start_location, '$.longitude')) - RADIANS($lon)) +
                        SIN(RADIANS($lat)) * SIN(RADIANS(JSON_EXTRACT(orders.start_location, '$.latitude')))
                    )
                ) AS distance")
        )
            ->having('distance', '<=', $radius)
            ->orderBy('distance', 'asc')
            ->get();
    }
}
