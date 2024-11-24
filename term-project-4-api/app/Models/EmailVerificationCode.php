<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Task
 *
 * @property int $id
 * @property string|null $email
 * @property string|null $verification_code
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */

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
