<script setup>
import { toRefs, computed } from 'vue'
 
const props = defineProps({
    name: {}
})

const { name } = toRefs(props)

const firstLetter = computed(() => name.value ? name.value[0] : 'X')
</script>

<template>
    <div>
        <div class="avatar placeholder">
            <div class="bg-neutral-focus text-neutral-content rounded-full w-10">
                <span class="text-3xl">{{ firstLetter }}</span>
            </div>
        </div>
        <!-- <p>{{ name }}</p> -->
    </div>
</template>
