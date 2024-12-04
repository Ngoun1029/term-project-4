<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


/**
 * Class Invitation
 *
 * @property int $id
 * @property int $inviter_id
 * @property int $invited_id
 * @property string|null $message
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class Invitation extends Model
{
    use HasFactory;

    protected $table = 'invitations';

    protected $fillable = [
        'inviter_id',
        'invited_id',
        'message',
        'status',
        'created_at',
        'updated_at',
    ];
    protected $hidden = [

    ];

    protected $casts = [
        'created_at'=> 'datetime',
        'updated_at'=> 'datetime',
    ];

}
