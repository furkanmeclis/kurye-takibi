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
}
