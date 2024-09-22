<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderLocations extends Model
{
    use HasFactory;

    public static function getLocations($order_id)
    {
        return self::where('order_id', $order_id)->orderBy('created_at', 'desc')->get();
    }

    public static function addLocation($order_id,$latitude,$longitude,$courier_id = false): bool
    {
        $orderLocation = new self();
        $orderLocation->order_id = $order_id;
        $orderLocation->latitude = $latitude;
        $orderLocation->longitude = $longitude;
        if($courier_id){
            $orderLocation->courier_id = $courier_id;
        }else{
            if(auth()->user()->role == "courier"){
                $orderLocation->courier_id = auth()->user()->id;
            }
        }
        if($orderLocation->save()){
            broadcast(new \App\Events\Orders\LocationChange($order_id,$latitude,$longitude))->toOthers();
            return true;
        }else{
            return false;
        }
    }
}
