<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScheduleController;
use App\Models\DataLog;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/dashboard');


Route::get('/dashboard', function () {
    $actuators = yaml_parse_file(base_path('python/actuators.yml'));
    $sensors = yaml_parse_file(base_path('python/sensors.yml'));
    return Inertia::render('Dashboard')
        ->with('activeSchedule', Schedule::where('is_active', 1)->first())
        ->with('schedules', Schedule::all())
        ->with('actuators', $actuators)
        ->with('sensors', $sensors)
        ->with('now', now());
})->name('dashboard');

Route::get('/logs', function (Request $request) {
    // use dataPointInterval, endDate, numberOfDataPoints from query
    $validated = $request->validate([
        'dataPointInterval' => 'nullable|integer',
        'endDate' => 'nullable|date',
        'numberOfDataPoints' => 'nullable|integer|max:10000',
    ]);
    $data = DataLog::latest()->limit(array_key_exists("numberOfDataPoints", $validated) ? $validated["numberOfDataPoints"] : 1000);

    if (array_key_exists("endDate", $validated))
        $data = $data->where('created_at', '<', (new Carbon($validated["endDate"]))->addDay());

    if (!array_key_exists("dataPointInterval", $validated) || $validated["dataPointInterval"] == 10)
        $data = $data->where('created_at', 'like', '____-__-__ __:_0:__');
    else if (array_key_exists("endDate", $validated) && $validated["dataPointInterval"] == 60)
        $data = $data->where('created_at', 'like', '____-__-__ __:00:__');

    return Inertia::render('Logs')->with('dataLogs', $data->get());
})->name('logs');

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
