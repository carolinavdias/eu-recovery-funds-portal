<template>
  <header class="navbar">

    <!-- logo -->
    <div class="navbar-logo">
      <RouterLink to="/">
        <span class="logo-text">RR <span class="logo-accent">Scoreboard</span></span>
      </RouterLink>
    </div>

    <!-- dropdown de país -->
    <div class="navbar-center">
      <select class="pais-select" v-model="paisAtual" @change="appStore.setPais(paisAtual)">
        <option v-for="pais in appStore.paises" :key="pais.code" :value="pais.code">
          {{ pais.nome }}
        </option>
      </select>
    </div>

    <!-- ações -->
    <div class="navbar-actions">

      <!-- toggle dark mode -->
      <button class="btn-icon" @click="appStore.toggleDarkMode" :title="appStore.darkMode ? 'Modo claro' : 'Modo escuro'">
        {{ appStore.darkMode ? '☀️' : '🌙' }}
      </button>

      <!-- toggle idioma -->
      <button class="btn-icon" @click="toggleIdioma" :title="'Idioma: ' + appStore.idioma.toUpperCase()">
        {{ appStore.idioma === 'pt' ? '🇵🇹' : '🇬🇧' }}
      </button>

      <!-- botão entrar -->
      <RouterLink to="/login" class="btn-entrar">Entrar</RouterLink>

    </div>

  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const paisAtual = ref(appStore.paisSelecionado)

function toggleIdioma() {
  appStore.idioma = appStore.idioma === 'pt' ? 'en' : 'pt'
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 64px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.dark-mode .navbar {
  background-color: #16213e;
  border-bottom: 1px solid #333;
}

.navbar-logo a {
  text-decoration: none;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a2e;
}

.logo-accent {
  color: #2E75B6;
}

.pais-select {
  padding: 0.4rem 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 0.9rem;
  cursor: pointer;
  background: #f8f9fa;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: #f0f0f0;
}

.btn-entrar {
  padding: 0.4rem 1rem;
  background-color: #2E75B6;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-entrar:hover {
  background-color: #1F4E79;
}
</style>