<script setup lang="ts">
import RangeDisplay from '@/Components/RangeDisplay.vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Schedule, VPDs } from '@/types/types';
import { Head, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { VNumberInput } from 'vuetify/labs/VNumberInput';

const props = defineProps<{
    schedule?: Schedule;
}>();

const form = useForm({
    cycleLength: props.schedule?.cycle_length || 107,
    items: props.schedule?.items || [
        { label: 'Early Veg.', start: 0, color: '#a000e0', vpd: 0.6, lightHours: 1 },
        { label: 'Veg.', start: 10, color: '#0000b0', vpd: 0.6, lightHours: 2 },
        { label: 'Bloom 1', start: 30, color: '#00b0b0', vpd: 1, lightHours: 12 },
        { label: 'Bloom 2', start: 60, color: '#30b000', vpd: 1.4, lightHours: 12 },
        { label: 'Bloom End', start: 100, color: '#d09000', vpd: 1.4, lightHours: 8 },
        { label: 'End', start: 105, color: '#c02000', vpd: 1, lightHours: 0 },
    ],
});

function saveSchedule() {
    form.transform(data => ({
        cycle_length: data.cycleLength,
        items: data.items,
    })).post(route('schedules.store'));
}
</script>

<template>
    <Head title="Settings" />

    <AuthenticatedLayout>
        <template #header>Settings</template>

        <!-- success mesg if form is recently success-->
        <v-alert v-if="form.recentlySuccessful" type="success" variant="tonal" class="mb-2" dismissible>Schedule Saved</v-alert>
        <v-row>
            <v-col :cols="12">
                <v-number-input v-model="form.cycleLength" label="Cycle Length (days)" :min="0" hide-details></v-number-input>
            </v-col>
        </v-row>
        <v-timeline side="end">
            <v-timeline-item :dot-color="scheduleItem.color" size="small" v-for="(scheduleItem, index) of form.items">
                <v-row style="justify-self: stretch" class="py-2 me-5">
                    <v-col cols="12" md="2" class="d-flex align-center">
                        <strong class="me-4">{{ scheduleItem.label }}</strong>
                    </v-col>
                    <v-col cols="12" md="4">
                        <!-- select from the vpd options with colors and values and desctiontion-->
                        <v-select
                            v-model="scheduleItem.vpd"
                            :itemProps="s => ({ title: s.vpd_range, subtitle: s.description, value: '' + s.median_vpd_value })"
                            :items="VPDs"
                            label="VPD"
                            hide-details
                        >
                            <template #item="{ item, props }">
                                <v-list-item v-bind="props">
                                    <template #prepend>
                                        <v-icon :color="item.raw.color">mdi-circle</v-icon>
                                    </template>
                                </v-list-item>
                            </template>
                            <template #selection="{ item }">
                                <v-icon :color="item.raw.color" class="me-2">mdi-circle</v-icon>
                                {{ item.raw.vpd_range }}
                            </template>
                        </v-select>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-number-input :disabled="index == 0" v-model="scheduleItem.start" label="Start (days)" :min="0"></v-number-input>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-number-input v-model="scheduleItem.lightHours" label="Light Hours" :min="0" :max="24"></v-number-input>
                    </v-col>
                </v-row>
            </v-timeline-item>
        </v-timeline>

        <v-card>
            <RangeDisplay :model-value="form.items.map(s => ({ ...s, value: s.start }))" :start="0" :end="form.cycleLength" class="m-5 ps-6" />
        </v-card>

        <div class="d-flex justify-end">
            <v-btn :loading="form.processing" color="primary" class="mt-4" @click="saveSchedule">Save</v-btn>
        </div>
    </AuthenticatedLayout>
</template>
