<script setup lang="ts">
import RangeDisplay from '@/Components/RangeDisplay.vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';
import { VNumberInput } from 'vuetify/labs/VNumberInput';

const VPDs = [
    {
        color: '#1A6C9C',
        vpd_range: '<0.4 kPa',
        median_vpd_value: 0.2,
        description: 'Danger Zone (Under Transpiration)',
    },
    {
        color: '#22AB9C',
        vpd_range: '0.4-0.8 kPa',
        median_vpd_value: 0.6,
        description: 'Early Vegetative Growth / Propagation (Low Transpiration)',
    },
    {
        color: '#9CC55B',
        vpd_range: '0.8-1.2 kPa',
        median_vpd_value: 1.0,
        description: 'Late Vegetative / Early Flower (Healthy Transpiration)',
    },
    {
        color: '#E7C12B',
        vpd_range: '1.2-1.6 kPa',
        median_vpd_value: 1.4,
        description: 'Mid / Late Flower (High Transpiration)',
    },
    {
        color: '#CE4234',
        vpd_range: '>1.6 kPa',
        median_vpd_value: 1.8,
        description: 'Danger Zone (Over Transpiration)',
    },
];

const cycleLength = ref(107);

const scheduleItems = ref([
    { label: 'Early Veg.', start: 0, color: '#a000e0', vpd: 0.6, lightHours: 1 },
    { label: 'Veg.', start: 10, color: '#0000b0', vpd: 0.6, lightHours: 2 },
    { label: 'Bloom 1', start: 30, color: '#00b0b0', vpd: 1, lightHours: 12 },
    { label: 'Bloom 2', start: 60, color: '#30b000', vpd: 1.4, lightHours: 12 },
    { label: 'Bloom End', start: 100, color: '#d09000', vpd: 1.4, lightHours: 8 },
    { label: 'End', start: 105, color: '#c02000', vpd: 1, lightHours: 0 },
]);
</script>

<template>
    <Head title="Settings" />

    <AuthenticatedLayout>
        <template #header>Settings</template>

        <v-row>
            <v-col :cols="12">
                <v-text-field v-model="cycleLength" label="Cycle Length (days)" hide-details></v-text-field>
            </v-col>
        </v-row>
        <v-timeline side="end">
            <v-timeline-item :dot-color="scheduleItem.color" size="small" v-for="(scheduleItem, index) of scheduleItems">
                <v-row style="width: 80vw" class="py-2">
                    <v-col cols="12" md="2" class="d-flex align-center">
                        <strong class="me-4">{{ scheduleItem.label }}</strong>
                    </v-col>
                    <v-col cols="12" md="4">
                        <!-- select from the vpd options with colors and values and desctiontion-->
                        <v-select
                            v-model="scheduleItem.vpd"
                            :itemProps="s => ({ title: s.vpd_range, subtitle: s.description, value: s.median_vpd_value })"
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
                        <v-number-input
                            :disabled="index == 0"
                            v-model="scheduleItem.value"
                            label="Start (days)"
                            :min="0"
                            :max="cycleLength"
                        ></v-number-input>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-number-input v-model="scheduleItem.lightHours" label="Light Hours" :min="0" :max="24"></v-number-input>
                    </v-col>
                </v-row>
            </v-timeline-item>
        </v-timeline>

        <v-card>
            <RangeDisplay :model-value="scheduleItems.map(s => ({ ...s, value: s.start }))" :start="0" :end="cycleLength" class="m-5 ps-6" />
        </v-card>
    </AuthenticatedLayout>
</template>
