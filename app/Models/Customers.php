<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customers extends Model
{
    use HasFactory;

    public function isMappedRecord()
    {
        return Orders::where('customer_id', $this->id)->exists();
    }
}
