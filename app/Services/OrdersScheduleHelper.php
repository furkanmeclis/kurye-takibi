<?php

namespace App\Services;

use App\Models\Integrations;
use App\Models\Orders;
use Illuminate\Support\Facades\Log;

class OrdersScheduleHelper
{
    /**
     * @throws \Exception
     */
    public static function fetchOrders(): array
    {
        $integrations = [];
        foreach (Integrations::all() as $integration) {
            $trendyol = $integration->trendyol();
            if ($trendyol) {
                $integrations[] = (object)[
                    'trendyol' => $trendyol,
                    'business_id' => $integration->business_id
                ];
            }
        }
        $messages = [];
        foreach ($integrations as $integration) {
            $trendyolClient = IntegrationHelper::getTrendyolClient($integration->business_id);
            if ($trendyolClient->status) {
                $trendyolOrders = $trendyolClient->client->getPackages();
                if ($trendyolOrders != null) {
                    Orders::matchTrendyolOrders($trendyolOrders["content"], $integration->business_id);
                } else {
                    $messages[] = "No Orders Found - Business ID: " . $integration->business_id;
                }
            } else {
                $messages[] = $trendyolClient->message . " - Business ID: " . $integration->business_id;
            }
        }
        if (count($messages) > 0) {
            Log::info("Order Scheduling Response [".date("d.m.Y H:i:s")."]: " . json_encode($messages));
        }
        return $messages;
    }

}
