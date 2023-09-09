<script setup>
import { RouterView } from 'vue-router'
import Header from './components/app/Header.vue';
</script>

<template>
  <header>
    <Header />
  </header>
  <div class="container mx-auto">
    <RouterView />
  </div> 
</template>

