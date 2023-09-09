<script setup lang="ts">
import { PropType } from 'vue';
import { KnowledgeBaseArticle } from '../../types/api';

defineProps({
    docs: Object as PropType<KnowledgeBaseArticle[]>
})

</script>

<template>
    <div class="overflow-x-auto">
        <table class="table">
            <!-- head -->
            <thead>
                <tr>
                    <th></th>
                    <th>Проблема</th>
                    <th>Причина</th>
                    <th>Решение</th>
                </tr>
            </thead>
            <tbody>
                <!-- row 1 -->
                <tr v-for="(item, idx) in docs" :class="{ 'hover': idx % 2 !== 0 }" :id="item.id">
                    <th>
                        <RouterLink :to="`/knowledge-base/${item.id}`" class="underline">{{ idx }}</RouterLink>
                    </th>
                    <td>{{ item.fault }}</td>
                    <td>{{ item.reason }}</td>
                    <td> {{ item.solution }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>