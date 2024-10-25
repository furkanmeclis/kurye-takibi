<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile_completed(): object
    {
        if ($this->role == "courier") {
            $details = CourierDetails::where('courier_id', $this->id)->first(["completed", "approved"]);
            if ($details) {
                return (object)[
                    "completed" => $details->completed,
                    "approved" => $details->approved
                ];
            }
        } else if ($this->role == "business") {
            $details = BusinessDetails::where('business_id', $this->id)->first(["completed", "approved"]);
            if ($details) {
                return (object)[
                    "completed" => $details->completed,
                    "approved" => $details->approved
                ];
            }
        }
        return (object)[
            "completed" => false,
            "approved" => false
        ];
    }

    public static function getCourier($id)
    {
        $courier = User::where('id', $id)->where('role', 'courier')->first();
        if ($courier) {
            $courier->details = CourierDetails::where('courier_id', $courier->id)->first();
            return $courier;
        } else {
            return false;
        }
    }

    public static function getBusiness($id)
    {
        $business = User::where('id', $id)->where('role', 'business')->first();
        if ($business) {
            $business->details = BusinessDetails::where('business_id', $business->id)->first();
            return $business;
        } else {
            return false;
        }
    }

    public function getCourierAvailability(): object
    {
        $returnObject = (object)[
            "available" => false,
            "details" => null,
            "message" => "Bu Servis Sadece Kurye Hesapları İçin Kullanılmaktadır."
        ];
        if ($this->role == "courier") {
            $details = CourierDetails::where('courier_id', $this->id)->first();
            $returnObject->details = $details;
            $returnObject->available = $details->approved;
            if (!$details->approved) {
                $returnObject->message = "Kurye Hesabınız Onaylanmadığı İçin Sipariş Alımı Yapamazsınız.";
            }
        }
        return $returnObject;
    }

    public function isTransporting(): bool
    {
        if ($this->role == "courier") {
            $orderCount = Orders::where('courier_id', $this->id)->where('status', 'transporting')->count();
            if ($orderCount == 1) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    public function details()
    {
        if ($this->role == "courier") {
            return CourierDetails::where('courier_id', $this->id)->first();
        } else if ($this->role == "business") {
            return BusinessDetails::where('business_id', $this->id)->first();
        }
    }

}
