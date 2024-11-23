<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $table = 'tasks';

    protected $fillable = [
        'user_id',
        'categories',
        'title',
        'description',
        'deadline',
        'emergent_level',
        'progress',
        'created_at',
        'updated_at',
    ];
    protected $hidden = [

    ];

    protected $casts = [
        'deadline' => 'datetime',
        'created_at'=> 'datetime',
        'updated_at'=> 'datetime',
    ];
}
