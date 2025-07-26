<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Core\AuthController;
use App\Http\Controllers\Core\RbacPermissionController;
use App\Http\Controllers\Core\RbacRoleController;
use App\Http\Controllers\Core\UserController;
use App\Http\Controllers\Mails\MailLogController;
use App\Http\Controllers\Mails\MailTemplateController;
use App\Http\Controllers\Selects\SelectController;
use App\Http\Controllers\System\SystemGlobalDropdownController;
use App\Http\Controllers\System\SystemSettingController;
use App\Http\Controllers\User\UserImageController;
use App\Http\Controllers\Example\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('', function () {
    return response()->json(['message' => 'Hello World!']);
});

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/refresh-token', [AuthController::class, 'refreshToken']);

Route::middleware('auth.middleware')->group(function () {
    // ===================================================================
    // ===================================================================
    // === EXAMPLE
    // ===================================================================
    // ===================================================================

    // ==============
    // === TASKS
    Route::resource('/tasks', TaskController::class);
});
