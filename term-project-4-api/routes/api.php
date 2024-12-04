<?php

use App\Http\Controllers\CodeController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\User\HistoryController;
use App\Http\Controllers\User\NotificationController;
use App\Http\Controllers\User\SettingController;
use App\Http\Controllers\User\TaskController;
use App\Http\Controllers\User\UserController;
use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/user-sign-up', [LoginController::class, 'signUp']);
Route::post('/user-sign-in', [LoginController::class, 'signIn']);

//email verification code
Route::post('/email-verification', [EmailController::class, 'emailVerification']);

//code verification
Route::post('/code-verification-email', [CodeController::class, 'codeVerifiaction']);
Route::post('/resend-verification-code', [CodeController::class, 'create']);
Route::delete('/remove-verification-code', [CodeController::class, 'delete']);

Route::middleware(['auth:sanctum'])->group(function () {

    //user
    Route::get('/user-profile', [UserController::class, 'profile']);
    Route::post('/user-edit', [UserController::class, 'edit']);

    //task
    Route::post('/task-create', [TaskController::class, 'store']);
    Route::post('/task-view/data', [TaskController::class, 'view']);
    Route::post('/task-edit', [TaskController::class, 'edit']);
    Route::get('/task-view-detail/{id}', [TaskController::class, 'show']);
    Route::delete('/task-remove/{id}', [TaskController::class, 'destroy']);

    //user assigner
    Route::post('/task-assigned-view/data',[TaskController::class, 'viewAssignTask']);
    Route::post('/task-update-progrss', [TaskController::class,'update']);
    
    //history
    Route::post('/history-view/data', [HistoryController::class, 'view']);
    Route::get('/history-detail/{id}', [HistoryController::class, 'show']);

    //notification
    // Route::post('/notification-create', [NotificationController::class, 'store']);
    Route::post('/notification-view/data', [NotificationController::class, 'view']);
    Route::put('/notification-read/{id}', [NotificationController::class, 'read']);
    Route::delete('/notification-remove/{id}', [NotificationController::class, 'destroy']);

    //setting
    Route::post('/email-edit', [SettingController::class, 'emailChange']);
    Route::post('/password-edit', [SettingController::class, 'passwordUpdateByEmailVerification']);
    Route::post('/information-edit', [SettingController::class, 'userInformationEdit']);
});

Route::post('/user-sign-out', [LoginController::class, 'logout']);
