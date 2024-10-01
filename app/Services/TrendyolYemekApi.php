<?php

namespace App\Services;

class TrendyolYemekApi {
    private static $supplierId;
    private static $restaurantId;
    private static $apiUsername;
    private static $apiPassword;

    public static function setCredentials($supplierId, $restaurantId, $apiUsername, $apiPassword): void
    {
        if (is_null($supplierId) || is_null($restaurantId) || is_null($apiUsername) || is_null($apiPassword)) {
            throw new \Exception(json_encode(["message" => "Kimlik Bilgileri Girilmedi"]));
        }

        self::$supplierId = $supplierId;
        self::$restaurantId = $restaurantId;
        self::$apiUsername = $apiUsername;
        self::$apiPassword = $apiPassword;
    }

    /**
     * @return string
     */
    private static function getAuthHeader(): string
    {
        return 'Authorization: Basic ' . base64_encode(self::$apiUsername . ':' . self::$apiPassword);
    }

    // Menü bilgilerini getirir

    /**
     * @return mixed
     * @throws \Exception
     */
    public static function getMenu(): mixed
    {
        self::checkCredentials();
        $url = "https://api.trendyol.com/mealgw/suppliers/" . self::$supplierId . "/restaurants/" . self::$restaurantId . "/products";
        return self::executeCurl($url);
    }

    // Sipariş detaylarını getirir

    /**
     * @throws \Exception
     */
    public static function getOrderDetails($orderId) {
        self::checkCredentials();
        $url = "https://api.trendyol.com/mealgw/suppliers/" . self::$supplierId . "/orders/" . $orderId;
        return self::executeCurl($url);
    }

    // Tüm siparişleri getirir

    /**
     * @throws \Exception
     */
    public static function getAllOrders() {
        self::checkCredentials();
        $url = "https://api.trendyol.com/mealgw/suppliers/" . self::$supplierId . "/orders";
        return self::executeCurl($url);
    }

    // Sipariş durumu günceller

    /**
     * @throws \Exception
     */
    public static function updateOrderStatus($orderId, $status) {
        self::checkCredentials();
        $url = "https://api.trendyol.com/mealgw/suppliers/" . self::$supplierId . "/orders/" . $orderId . "/status";
        $data = json_encode(['status' => $status]);
        return self::executeCurl($url, $data, 'PUT');
    }

    // Sipariş hazırlama süresini günceller

    /**
     * @throws \Exception
     */
    public static function updatePreparationTime($orderId, $preparationTime) {
        self::checkCredentials();
        $url = "https://api.trendyol.com/mealgw/suppliers/" . self::$supplierId . "/orders/" . $orderId . "/preparation-time";
        $data = json_encode(['preparationTime' => $preparationTime]);
        return self::executeCurl($url, $data, 'PUT');
    }

    // Genel cURL işlemi
    private static function executeCurl($url, $data = null, $method = 'GET') {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [self::getAuthHeader(), 'Content-Type: application/json']);

        if ($method !== 'GET') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
            if ($data) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            }
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode >= 400) {
            throw new \Exception("HTTP Error: " . $httpCode);
        }

        return json_decode($response, true);
    }

    // Kimlik bilgilerini kontrol eden fonksiyon
    private static function checkCredentials(): void
    {
        if (is_null(self::$supplierId) || is_null(self::$restaurantId) || is_null(self::$apiUsername) || is_null(self::$apiPassword)) {
            throw new \Exception(json_encode(["message" => "Kimlik Bilgileri Eksik"]));
        }
    }
}
