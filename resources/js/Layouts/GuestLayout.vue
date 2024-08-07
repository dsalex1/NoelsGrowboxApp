<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
</script>

<template>
    <div style="min-height: 100vh">
        <nav class="d-flex justify-between align-center px-12 ga-6"></nav>

        <div style="height: calc(100vh - 160px)" class="pa-6">
            <slot />
        </div>
    </div>
</template>
