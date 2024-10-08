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
        // Schema::create('users', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name');
        //     $table->string('mobile', 15)->unique();
        //     $table->string('email')->unique();
        //     $table->integer('age');
        //     $table->string('photo')->nullable();
        //     $table->enum('gender', ['M', 'F', 'O']);
        //     $table->timestamps();
        // });
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('vehicle_type');
            $table->integer('total_no_of_slots');
            $table->integer('total_no_of_slots_available');
            $table->integer('slots_used by_creater');
            $table->string('pickup_point');
            $table->string('destination');
            $table->dateTime('start_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
