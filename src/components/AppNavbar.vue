<template>
  <div v-if="showExportModal" class="modal-overlay" @click.self="showExportModal = false">
    <div class="export-card">
      <button class="close-btn" @click="showExportModal = false">✕</button>

      <div class="export-options">
        <button class="export-item">
          <span>Exportar como CSV</span>
          <span class="ext">.csv</span>
        </button>
        <button class="export-item">
          <span>Feed de Dados (JSON)</span>
          <span class="ext">.json</span>
        </button>
        <button class="export-item">
          <span>Sumário em PDF</span>
          <span class="ext">.pdf</span>
        </button>
      </div>
    </div>
  </div>

  <header class="navbar">
    <div class="navbar-logo">
      <RouterLink to="/" class="logo-link">
        <span class="icon-logo">🏛️</span>
        <span class="logo-text">PORTAL <span class="logo-accent">PRR</span></span>
      </RouterLink>
    </div>

    <nav class="nav-links">
      <RouterLink to="/" class="active">VISÃO GERAL</RouterLink>
      <RouterLink to="/marcos">MARCOS E METAS</RouterLink>
      <RouterLink to="/indicadores">INDICADORES COMUNS</RouterLink>
      <RouterLink to="/desembolsos">DESEMBOLSOS</RouterLink>
    </nav>

    <div class="navbar-actions">
      <!-- 🔴 REMOVIDO: botão de exportação da navbar -->

      <select class="pais-select" v-model="paisAtual" @change="appStore.setPais(paisAtual)">
        <option v-for="pais in appStore.paises" :key="pais.code" :value="pais.code">
          {{ pais.nome }}
        </option>
      </select>

      <button class="btn-icon" @click="appStore.toggleDarkMode" :title="appStore.darkMode ? 'Modo claro' : 'Modo escuro'">
        {{ appStore.darkMode ? '☀️' : '🌙' }}
      </button>

      <button class="btn-icon" @click="toggleIdioma" :title="'Idioma: ' + appStore.idioma.toUpperCase()">
        {{ appStore.idioma === 'pt' ? '🇵🇹' : '🇬🇧' }}
      </button>

      <RouterLink to="/login" class="btn-entrar">ENTRAR</RouterLink>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

const showExportModal = ref(false)
const appStore = useAppStore()
const paisAtual = ref(appStore.paisSelecionado)

function toggleIdioma() {
  appStore.idioma = appStore.idioma === 'pt' ? 'en' : 'pt'
}

function openExportModal() {
  showExportModal.value = true
}

defineExpose({ openExportModal })
</script>

<style scoped>
/* NAVBAR */
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

.logo-link { display: flex; align-items: center; gap: 8px; text-decoration: none; }
.logo-text { font-size: 1.2rem; font-weight: 800; color: white; letter-spacing: 1px; }
.icon-logo { font-size: 1.5rem; }
.nav-links { display: flex; gap: 15px; }
.nav-links a { color: white; text-decoration: none; font-size: 0.7rem; font-weight: 600; padding: 5px 0; opacity: 0.8; transition: all 0.3s; }
.nav-links a:hover, .nav-links a.active { opacity: 1; border-bottom: 2px solid #d4af37; }

.navbar-actions { display: flex; align-items: center; gap: 0.5rem; }

.pais-select {
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #d4af37;
  font-size: 0.8rem;
  cursor: pointer;
  background: #931b18;
  color: white;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 50%;
  transition: background 0.2s;
  color: white;
}

.btn-entrar {
  padding: 0.5rem 1.2rem;
  background-color: #d4af37; 
  color: #931b18; 
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
}

/* MODAL OVERLAY */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.export-card {
  background-color: #931b18;
  width: 90%;
  max-width: 400px;
  padding: 40px;
  border-radius: 15px;
  position: relative;
  color: white;
  text-align: center;
  box-shadow: 0 15px 50px rgba(0,0,0,0.6);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.6rem;
  cursor: pointer;
  opacity: 0.8;
}

.close-btn:hover { opacity: 1; }

.main-download-icon { font-size: 3.5rem; display: block; margin-bottom: 10px; }
.export-header h2 { font-size: 1.8rem; margin-bottom: 8px; }
.export-header p { font-size: 0.95rem; margin-bottom: 30px; opacity: 0.9; }

.export-options { display: flex; flex-direction: column; gap: 12px; }

.export-item {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 15px 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;
}

.export-item:hover { background: rgba(255, 255, 255, 0.2); }
.export-item .ext { opacity: 0.5; font-family: monospace; font-size: 0.85rem; }
</style>