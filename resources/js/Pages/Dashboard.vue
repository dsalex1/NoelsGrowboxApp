<script setup lang="ts">
import RangeDisplay from '@/Components/RangeDisplay.vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { DateTime } from 'luxon';
import { VNumberInput } from 'vuetify/labs/VNumberInput';
import { computed, ref } from 'vue';
import { Schedule, VPDs } from '@/types/types';
import { useStorage } from '@vueuse/core';

const props = defineProps<{
    schedules: Schedule[];
    activeSchedule: Schedule | null;
    sensors: {
        temperature_SHT35: number;
        humidity: number;
        temperature_BMP390: number;
        pressure: number;
    };
    actuators: {
        lamp: boolean;
        fan_angle: number;
        fan_power: number;
        vent_power: number;
        fan_half_cycle_duration: number;
    };
    now: string;
}>();

//partial reload sensors actuators and now every 5 seconds, and make sure every only one is active
const interval = useStorage('interval', 0);
clearInterval(interval.value);
interval.value = setInterval(() => {
    router.reload({ only: ['actuators', 'sensors', 'now'] });
}, 5000);

const selectedSchedule = ref<number | null>(props.activeSchedule?.id || null);

const currentDay = computed(() =>
    props.activeSchedule?.start_date
        ? Math.floor(DateTime.fromISO(props.now).diff(DateTime.fromISO(props.activeSchedule.start_date), 'days').days)
        : null
);

const currentPhase = computed(() =>
    props.activeSchedule?.items
        ?.toSorted((a, b) => a.start - b.start)
        .reverse()
        .find(p => p.start <= (currentDay.value || 0))
);

const nextPhase = computed(() => props.activeSchedule?.items?.toSorted((a, b) => a.start - b.start).find(p => p.start > (currentDay.value || 0)));

const daysLeftInPhase = computed(() =>
    nextPhase.value?.start ? nextPhase.value.start - currentDay.value! : props.activeSchedule?.cycle_length! - currentDay.value!
);

const skipDays = ref(0);

const currentVPD = computed(() => VPDs.find(v => v.median_vpd_value == currentPhase.value!.vpd));

function calculateVPD(tempCelsius: number, relativeHumidity: number) {
    // Constants
    const A = -1.0440397e4;
    const B = -11.29465;
    const C = -2.7022355e-2;
    const D = 1.289036e-5;
    const E = -2.4780681e-9;
    const F = 6.5459673;

    // Convert Celsius to Rankine
    const T = (tempCelsius * 9) / 5 + 491.67;

    // Compute vp_sat
    const vp_sat = Math.exp(A / T + B + C * T + D * Math.pow(T, 2) + E * Math.pow(T, 3) + F * Math.log(T));
    // Compute VPD in kPa
    return vp_sat * (1 - relativeHumidity / 100) * 6.89476;
}
</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <template #header>Dashboard</template>

        <v-card title="Set  Schedule">
            <v-row class="p-4">
                <!-- select schedule-->
                <v-col cols="12" md="6">
                    <v-select
                        v-model="selectedSchedule"
                        :items="[{ id: null }, ...schedules]"
                        :item-props="
                            item => ({
                                title: item.id ? '#' + item.id : '',
                                value: item.id,
                            })
                        "
                        hide-details
                        label="Select Schedule"
                    />
                </v-col>

                <v-col cols="12" md="6" class="d-flex align-center">
                    <v-btn color="primary" @click="router.post(route('schedules.activate', { schedule: selectedSchedule || '0' }))">
                        Start Schedule
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>

        <v-card title="Current Schedule" class="mt-2">
            <v-alert v-if="!activeSchedule" type="info" variant="tonal" class="mb-2" dismissible>No active schedule</v-alert>
            <template v-else>
                <v-row class="px-6">
                    <v-col cols="12" md="6">
                        <v-number-input v-model="skipDays" label="Skip Days" hide-details hint="may be negative">
                            <template #append>
                                <v-btn color="primary" @click="router.post(route('schedules.skip', { schedule: activeSchedule.id, days: skipDays }))">
                                    Skip days
                                </v-btn>
                            </template>
                        </v-number-input>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center justify-center">
                        <v-btn
                            color="primary"
                            :disabled="!nextPhase"
                            @click="
                                router.post(
                                    route('schedules.skip', {
                                        schedule: activeSchedule.id,
                                    }),
                                    {
                                        days: daysLeftInPhase,
                                    }
                                )
                            "
                        >
                            Skip to next phase
                        </v-btn>
                    </v-col>
                </v-row>
                <RangeDisplay
                    :model-value="activeSchedule.items.map(s => ({ ...s, value: s.start }))"
                    :start="0"
                    :end="activeSchedule.cycle_length"
                    :current="currentDay!"
                    class="m-5 ps-6 pt-9"
                />

                <v-row class="pt-8 p-5">
                    <v-col cols="12" md="4">
                        <v-card
                            class="h-100"
                            prepend-icon="mdi-list-status"
                            title="Phase"
                            variant="tonal"
                            style="border: 1px solid"
                            :color="currentPhase!.color"
                        >
                            <v-card-text>
                                <div>
                                    <strong style="font-size: 1.75rem">
                                        {{ currentPhase!.label }}
                                    </strong>
                                </div>
                                {{ daysLeftInPhase }} {{ daysLeftInPhase > 1 ? 'days' : 'day' }} left
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card
                            class="h-100"
                            prepend-icon="mdi-gauge"
                            title="Target VPD"
                            variant="tonal"
                            style="border: 1px solid"
                            :color="currentVPD?.color"
                        >
                            <v-card-text>
                                <div>
                                    <strong style="font-size: 1.75rem">{{ currentVPD?.vpd_range }}</strong>
                                </div>
                                {{ currentVPD?.description }}
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card
                            class="h-100"
                            prepend-icon="mdi-lightbulb-on"
                            title="Target Light Hours"
                            variant="text"
                            style="border: 1px solid; background-color: #ffd"
                            color="orange"
                        >
                            <v-card-text>
                                <strong style="font-size: 1.75rem">{{ currentPhase?.lightHours }} Hours</strong>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </v-card>

        <v-card title="Current Values" class="mt-2">
            <v-row class="pt-2 p-5">
                <v-col cols="12" md="4">
                    <v-card class="h-100" prepend-icon="mdi-thermometer" title="Temperature" variant="tonal" style="border: 1px solid" color="red">
                        <v-card-text>
                            <strong style="font-size: 1.75rem">
                                <div>SHT35: {{ Math.round(sensors.temperature_SHT35 * 10) / 10 }}°C</div>
                                <div>BMP390: {{ Math.round(sensors.temperature_BMP390 * 10) / 10 }}°C</div>
                            </strong>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card class="h-100" prepend-icon="mdi-waves" title="Current VPD" variant="tonal" style="border: 1px solid" color="purple">
                        <v-card-text>
                            <strong style="font-size: 1.75rem">
                                <div>{{ Math.round(calculateVPD(sensors.temperature_SHT35, sensors.humidity) * 100) / 100 }} kPa</div>
                            </strong>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card
                        class="h-100"
                        prepend-icon="mdi-water"
                        title="Rel. Humidity & Pressure"
                        variant="tonal"
                        style="border: 1px solid"
                        color="green"
                    >
                        <v-card-text>
                            <strong style="font-size: 1.75rem">
                                <div>{{ Math.round(sensors.humidity * 10) / 10 }}%</div>
                                <div>at {{ Math.round(sensors.pressure * 10) / 10 }} hPa</div>
                            </strong>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card class="h-100" prepend-icon="mdi-fan" title="Ventilation" variant="tonal" style="border: 1px solid" color="orange">
                        <v-card-text>
                            <strong style="font-size: 1.75rem">
                                <div>Power: {{ Math.round(actuators.vent_power * 100) }}%</div>
                            </strong>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card class="h-100" prepend-icon="mdi-fan" title="Fan" variant="tonal" style="border: 1px solid" color="blue">
                        <v-card-text>
                            <strong style="font-size: 1.75rem">
                                <div v-if="actuators.fan_angle != -1">Angle: {{ Math.round((actuators.fan_angle - 0.5) * 45) }}°</div>
                                <div v-else>Halfcycle: {{ Math.round(actuators.fan_half_cycle_duration * 10) / 10 }}s</div>
                                <div>Power: {{ Math.round(actuators.fan_power * 100) }}%</div>
                            </strong>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card
                        class="h-100"
                        prepend-icon="mdi-lightbulb"
                        title="Lamp"
                        variant="text"
                        style="border: 1px solid"
                        :style="{ backgroundColor: actuators.lamp ? '#ffd' : '#f5f5f5' }"
                        :color="actuators.lamp ? 'orange' : '#666'"
                    >
                        <v-card-text>
                            <strong style="font-size: 1.75rem">
                                <div>Lamp: {{ actuators.lamp ? 'On' : 'Off' }}</div>
                            </strong>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </AuthenticatedLayout>
</template>
