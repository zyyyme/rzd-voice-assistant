<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getKnowledgeBase, getTrainSeriesList, getKnowledgeArticle } from '../services/api/knowledge-base'
import { KnowledgeBaseArticle } from '../types/api';
import KnowledgeBaseTable from '../components/knowledgeBase/KnowledgeBaseTable.vue'

const props = defineProps({
    id: String
})

let isArticlePage = ref(false)

const isDataLoading = ref<boolean>(false)
const selectedTrainSeries = ref('')
const articles = ref<KnowledgeBaseArticle[]>([])
const article = ref<KnowledgeBaseArticle>()
const trainSeriesOptions = getTrainSeriesList()

async function loadData(trainSeries: string) {
    isDataLoading.value = true
    const response = await getKnowledgeBase(trainSeries)
    articles.value = response.docs
    isDataLoading.value = false
}

async function loadArticle(id: string) {
    isDataLoading.value = true
    const response = await getKnowledgeArticle(id)
    article.value = response
    isDataLoading.value = false
    return response
}

function onSeriesSelected(value: any) {
    isArticlePage.value = false
    selectedTrainSeries.value = trainSeriesOptions[0]
    loadData(selectedTrainSeries.value)
}

onMounted( async () => {
    if (!props.id){
        onSeriesSelected(trainSeriesOptions[0])
    } else {
        isArticlePage.value = true
        const article = await loadArticle(props.id)
        selectedTrainSeries.value = article.series?.[0] ?? ''
    }
})

</script>

<template>
    <main class="container mx-auto">
        <select @input="onSeriesSelected" class="select select-bordered w-full max-w-xs">
            <option disabled selected>Выберете модель локомотива</option>
            <option v-for="(item, idx) in trainSeriesOptions" :selected="selectedTrainSeries === item">{{ item }}</option>
        </select>
        <div class="mt-8">
            <template v-if="isArticlePage">
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
            </template>
            <template v-else-if="selectedTrainSeries">
                <div v-if="isDataLoading" class="flex justify-center items-center my-50">
                    <span class="loading loading-infinity loading-lg"></span>
                </div>
                <KnowledgeBaseTable v-else :docs="articles" />
            </template>
        </div>
    </main>
</template>
