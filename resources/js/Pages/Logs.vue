<script lang="ts">
declare global {
    interface Array<T> {
        groupBy<K extends string>(f: (item: T) => K): { key: K; items: Array<T> }[];
    }
}
Array.prototype.groupBy = function <K extends string>(f: (item: any) => K) {
    return Object.entries(
        this.reduce(function (rv, x) {
            (rv[f(x)] = rv[f(x)] || []).push(x);
            return rv;
        }, {})
    ).map(([key, value]) => ({ key: key as K, items: value as any[] }));
};
</script>

<script setup lang="ts">
import { VDateInput } from 'vuetify/labs/VDateInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, router } from '@inertiajs/vue3';

import { computed, nextTick, ref, toRefs, watch } from 'vue';
import VChart from 'vue-echarts';
import * as echarts from 'echarts';

import { DataLog } from '@/types/types';
import { useStorage } from '@vueuse/core';

//clear the partial reload interval from dashboard
const interval = useStorage('interval', 0);
clearInterval(interval.value);

// this is neccessary becaues vite wouldnt import echarts otherwise if its unused
window.echarts = echarts;

const props = defineProps<{
    dataLogs: DataLog[];
}>();

const dataPointInterval = ref(10);
const endDate = ref(null);
const numberOfDataPoints = ref(1000);

watch([dataPointInterval, endDate, numberOfDataPoints], () => {
    router.reload({
        data: {
            dataPointInterval: dataPointInterval.value,
            endDate: endDate.value,
            numberOfDataPoints: numberOfDataPoints.value,
        },
    });
});

const { dataLogs } = toRefs(props);

const availableDataSeries = [
    {
        name: 'temperature_SHT35',
        unit: 'C°',
        color: 'rgb(255, 0,0)',
    },
    {
        name: 'temperature_BMP390',
        unit: 'C°',
        color: 'rgb(210, 100, 0)',
    },
    {
        name: 'humidity',
        unit: '%',
        color: 'rgb(0,127,0)',
    },
    {
        name: 'pressure',
        unit: 'hPa',
        color: 'rgb(0,180,140)',
    },
    {
        name: 'VPD',
        unit: 'KPa',
        color: 'rgb(255, 0, 255)',
    },
];

const groupedData = computed(() =>
    dataLogs.value.sort((a, b) => (a.created_at > b.created_at ? 1 : -1)).groupBy(item => item.created_at.substring(0, 16))
);

const dataSeriesStatus = ref(availableDataSeries.map(s => ({ ...s, checked: true })));

const dataSeries = computed(() => dataSeriesStatus.value.filter(s => s.checked));

function roundSigDigits(value: number, significant: number, type: 'ceil' | 'floor' | 'round' = 'round', indicator = value) {
    const exponent = Math.floor(Math.log10(indicator));
    const factor = 10 ** (exponent - significant + 1);
    return (Math[type](value / factor) * factor).toFixed(5);
}

const firstRender = ref(true);
nextTick(() => {
    firstRender.value = false;
});

const chartOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
        position: function (pt: number[]) {
            return [pt[0], '10%'];
        },
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none',
            },
            restore: {},
            saveAsImage: {},
        },
    },
    ...(firstRender.value
        ? {
              dataZoom: [
                  {
                      type: 'inside',
                      start: 90,
                      end: 100,
                  },
                  {
                      type: 'slider',
                  },
              ],
          }
        : {}),
    xAxis: {
        type: 'time',
        boundaryGap: false,
    },
    yAxis:
        dataSeries.value.length > 0
            ? dataSeries.value
                  .map(s => s.name)
                  .map(s => s.split('_')[0])
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((type, index) => ({
                      type: 'value',
                      boundaryGap: [0, '100%'],
                      name: `${type.slice(0, 4)}${type.length > 4 ? '.' : ''} (${
                          { temperature: '°C', humidity: '%', pressure: 'hPa', VPD: 'kPa' }[type]
                      })`,
                      position: index % 2 == 0 ? 'left' : 'right',
                      offset: Math.floor(index / 2) * 63,
                      min: ({ min, max }: { min: number; max: number }) => roundSigDigits(min + (min - max) * 0.05, 2, 'floor', max - min),
                      max: ({ min, max }: { min: number; max: number }) => roundSigDigits(max - (min - max) * 0.05, 2, 'ceil', max - min),
                  }))
            : {
                  type: 'value',
                  boundaryGap: [0, '100%'],
                  name: `None Selected`,
              },
    series: dataSeries.value.map((series, index) => ({
        id: series.name,
        name: series.name,
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
            color: series.color,
        },
        yAxisIndex: dataSeries.value
            .map(s => s.name)
            .map(s => s.split('_')[0])
            .filter((value, index, self) => self.indexOf(value) === index)
            .findIndex(value => value === series.name.split('_')[0]),
        data: groupedData.value.map(group => {
            const item = group.items.find(item => item.type === series.name);
            return [new Date(group.key + ':00').getTime(), item ? item.value : null];
        }),
    })),
}));
</script>

<template>
    <Head title="Logs" />

    <AuthenticatedLayout>
        <template #header>Logs</template>

        <v-card>
            <v-card-title>Settings</v-card-title>
            <v-card-text>
                <!-- data point time interval, end date, number of datapoints-->
                <v-row>
                    <v-col cols="12" md="4">
                        <v-select
                            v-model="dataPointInterval"
                            :items="[
                                { title: '1 Minute', value: 1 },
                                { title: '10 Minutes', value: 10 },
                                { title: '1 Hour', value: 60 },
                            ]"
                            label="Interval between Data Points"
                            outlined
                        ></v-select>
                    </v-col>
                    <v-col cols="12" md="4" class="dateInput">
                        <v-date-input v-model="endDate" label="End Date"></v-date-input>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-select v-model="numberOfDataPoints" :items="[1000, 5000, 10000]" label="Number of Data Points" outlined></v-select>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-title>Series</v-card-title>
            <v-card-text>
                <div class="d-flex flex-wrap gap-3">
                    <v-checkbox
                        v-for="series in dataSeriesStatus"
                        :key="series.name"
                        v-model="series.checked"
                        :label="`${series.name} (${series.unit})`"
                        :color="series.color"
                    />
                </div>
            </v-card-text>
            <v-chart :option="chartOptions" :update-options="{ notMerge: false, replaceMerge: ['series', 'yAxis'] }" style="height: 600px"></v-chart>
        </v-card>
    </AuthenticatedLayout>
</template>

<style>
.dateInput input {
    height: 28px;
}
</style>
