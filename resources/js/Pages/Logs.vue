<script setup lang="ts">
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
</script>

<template>
    <Head title="Logs" />

    <AuthenticatedLayout>
        <template #header>Logs</template>

        <v-card>
            <div class="p-6 text-gray-900">Hello Logs</div>
        </v-card>
    </AuthenticatedLayout>
</template>
