<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('categories')->comment('group/individual');
            $table->string('title');
            $table->longText('description');
            $table->string('deadline')->comment('ex: 1/02/2025');
            $table->string('emergent_level')->comment('1:very_important, 2:important, 3:average, 4:not_important, 5:not_very_important');
            $table->string('progress')->comment('in_progress, pending, completed')->nullable()->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
