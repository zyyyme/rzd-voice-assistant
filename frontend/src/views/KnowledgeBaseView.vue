<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getKnowledgeBase, getTrainSeriesList } from '../services/api/knowledge-base'
import { KnowledgeBaseArticle } from '../types/api';
import KnowledgeBaseTable from '../components/knowledgeBase/KnowledgeBaseTable.vue'
import { useRouter, useRoute } from 'vue-router';

defineProps({
    id: String
})

let isArticlePage = ref(false)

const router = useRouter()
const route = useRoute()

const isDataLoading = ref<boolean>(false)
const selectedTrainSeries = ref('')
const articles = ref<KnowledgeBaseArticle[]>([])
const trainSeriesOptions = getTrainSeriesList()

async function loadData(trainSeries: string) {
    isDataLoading.value = true
    const response = await getKnowledgeBase(trainSeries)
    articles.value = response.docs
    isDataLoading.value = false
}

function onSeriesSelected(value: string) {
    router.push('/knowledge-base?model=' + value)
    isArticlePage.value = false
    selectedTrainSeries.value = value
    loadData(selectedTrainSeries.value)
}

onMounted(() => {
    if (route.query.model) {
        onSeriesSelected(route.query.model as string)
    }
})
</script>

<template>
    <main class="container mx-auto">
        <div class="flex justify-center mt-10">
            <select @input="(e) => onSeriesSelected((e?.target as HTMLSelectElement )?.value)" class="select select-bordered w-full max-w-xs">
                <option disabled selected>Выберете модель локомотива</option>
                <option v-for="(item, idx) in trainSeriesOptions" :selected="selectedTrainSeries === item" id="item">{{ item }}</option>
            </select>
        </div>
        <div class="mt-8">
            <template v-if="selectedTrainSeries">
                <div v-if="isDataLoading" class="flex justify-center items-center my-50">
                    <span class="loading loading-infinity loading-lg"></span>
                </div>
                <KnowledgeBaseTable v-else :docs="articles" />
            </template>
        </div>
    </main>
</template>
