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
                'autoApprove' => 'boolean',
                'preparationTime' => [
                    'required_if:autoApprove,true',
                    'nullable',
                    'min:1',
                ],
                'defaultPackagePrice' => 'required|min:0',
            ]);

            $data = [
                'apiKey' => $request->apiKey,
                'apiSecret' => $request->apiSecret,
                'supplierId' => $request->supplierId,
                'restaurantId' => $request->restaurantId,
                'autoApprove' => $request->autoApprove,
                'preparationTime' => $request->preparationTime,
                'defaultPackagePrice' => $request->defaultPackagePrice,
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
            $restaurant = $response["restaurants"][0];
            $settings = [
                "autoApprove" => $trendyolClient->settings->autoApprove,
                "preparationTime" => $trendyolClient->settings->preparationTime,
                "defaultPackagePrice" => $trendyolClient->settings->defaultPackagePrice,
            ];
            return response()->json([
                "status" => true,
                "data" => array_merge($restaurant, $settings)
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => $trendyolClient->message,
                "empty" => true
            ]);
        }
    }

    public function updateWorkingStatusTrendyol(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $request->validate([
                'workingStatus' => 'required'
            ]);
            $trendyolClient = IntegrationHelper::getTrendyolClient();
            if ($trendyolClient->status) {
                $status = $trendyolClient->client->updateRestaurantStatus($request->workingStatus);
                if ($status) {
                    return response()->json([
                        "status" => true,
                        "message" => "Durum Güncellendi : " . ($request->workingStatus == "OPEN" ? "Açık" : "Kapalı")
                    ]);
                } else {
                    return response()->json([
                        "status" => false,
                        "message" => "Durum Güncellenemedi"
                    ]);
                }
            } else {
                return response()->json([
                    "status" => false,
                    "message" => $trendyolClient->message
                ]);
            }
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                "status" => false
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Kimlik Bilgilerinizi Kontrol Edin",
                "status" => false
            ]);
        }
    }

    public function updateAutoApproveTrendyol(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $request->validate([
                'autoApprove' => 'required|boolean',
                'preparationTime' => [
                    'required_if:autoApprove,true',
                    'nullable',
                    'min:1',
                ],
            ]);
            $preparationTime = $request->preparationTime;
            if(!$request->autoApprove){
                $preparationTime = 0;
            }
            $result = Integrations::updateAutoApproveTrendyol(auth()->id(), $request->autoApprove, $preparationTime);
            if ($result) {
                return response()->json([
                    "status" => true,
                    'message' => 'Otomatik Onaylama Ayarları Güncellendi'
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

    public function updateDefaultPackagePriceForTrendyol(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $request->validate([
                'defaultPackagePrice' => 'required|min:0',
            ]);
            $result = Integrations::updateDefaultPackagePrice(auth()->id(), $request->defaultPackagePrice);
            if ($result) {
                return response()->json([
                    "status" => true,
                    'message' => 'Varsayılan Paket Fiyatı Güncellendi'
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
}
