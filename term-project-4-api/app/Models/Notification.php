<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
