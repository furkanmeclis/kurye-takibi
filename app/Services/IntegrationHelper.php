<?php

namespace App\Services;

use App\Models\Integrations;
use App\Models\User;
use Exception;

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
        $businessEmail = User::where('id', $businessId)->first("email")->email;
        if ($trendyol) {
            return (object)[
                "status" => true,
                "settings" => $trendyol,
                "client" => new TrendyolFoodService($trendyol->supplierId, $trendyol->restaurantId, $trendyol->apiKey, $trendyol->apiSecret, $businessEmail)
            ];
        } else {
            return (object)[
                "status" => false,
                "settings" => null,
                "message" => "Trendyol Ayarları Bulunamadı"
            ];
        }
    }

    public static function getCancellationReasonForTrendyol($reasonCode): string
    {
        $reasons = [
            69 => 'System Fraud',
            601 => 'Adres yanlış',
            602 => 'Adreste değil',
            603 => 'Fraud',
            604 => 'Müşteri iptal talep etti',
            605 => 'Sipariş gecikti - Müşteri istemiyor',
            607 => 'Adres konum uyuşmaması',
            625 => 'Kabul edilmedi',
            641 => 'Kaza',
            642 => 'Yüksek Yoğunluk Sebepli / Kurye yok',
            643 => 'Alan dışı',
            644 => 'Kurye kaynaklı',
            645 => 'Kurye kaynaklı',
            646 => 'Kurye kaynaklı',
            647 => 'Ürünler zarar gördü',
            648 => 'Kurye Kaynaklı - Site girişi kimlik sorunu',
            661 => 'Admin down',
            662 => 'Kurye App down',
            663 => 'Seller panel down',
            681 => 'Fraud telefon numarası',
            682 => 'Fraud teslimat adresi'
        ];
        $response = $reasons[$reasonCode] ?? 'Bilinmeyen Sebep';
        return "Trendyol: " . $response;
    }

}
