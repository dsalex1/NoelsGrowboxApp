<script setup lang="ts">
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <template #header>Dashboard</template>

        <v-card>
            <v-skeleton-loader boilerplate type="table-heading, list-item-two-line, image, table-tfoot"></v-skeleton-loader>
        </v-card>
    </AuthenticatedLayout>
</template>
