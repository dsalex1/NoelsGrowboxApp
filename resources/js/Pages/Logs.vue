<script setup lang="ts">
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
</script>

<template>
    <Head title="Logs" />

    <AuthenticatedLayout>
        <template #header>Logs</template>

        <v-card>
            <v-card-body>
                <v-row>
                    <v-col cols="6" v-for="i in 4">
                        <v-skeleton-loader class="pa-2 ma-2" boilerplate type="list-item-two-line, image, image"></v-skeleton-loader>
                    </v-col>
                </v-row>
            </v-card-body>
        </v-card>
    </AuthenticatedLayout>
</template>
