<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


/**
 * Class UserDetail
 *
 * @property int $id
 * @property int $user_id
 * @property string|null $user_name
 * @property string|null $gender
 * @property string|null $profile_picture
 * @property string|null $contact
 * @property Carbon|null $birthdate
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */

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
