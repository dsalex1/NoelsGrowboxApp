<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { computed, toRefs } from 'vue';
import { ref, reactive, onMounted } from 'vue';
import * as echarts from 'echarts';
import VChart from 'vue-echarts';
import { ECBasicOption } from 'echarts/types/dist/shared';

const props = defineProps<{
    title: string;
}>();

// this is neccessary becaues vite wouldnt import echarts otherwise if its unused
window.echarts = echarts;

const initialData = defineModel<[number, number][]>({
    default: [],
});

const chartRef = ref();
const draggingPointIndex = ref<number | null>(null);

const hoursToString = (hours: number) => `${Math.floor(hours)}:${String(Math.round((hours % 1) * 60)).padStart(2, '0')}`;

const chartOptions = computed(() => ({
    xAxis: {
        type: 'value',
        min: 0,
        max: 24,
        splitNumber: 12,
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 100,
    },
    series: [
        {
            type: 'line',
            data: (initialData.value || []).map(([x, y]) => ({ name: x + '|' + y, value: [x, y] })),
            smooth: false,
            symbolSize: 12,
            lineStyle: {
                color: '#42A5F5',
                width: 2,
            },
            itemStyle: {
                color: '#42A5F5',
            },
        },
    ],
    tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
            const point = params[0];
            return `Time: ${hoursToString(point.data.value[0])}<br/>Power: ${point.data.value[1]}%`;
        },
    },
}));

let mouseDownCoordinates = [0, 0];
const onMouseDown = (event: MouseEvent) => {
    mouseDownCoordinates = [event.offsetX, event.offsetY];
    const chart = chartRef.value;
    const pointInGrid = chart.convertFromPixel({ seriesIndex: 0 }, [event.offsetX, event.offsetY]);
    const closestPointIndex = findClosestPointIndex(pointInGrid);

    if (closestPointIndex !== null) {
        draggingPointIndex.value = closestPointIndex;
    }
};

const onMouseUp = (event: MouseEvent) => {
    draggingPointIndex.value = null;
    const distance = Math.hypot(mouseDownCoordinates[0] - event.offsetX, mouseDownCoordinates[1] - event.offsetY);

    if (distance < 5) {
        if (event.button === 0) {
            const chart = chartRef.value;
            let pointInGrid = chart.convertFromPixel({ seriesIndex: 0 }, [event.offsetX, event.offsetY]);
            const closestPointIndex = findClosestPointIndex(pointInGrid);
            if (closestPointIndex === null) {
                const previousPointIndex = initialData.value.findIndex(([x]) => x > pointInGrid[0]);
                initialData.value = [
                    ...initialData.value.slice(0, previousPointIndex),
                    clampPoint(null, pointInGrid),
                    ...initialData.value.slice(previousPointIndex),
                ];
            }
        } else if (event.button === 2) {
            const chart = chartRef.value;
            const pointInGrid = chart.convertFromPixel({ seriesIndex: 0 }, [event.offsetX, event.offsetY]);
            const closestPointIndex = findClosestPointIndex(pointInGrid);
            if (closestPointIndex !== null && closestPointIndex !== 0 && closestPointIndex !== initialData.value.length - 1) {
                initialData.value = initialData.value.filter((_, index) => index !== closestPointIndex);
            }
        }
    }
};

const onMouseMove = (event: MouseEvent) => {
    if (draggingPointIndex.value !== null) {
        const chart = chartRef.value;
        const pointInGrid = chart.convertFromPixel({ seriesIndex: 0 }, [event.offsetX, event.offsetY]);

        initialData.value[draggingPointIndex.value] = clampPoint(draggingPointIndex.value, pointInGrid);
    }
};

function clampPoint(index: number | null, pointInGrid: [number, number]) {
    let xMin = 0;
    let xMax = 24;
    let yMin = 0;
    let yMax = 100;

    if (index == 0) xMax = 0;
    else if (index == initialData.value.length - 1) xMin = 24;
    else if (index !== null) {
        xMin = initialData.value[index - 1][0];
        xMax = initialData.value[index + 1][0];
    }

    return [
        Math.min(Math.max(xMin, Math.round(pointInGrid[0])), xMax), //
        Math.min(Math.max(yMin, Math.round(pointInGrid[1] / 5) * 5), yMax),
    ] as [number, number];
}

const findClosestPointIndex = (pointInGrid: [number, number]): number | null => {
    let closestIndex: number | null = null;
    let minDistance = Infinity;

    initialData.value.forEach(([x, y], index) => {
        const distance = Math.hypot((x - pointInGrid[0]) * 4, y - pointInGrid[1]);
        if (distance < 10 && distance < minDistance) {
            // Adjust distance threshold as needed
            minDistance = distance;
            closestIndex = index;
        }
    });

    return closestIndex;
};
</script>

<template>
    <v-card>
        <v-card-title>
            <div title="Drag the points to edit the curve, left click to add points, right click to remove points.">{{ title }}</div>
        </v-card-title>
        <v-card-text>
            <div @mousedown.prevent="onMouseDown" @mouseup.prevent="onMouseUp" @mousemove.prevent="onMouseMove" @contextmenu.prevent>
                <v-chart ref="chartRef" :option="chartOptions" style="height: 250px; margin-top: -50px; margin-bottom: -50px"></v-chart>
            </div>
        </v-card-text>
    </v-card>
</template>
