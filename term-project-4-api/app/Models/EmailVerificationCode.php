<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailVerificationCode extends Model
{
    use HasFactory;
    protected $table = 'email_verification_codes';
    protected $fillable = [
        'email',
        'verification_code',
        'created_at',
        'upadted_at',
    ];

    protected $hidden = [];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
