<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { usePermission } from '@vueuse/core'
import { useRecorder } from '../../composables/useRecorder'
import { AudioVisualizer } from '../../utils';

const showVisualization = true
const visualizationOptions = {}
const visualizationType = 'SineWave'

const  { startRecording, toggleStartAndStop, isRecording } = useRecorder({ getAsMp3: onGetMp3 })

const microphoneAccess = usePermission('microphone')

function onGetMp3 (audioObject) {
    const audioUrl = URL.createObjectURL(audioObject.data);
    const audio = new Audio(audioUrl);
    console.log(audio, audioUrl, audioObject); 
    audio.play();
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

</script>

<template>
    <button class="btn btn-outline btn-circle" @click="toggleStartAndStop">
        <img v-if="!isRecording" src="/svg/micro.svg" alt="">
        <img v-else src="/svg/stop.svg" alt="">
    </button>
    <canvas v-if="isRecording" :class="[!isRecording && 'visualization--hidden']" ref="canvas"></canvas>
</template>