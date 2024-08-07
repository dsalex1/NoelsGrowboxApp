<script setup lang="ts">
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
</script>

<template>
    <Head title="Settings" />

    <AuthenticatedLayout>
        <template #header>Settings</template>

        <v-card>hello settings</v-card>
    </AuthenticatedLayout>
</template>
