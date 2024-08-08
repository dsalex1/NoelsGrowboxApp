<script setup lang="ts">
import RangeDisplay from '@/Components/RangeDisplay.vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { DateTime } from 'luxon';
import { VNumberInput } from 'vuetify/labs/VNumberInput';
import { computed, ref } from 'vue';
import { Schedule, VPDs } from '@/types/types';

const props = defineProps<{
    schedules: Schedule[];
    activeSchedule: Schedule | null;
}>();

const selectedSchedule = ref<number | null>(props.activeSchedule?.id || null);

const currentDay = computed(() =>
    props.activeSchedule?.start_date ? Math.floor(DateTime.now().diff(DateTime.fromISO(props.activeSchedule.start_date), 'days').days) : null
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
                                    <strong style="font-size: 2rem">
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
                            prepend-icon="mdi-waves"
                            title="Target VPD"
                            variant="tonal"
                            style="border: 1px solid"
                            :color="currentVPD?.color"
                        >
                            <v-card-text>
                                <div>
                                    <strong style="font-size: 2rem">{{ currentVPD?.vpd_range }}</strong>
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
                                <strong style="font-size: 2rem">{{ currentPhase?.lightHours }} Hours</strong>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </v-card>
    </AuthenticatedLayout>
</template>
