<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



/**
 * Class Task
 *
 * @property int $id
 * @property int $user_id
 * @property string|null $categories
 * @property string|null $title
 * @property string|null $description
 * @property Carbon|null $deadline
 * @property int $emergent_level
 * @property string|null $progress
 * @property string|null $assign_user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */

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
        'assign_user_id',
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
