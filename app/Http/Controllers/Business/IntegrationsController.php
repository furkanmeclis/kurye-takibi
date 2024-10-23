<?php

namespace App\Http\Controllers\Business;

use App\Models\Integrations;
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
            ]);
            $data = [
                'apiKey' => $request->apiKey,
                'apiSecret' => $request->apiSecret,
                'supplierId' => $request->supplierId,
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
}
