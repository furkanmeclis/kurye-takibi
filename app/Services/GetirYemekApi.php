<?php

namespace App\Services;

class GetirYemekApi
{
    public string $endpoint = 'https://food-external-api-gateway.getirapi.com/';
    public function makeRequest($url, $method, $data = null)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->endpoint . $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        if ($method == 'POST') {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        $headers = [
            'Content-Type: application/json',
            'Authorization: Bearer ' . 'token'
        ];
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        curl_close($ch);
        return json_decode($response, true);
    }
    public function login()
    {
        try{
            $response = $this->makeRequest('auth/login', 'POST', [
                'username' => 'username',
                'password' => 'password'
            ]);

        }catch (\Exception $e){
            return false;
        }
    }


}
