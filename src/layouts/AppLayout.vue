<template>
  <div :class="{ 'dark-mode': appStore.darkMode }" class="app-wrapper">

    <!-- navbar topo -->
    <AppNavbar />

    <div class="app-body">

      <!-- sidebar esquerda -->
      <AppSidebar v-model:collapsed="sidebarCollapsed"/>

      <!-- conteúdo principal — cada página aparece aqui -->
      <main class="app-content" :class="{ collapsed: sidebarCollapsed }">
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
import { ref } from 'vue' 
import { useAppStore } from '@/stores/app'
import AppNavbar from '../components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'

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
  overflow-y: auto;
  margin-left: 220px;
  transition: margin-left 0.25s ease;
}

.app-content.collapsed {
  margin-left: 56px;
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

/* garante que o conteúdo não fica por baixo da barra lateral */
.app-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f4f4f4; /* Um cinza claro para o fundo */
}

/* força os títulos a serem vermelhos */
h1, h2 {
  color: #931b18 !important;
  text-transform: uppercase;
}

:deep(.navbar), :deep(.portal-navbar) {
  display: flex !important;
  background-color: #931b18 !important;
  height: 70px !important;
  visibility: visible !important;
  width: 100% !important;
}
</style>

