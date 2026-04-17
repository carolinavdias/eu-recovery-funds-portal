<template>
  <div :class="{ 'dark-mode': appStore.darkMode }" class="app-wrapper">

    <!-- navbar topo -->
    <AppNavbar />

    <div class="app-body">

      <!-- sidebar esquerda -->
      <AppSidebar />

      <!-- conteúdo principal — cada página aparece aqui -->
      <main class="app-content">
        <RouterView />
      </main>

    </div>

    <!-- footer -->
    <footer class="app-footer">
      <p>© 2026 EU Recovery and Resilience Scoreboard · IPM 2025/26</p>
    </footer>

  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const appStore = useAppStore()
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
  overflow-y: auto;
}

.dark-mode .app-content {
  background-color: #1a1a2e;
  color: #e0e0e0;
}

.app-footer {
  text-align: center;
  padding: 1rem;
  font-size: 0.8rem;
  color: #888;
  border-top: 1px solid #e0e0e0;
}

.dark-mode .app-footer {
  border-top: 1px solid #333;
}
</style>