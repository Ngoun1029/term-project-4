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
 * @property int $assign_user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */

class History extends Model
{
    use HasFactory;

    protected $table = 'hisotrys';
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
    protected $cast = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    protected $hidden = [
        'assign_user_id'
    ];
}
