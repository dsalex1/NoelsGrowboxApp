<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScheduleController;
use App\Models\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard');


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard')->with('activeSchedule', Schedule::where('is_active', 1)->first())->with('schedules', Schedule::all());
})->name('dashboard');

Route::inertia('/logs', 'Logs')->name('logs');

Route::get('/settings', function () {
    return Inertia::render('Settings')->with('schedule', Schedule::where('is_active', true)->first());
})->name('settings');

Route::resource('schedules', ScheduleController::class);
Route::post('schedules/{schedule}/activate', [ScheduleController::class, 'activate'])->name('schedules.activate');
Route::post('schedules/{schedule}/skip', [ScheduleController::class, 'skip'])->name('schedules.skip');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
