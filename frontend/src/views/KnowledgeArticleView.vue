<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getKnowledgeArticle } from '../services/api/knowledge-base'
import { KnowledgeBaseArticle } from '../types/api';

const props = defineProps({
    id: String
})

const isDataLoading = ref<boolean>(false)
const article = ref<KnowledgeBaseArticle>()


async function loadArticle(id: string) {
    isDataLoading.value = true
    const response = await getKnowledgeArticle(id)
    article.value = response
    isDataLoading.value = false
    return response
}

onMounted(() => {
    if (props.id) {
        loadArticle(props.id)
    }
})

</script>

<template>
    <main class="container mx-auto px-3 lg:px-0">
        <nav> <router-link class="underline" to="/knowledge-base">База знаний</router-link> / {{ id }} </nav>
        <div class="mt-8">
            <div v-if="isDataLoading" class="flex justify-center items-center my-50">
                <span class="loading loading-infinity loading-lg"></span>
            </div>
            <div v-else>
                <h3 class="mt-2 text-lg font-semibold">Проблема</h3>
                <p class="mb-4">{{ article?.fault }}</p>
                <h3 class="mt-2 text-lg font-semibold">Причина</h3>
                <p>{{ article?.reason }}</p>
                <h3 class="mt-2 text-lg font-semibold">Модели</h3>
                <p>{{ article?.series ?? '--' }}</p>
                <h3 class="mt-2 text-lg font-semibold">Решения</h3>
                <p>{{ article?.solution }}</p>
            </div>
        </div>
    </main>
</template>
