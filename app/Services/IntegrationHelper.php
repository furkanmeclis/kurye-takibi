<?php

namespace App\Services;

use App\Models\Integrations;
use Exception;
use furkanmeclis\Tools\TrendyolYemekApi;

class IntegrationHelper
{

    /**
     * @throws Exception
     */
    public static function getTrendyolClient($businessId = false): object
    {
        if (!$businessId) {
            $businessId = auth()->id();
        }
        $trendyol = Integrations::findOrCreateBusiness($businessId)->trendyol();
        if ($trendyol) {
            return (object)[
                "status" => true,
                "client" => new TrendyolYemekApi($trendyol->supplierId, $trendyol->restaurantId, $trendyol->apiKey, $trendyol->apiSecret, auth()->user()->email)
            ];
        } else {
            return (object)[
                "status" => false,
                "message" => "Trendyol Ayarları Bulunamadı"
            ];
        }

    }

}
