<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Integrations extends Model
{
    use HasFactory;

    public static function findOrCreateBusiness($businessId)
    {
        $integration = Integrations::where('business_id', $businessId)->first();
        if ($integration) {
            return $integration;
        } else {
            $integration = new Integrations();
            $integration->business_id = $businessId;
            $integration->save();
            return $integration;
        }
    }

    public static function saveTrendyol($businessId, $data): bool
    {
        $integration = self::findOrCreateBusiness($businessId);
        $integration->trendyol = json_encode($data);
        return $integration->save();
    }

    public static function saveYemeksepeti($businessId, $data): bool
    {
        $integration = self::findOrCreateBusiness($businessId);
        $integration->yemeksepeti = json_encode($data);
        return $integration->save();
    }

    public function trendyol()
    {
        return $this->trendyol != null ? json_decode($this->trendyol) : false;
    }

    public function getir()
    {
        return $this->getir != null ? json_decode($this->getir) : false;
    }

    public function yemeksepeti()
    {
        return $this->yemeksepeti != null ? json_decode($this->yemeksepeti) : false;
    }
}
