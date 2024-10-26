<?php

namespace App\Http\Controllers\Business;

use App\Models\Integrations;
use App\Services\IntegrationHelper;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class IntegrationsController
{
    public function show(): \Inertia\Response
    {
        return Inertia::render('Business/Integrations');
    }

    public function getIntegrations(): \Illuminate\Http\JsonResponse
    {
        $credentials = Integrations::findOrCreateBusiness(auth()->id());
        if ($credentials) {
            return response()->json([
                "status" => true,
                "data" => [
                    "trendyol" => $credentials->trendyol(),
                    "getir" => $credentials->getir(),
                    "yemeksepeti" => $credentials->yemeksepeti(),
                ]
            ]);
        } else {
            return response()->json([
                'message' => 'Bir Sorun Oluştu',
                "status" => false
            ]);
        }
    }

    public function saveTrendyolSettings(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $request->validate([
                'apiKey' => 'required',
                'apiSecret' => 'required',
                'supplierId' => 'required',
                'restaurantId' => 'required',
            ]);
            $data = [
                'apiKey' => $request->apiKey,
                'apiSecret' => $request->apiSecret,
                'supplierId' => $request->supplierId,
                'restaurantId' => $request->restaurantId,
            ];
            $result = Integrations::saveTrendyol(auth()->id(), $data);
            if ($result) {
                return response()->json([
                    "status" => true,
                    'message' => 'Trendyol Ayarları Kaydedildi'
                ]);
            } else {
                return response()->json([
                    'message' => 'Bir Sorun Oluştu',
                    "status" => false
                ]);
            }
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                "status" => false
            ]);
        }
    }

    /**
     * @throws \Exception
     */
    public function getTrendyolRestaurantInfo(): \Illuminate\Http\JsonResponse
    {
        $trendyolClient = IntegrationHelper::getTrendyolClient();
        if ($trendyolClient->status) {
            $response = $trendyolClient->client->getRestaurantInfo();
            if ($response == null) {
                return response()->json([
                    "status" => false,
                    "message" => "Bağlantı Hatası Kimlik Bilgilerinizi Kontrol Edin"
                ]);
            }
            if ($response["totalElements"] == 0) {
                return response()->json([
                    "status" => false,
                    "message" => "Trendyol Restoran Bilgisi Bulunamadı"
                ]);
            }
            return response()->json([
                "status" => true,
                "data" => $response["restaurants"][0]
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => $trendyolClient->message
            ]);
        }
    }
}
