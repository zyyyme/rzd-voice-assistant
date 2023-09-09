<script setup>
import InputBar from '../components/InputBar/InputBar.vue';
import Chat from '../components/chat/Chat.vue'
</script>

<template>
  <main class="px-3 md:px-0 flex flex-col h-[calc(100vh-64px)]">
    <Chat class="min-h-[90%]"/>
    <div class="py-3">
      <InputBar class="mt-auto"></InputBar>
    </div>
  </main>
</template>
