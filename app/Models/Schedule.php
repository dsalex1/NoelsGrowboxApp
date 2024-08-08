<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'items',
        'cycle_length',
        'is_active',
        'start_date',
    ];

    protected $casts = [
        'items' => 'array',
        'is_active' => 'boolean',
        'start_date' => 'datetime',
    ];
}
