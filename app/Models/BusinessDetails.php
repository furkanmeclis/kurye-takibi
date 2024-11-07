<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessDetails extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'address',
        'city',
        'state',
        'zip',
        'country',
        'status',
        'billing',
        'identity',
        'birth_date',
        'tax_name',
        'tax_number',
        'tax_address',
        'tax_office',
        'vehicle_type',
        'latitude',
        'longitude',
        'sector',
        'businessPhone',
    ];

    public function orders(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Orders::class, 'business_id', 'business_id');
    }

    public static function findOrCreateBusinessDetails()
    {
        $user = auth()->user();
        $control = self::where('business_id', $user->id)->first();
        if (!$control) {
            $business = new BusinessDetails();
            $business->business_id = $user->id;
            $business->name = $user->name;
            $business->email = $user->email;
            $business->phone = $user->phone;
            $business->status = 0;
            $business->completed = 0;
            $business->approved = 0;
            if ($business->save()) {
                return self::where('business_id', $user->id)->first();
            } else {
                return false;
            }
        } else {
            return $control;
        }
    }
}
