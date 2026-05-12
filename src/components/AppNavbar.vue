<template>
  <header class="navbar">
    <div class="navbar-logo">
      <RouterLink to="/" class="logo-link">
        <span class="icon-logo">🏛️</span>
        <span class="logo-text">PORTAL <span class="logo-accent">PRR</span></span>
      </RouterLink>
    </div>

    <div class="navbar-actions">

      <select
        class="pais-select"
        v-model="paisAtual"
        @change="appStore.setPais(paisAtual)"
        title="Filtrar por país"
        aria-label="Filtrar por país"
      >
        <option v-for="pais in appStore.paises" :key="pais.code" :value="pais.code">
          {{ pais.nome }}
        </option>
      </select>

      <button
        class="btn-icon"
        @click="appStore.toggleDarkMode"
        :title="appStore.darkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'"
        :aria-label="appStore.darkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'"
      >
        {{ appStore.darkMode ? '☀️' : '🌙' }}
      </button>

    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const paisAtual = ref(appStore.paisSelecionado)
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 70px;
  background-color: #931b18;
  border-bottom: 2px solid #d4af37;
  position: sticky;
  top: 0;
  z-index: 100;
  color: white;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  letter-spacing: 1px;
}

.logo-accent {
  color: #d4af37;
}

.icon-logo {
  font-size: 1.5rem;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.pais-select {
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #d4af37;
  font-size: 0.85rem;
  cursor: pointer;
  background: #931b18;
  color: white;
  transition: background 0.2s, border-color 0.2s;
}

.pais-select:hover {
  background: #a82220;
  border-color: #f0c349;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.45rem;
  border-radius: 50%;
  transition: background 0.2s, transform 0.15s;
  color: white;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.08);
}

.btn-icon:active {
  transform: scale(0.93);
}
</style>