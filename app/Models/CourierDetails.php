<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourierDetails extends Model
{
    use HasFactory;
    protected $fillable = [
        'courier_id',       // Yeni eklenen alan
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
    ];
}
