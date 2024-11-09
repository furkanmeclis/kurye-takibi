<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerAddresses extends Model
{
    use HasFactory;

    public function isMappedRecord()
    {
        return Orders::where('address_id', $this->id)->exists();
    }
}
