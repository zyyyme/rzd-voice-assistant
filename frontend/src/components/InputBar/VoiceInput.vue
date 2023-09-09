<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { usePermission } from '@vueuse/core'
import { useRecorder } from '../../composables/useRecorder'
import { AudioVisualizer } from '../../utils';
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { speech2text } from '../../services/api/voice'

const emits = defineEmits(['close', 'submit'])

const showVisualization = true
const visualizationOptions = { backgroundColor: 'rgb(243, 244, 246)' }
const visualizationType = 'SineWave'

const  { startRecording, toggleStartAndStop, isRecording } = useRecorder({ getFullAudio: onGetMp3 })

const microphoneAccess = usePermission('microphone')

async function onGetMp3 (audioObject) {
    console.log('onGetMp3', audioObject);
    emits('submit', audioObject)
}

const canvas = ref()

watch(isRecording, async (value) => {
    if (value) {
        await nextTick()
        AudioVisualizer.visualize(visualizationType, {
        canvas: canvas.value,
        ...visualizationOptions
        })
    }
})

const hasOverlay = true

onMounted(() => {
    startRecording()
})
</script>

<template>
    <div :class="{ 'absolute h-full w-full bg-gray-100 bg-opacity-95 top-0 left-0': hasOverlay}" class="flex flex-col items-center justify-center">
        <button @click="() => emits('close')" v-if="hasOverlay" class="absolute top-10 right-10">
            <XMarkIcon class="h-6 w-6" />
        </button>
        <button class="btn btn-outline btn-circle w-40 h-40" @click="toggleStartAndStop">
            <img v-if="!isRecording" src="/svg/micro.svg" alt="">
            <img v-else src="/svg/stop.svg" alt="">
        </button>
        <canvas v-if="isRecording" :class="[!isRecording && 'visualization--hidden']" ref="canvas"></canvas>
        <p>Транскрипция</p>
    </div>
</template>