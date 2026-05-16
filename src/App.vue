<template>
  <SplashScreen v-if="splash" @done="splash = false" />
  <RouterView v-else />
</template>

<script setup>
import { ref } from 'vue'
import SplashScreen from './components/SplashScreen.vue'

const splash = ref(true)
</script>