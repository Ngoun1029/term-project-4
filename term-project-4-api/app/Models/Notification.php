<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


/**
 * Class Notification
 *
 * @property int $id
 * @property int $user_id
 * @property int $task_id
 * @property string|null $message
 * @property boolean $mark_as_read
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */


class Notification extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $fillable = [
        'user_id',
        'task_id',
        'message',
        'mark_as_read',
        'created_at',
        'updated_at',
    ];
    protected $hidden = [

    ];

    protected $casts = [
        'mark_as_read' => 'boolean',
        'created_at'=> 'datetime',
        'updated_at'=> 'datetime',
    ];
}
