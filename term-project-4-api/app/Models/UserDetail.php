<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDetail extends Model
{
    use HasFactory;

    protected $table = 'user_details';
    protected $fillable = [
        'user_id',
        'user_name',
        'gender',
        'profile_picture',
        'contact',
        'birthdate',
        'created_at',
        'updated_at',
    ];
    protected $hidden = [];

    protected $casts = [
        'birthdate' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
