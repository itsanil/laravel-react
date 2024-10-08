<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_type',
        'total_no_of_slots',
        'pickup_point',
        'destination',
        'start_time',
        'user_id',
    ];
}
