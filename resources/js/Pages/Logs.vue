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
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';

import { computed, ref, toRefs } from 'vue';
import VChart from 'vue-echarts';
import * as echarts from 'echarts';

import { DataLog } from '@/types/types';

// this is neccessary becaues vite wouldnt import echarts otherwise if its unused
window.echarts = echarts;

const props = defineProps<{
    dataLogs: DataLog[];
}>();

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

const groupedData = computed(() => dataLogs.value.groupBy(item => item.created_at.substring(0, 16)));

const dataSeriesStatus = ref(availableDataSeries.map(s => ({ ...s, checked: true })));

const dataSeries = computed(() => dataSeriesStatus.value.filter(s => s.checked));

function roundSigDigits(value: number, significant: number, type: 'ceil' | 'floor' | 'round' = 'round', indicator = value) {
    const exponent = Math.floor(Math.log10(indicator));
    const factor = 10 ** (exponent - significant + 1);
    return (Math[type](value / factor) * factor).toFixed(5);
}

console.log([]);
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
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 10,
        },
        {
            start: 0,
            end: 10,
        },
    ],
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: groupedData.value.map(group => group.key + ':00'),
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
            return item ? item.value : null;
        }),
    })),
}));
</script>

<template>
    <Head title="Logs" />

    <AuthenticatedLayout>
        <template #header>Logs</template>

        <v-card>
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
            <v-chart :option="chartOptions" style="height: 600px"></v-chart>
        </v-card>
    </AuthenticatedLayout>
</template>
