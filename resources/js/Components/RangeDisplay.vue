<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { toRefs } from 'vue';

const props = defineProps<{ start: number; end: number; current?: number }>();
const { start, end } = toRefs(props);

const values = defineModel<{ value: number; label: string; color: string }[]>();

const calculatePosition = (value: number) => {
    const range = end.value - start.value;
    const position = ((value - start.value) / range) * 100;
    return `${position}%`;
};
</script>

<template>
    <div class="d-flex align-center">
        <div v-if="values?.every(v => v.value != start)">{{ start }}</div>
        <div class="mx-2 flex-1" style="position: relative; height: 40px">
            <!-- base line -->
            <div
                style="position: absolute; top: 50%; width: 100%; border: 2px solid lightgrey; border-radius: 2px; transform: translate(0, -50%)"
            ></div>
            <!-- ticks -->
            <div
                v-for="i in Math.floor((end - start - 1) / 10)"
                :key="i"
                style="width: 1px; height: 4px; background-color: #666; position: absolute; top: 50%; transform: translate(-50%, -50%)"
                :style="{ left: calculatePosition(start + i * 10) }"
            ></div>
            <!-- values -->
            <div
                v-for="{ label, value, color } in values"
                :key="label"
                style="width: 10px; height: 10px; border-radius: 50%; position: absolute; top: 50%; transform: translate(-50%, -50%)"
                :style="{ left: calculatePosition(value), backgroundColor: color, color }"
            >
                <span style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%)">{{ value }}</span>
                <span style="position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); white-space: pre">{{ label }}</span>
            </div>
            <!-- current -->
            <div
                v-if="current !== undefined"
                style="width: 4px; height: 12px; background-color: blue; position: absolute; top: 50%; transform: translate(-50%, -50%)"
                :style="{ left: calculatePosition(current) }"
            >
                <span style="position: absolute; top: -20px; color: blue; left: 50%; transform: translateX(-50%)">{{ current }}</span>
            </div>
        </div>

        <div v-if="values?.every(v => v.value != end)">{{ end }}</div>
    </div>
</template>
