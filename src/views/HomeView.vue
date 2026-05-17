<template>
  <div>
    <h1>{{ appStore.t.nav_dashboard }}</h1>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>