<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScheduleRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',

            'items.*.label' => 'required|string',
            'items.*.start' => 'required|integer',
            'items.*.color' => 'required|string',
            'items.*.vpd' => 'required|numeric',
            'items.*.lightHours' => 'required|integer',

            'items.*.ventFanPowerCurve' => 'required|array',
            'items.*.ventFanPowerCurve.*' => 'required|array',
            'items.*.ventFanPowerCurve.*.*' => 'required|numeric',

            'items.*.ventFanAngleSpeedCurve' => 'required|array',
            'items.*.ventFanAngleSpeedCurve.*' => 'required|array',
            'items.*.ventFanAngleSpeedCurve.*.*' => 'required|numeric',

            'cycle_length' => 'required|integer',
        ]);
        Schedule::updateOrCreate([], $validated);
    }

    public function activate(String $schedule)
    {
        Schedule::where('is_active', true)->update(['is_active' => false]);
        if (Schedule::find($schedule) != null)
            Schedule::find($schedule)->update(['is_active' => true, 'start_date' => now()->startOfDay()]);

        redirect()->back();
    }

    public function skip(Schedule $schedule)
    {
        $validated = request()->validate([
            'days' => 'required|integer',
        ]);

        $schedule->update(['start_date' => $schedule->start_date->subDays((int)$validated['days'])]);

        redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $schedule)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Schedule $schedule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Schedule $schedule)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule)
    {
        //
    }
}
