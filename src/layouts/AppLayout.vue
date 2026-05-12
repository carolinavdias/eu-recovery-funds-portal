<template>
  <div class="app-wrapper">

    <AppNavbar />

    <div class="app-body">
      <AppSidebar v-model:collapsed="sidebarCollapsed" />

      <main class="app-content" :class="{ collapsed: sidebarCollapsed }">
        <RouterView />
      </main>
    </div>

    <AppFooter />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'

const appStore = useAppStore()
const sidebarCollapsed = ref(false)
</script>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-body {
  display: flex;
  flex: 1;
}

.app-content {
  flex: 1;
  padding: 2rem;
  background-color: #f8f9fa;
  margin-left: 220px;
  transition: margin-left 0.25s ease, background-color 0.3s ease;
}

.app-content.collapsed {
  margin-left: 56px;
}
</style>