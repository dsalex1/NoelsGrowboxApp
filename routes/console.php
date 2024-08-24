<?php

use App\Models\DataLog;
use App\Models\Schedule as ModelsSchedule;
use Illuminate\Support\Facades\Schedule;

function calculateVPD($tempCelsius, $relativeHumidity)
{
    // Constants
    $A = -1.0440397e4;
    $B = -11.29465;
    $C = -2.7022355e-2;
    $D = 1.289036e-5;
    $E = -2.4780681e-9;
    $F = 6.5459673;

    // Convert Celsius to Rankine
    $T = ($tempCelsius * 9) / 5 + 491.67;

    // Compute vp_sat
    $vp_sat = exp($A / $T + $B + $C * $T + $D * pow($T, 2) + $E * pow($T, 3) + $F * log($T));
    // Compute VPD in kPa
    return $vp_sat * (1 - $relativeHumidity / 100) * 6.89476;
}



Schedule::call(function () {
    //$actuators = yaml_parse_file(base_path('python/actuators.yml'));
    $sensors = yaml_parse_file(base_path('python/sensors.yml'));

    DataLog::create([
        'type' => 'temperature_SHT35',
        'value' => $sensors['temperature_SHT35'],
        'unit' => '°C'
    ]);
    DataLog::create([
        'type' => 'humidity',
        'value' => $sensors['humidity'],
        'unit' => '%'
    ]);
    DataLog::create([
        'type' => 'temperature_BMP390',
        'value' => $sensors['temperature_BMP390'],
        'unit' => '°C'
    ]);
    DataLog::create([
        'type' => 'pressure',
        'value' => $sensors['pressure'],
        'unit' => 'hPa'
    ]);
    DataLog::create([
        'type' => 'VPD',
        'value' => calculateVPD($sensors['temperature_SHT35'], $sensors['humidity']),
        'unit' => 'kPa'
    ]);



    $activeSchedule = ModelsSchedule::where('is_active', 1)->first();

    $activeItem = collect($activeSchedule->items)->sortBy("start")->reverse()->first(function (array $value) use ($activeSchedule) {
        return $value['start'] <= $activeSchedule->start_date->diffInDays(now());
    });

    $offset = 0;
    $LAMP = (now()->hour >= 0 + $offset && now()->hour < $activeItem['lightHours'] + $offset) ? 'True' : 'False';

    $targetVPD = $activeItem['vpd'];
    $currentVPD = calculateVPD($sensors['temperature_SHT35'], $sensors['humidity']);

    $VENT_POWER = ($targetVPD - 0.6) / 0.8; //replace by actual PID controller or something, if it works at all, actually this x or 1-x possibly

    //$FAN_HALF_CYLE_DURATION = 4;
    //$FAN_POWER = 0.2;
    //$FAN_ANGLE = -1;

    $actuatorsText = file_get_contents(base_path('python/actuators.yml'));
    $actuatorsText = preg_replace('/lamp:.*/', "lamp: $LAMP", $actuatorsText);
    //$actuatorsText = preg_replace('/vent_power:.*/', "vent_power: $VENT_POWER", $actuatorsText);
    //$actuatorsText = preg_replace('/fan_angle:.*/', "fan_half_cycle_duration: $FAN_HALF_CYLE_DURATION", $actuatorsText);
    //$actuatorsText = preg_replace('/fan_angle:.*/', "fan_angle: $FAN_ANGLE", $actuatorsText);
    //$actuatorsText = preg_replace('/fan_power:.*/', "fan_power: $FAN_POWER", $actuatorsText);
    file_put_contents(base_path('python/actuators.yml'), $actuatorsText);
})->everyMinute();