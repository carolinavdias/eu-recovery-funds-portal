<template>
  <header class="navbar">
    <div class="navbar-logo">
      <RouterLink to="/" class="logo-link">
        <span class="icon-logo">🏛️</span>
        <span class="logo-text">{{ appStore.t.navbar_logo_prefix }} <span class="logo-accent">{{ appStore.t.navbar_logo_suffix }}</span></span>
      </RouterLink>
    </div>

    <div class="navbar-actions">
      <select
        class="pais-select"
        v-model="paisAtual"
        :title="appStore.t.nav_pais_label"
        :aria-label="appStore.t.nav_pais_label"
      >
        <option value="todos">{{ textoTodosPaises }}</option>
        <option v-for="pais in paisesLista" :key="pais.code" :value="pais.code">
          {{ pais.bandeira }} {{ nomePais(pais) }}
        </option>
      </select>

      <button
        class="btn-icon"
        @click="appStore.toggleDarkMode"
        :title="appStore.darkMode ? appStore.t.nav_dark_on : appStore.t.nav_dark_off"
        :aria-label="appStore.darkMode ? appStore.t.nav_dark_on : appStore.t.nav_dark_off"
      >
        {{ appStore.darkMode ? '☀️' : '🌙' }}
      </button>

      <button
        class="btn-idioma"
        @click="appStore.toggleIdioma"
        :title="appStore.t.nav_idioma"
        :aria-label="appStore.t.nav_idioma"
      >
        {{ appStore.idioma === 'pt' ? '🇵🇹 PT' : '🇬🇧 EN' }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { getPaises } from '@/services/api.js'

const appStore = useAppStore()

// Lista de países carregada da API
const paisesLista = ref([])

// Computed bidirecional do país selecionado (filtro global)
const paisAtual = computed({
  get: () => appStore.paisSelecionado,
  set: (val) => appStore.setPais(val)
})

// Tradução do título da navbar
const logoTexto = computed(() => {
  return appStore.idioma === 'pt' ? 'PORTAL' : 'PRR PORTAL'
})

// Texto "Todos os países" traduzido
const textoTodosPaises = computed(() => {
  return appStore.idioma === 'pt' ? 'Todos os países' : 'All countries'
})

// Retorna o nome do país no idioma atual
function nomePais(pais) {
  return appStore.idioma === 'pt' ? pais.nome_pt : pais.nome_en
}

// Carregar países da API ao montar o componente
onMounted(async () => {
  try {
    const paises = await getPaises()
    paisesLista.value = paises
    // Opcional: sincronizar a store com a lista de países (útil para outras páginas)
    appStore.paises = paises
  } catch (error) {
    console.error('Erro ao carregar países na navbar:', error)
  }
})
</script>

<style scoped>
/* Mantém o CSS original que já está no teu projecto */
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
.logo-accent { color: #d4af37; }
.icon-logo { font-size: 1.5rem; }
.navbar-actions { display: flex; align-items: center; gap: 0.6rem; }
.pais-select {
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #d4af37;
  font-size: 0.85rem;
  cursor: pointer;
  background: #931b18;
  color: white;
  transition: background 0.2s, border-color 0.2s;
  /* O select nativo já tem scroll automático se muitos itens */
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pais-select:hover { background: #a82220; border-color: #f0c349; }
.btn-icon {
  background: rgba(255,255,255,0.1);
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
.btn-icon:hover { background: rgba(255,255,255,0.25); transform: scale(1.08); }
.btn-icon:active { transform: scale(0.93); }
.btn-idioma {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  transition: background 0.2s, border-color 0.2s;
  letter-spacing: 0.03em;
  white-space: nowrap;
}
.btn-idioma:hover { background: rgba(255,255,255,0.25); border-color: #d4af37; }
</style>