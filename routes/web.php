<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\TripController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Jobs\LongRunningScriptJob;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    if (\Auth::user()) {
        return redirect('questions.index');
    }
    return Inertia::render('Auth/Login', [
    // return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('run-script', function () {
    ini_set('max_execution_time', -1);
    LongRunningScriptJob::dispatch();

    // Respond to the frontend with a success message
    return response()->json(['message' => 'Script is running in the background!'], 200);
})->name('run-script');

Route::get('/dashboard', function () {
    $user = \Auth::user();
    // echo "<pre>"; print_r($user->getRoleNames()); echo "</pre>"; die('anil testing');
    return Inertia::render('Dashboard',compact('user'));
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('category', CategoryController::class);
    Route::post('category-upload/{id}', [CategoryController::class, 'updates'])->name('category-upload');
    Route::resource('exams', ExamController::class);
    Route::resource('questions', QuestionController::class);
    Route::resource('trip', TripController::class);
    Route::get('scrape', [TripController::class,'scrape'])->name('scrape');
    
    
    // Route::get('/users/edit/{id}', [UserController::class, 'edit'])->name('users.edit');
    
});


Route::get('/uikit/button', function () {
    return Inertia::render('main/uikit/button/page');
})->name('button');





require __DIR__.'/auth.php';
