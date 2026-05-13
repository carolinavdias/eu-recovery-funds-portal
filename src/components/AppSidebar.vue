<template>
  <aside class="sidebar" :class="{ collapsed }">
    <button
      class="toggle-btn"
      @click="collapsed = !collapsed"
      :title="collapsed ? 'Expandir menu' : 'Recolher menu'"
      :aria-label="collapsed ? 'Expandir menu' : 'Recolher menu'"
    >
      <span>{{ collapsed ? '☰' : '‹' }}</span>
    </button>

    <nav>
      <RouterLink
        v-for="item in menu"
        :key="item.rota"
        :to="item.rota"
        class="menu-item"
        :class="{ ativo: isActive(item.rota) }"
        :title="collapsed ? item.label : ''"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span v-if="!collapsed" class="menu-label">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Separador e FAQ no fundo -->
    <div class="sidebar-footer">
      <div class="separador" v-if="!collapsed"></div>
      <RouterLink
        to="/faq"
        class="menu-item faq-item"
        :class="{ ativo: isActive('/faq') }"
        :title="collapsed ? 'Ajuda / FAQ' : ''"
      >
        <span class="menu-icon">❓</span>
        <span v-if="!collapsed" class="menu-label">Ajuda / FAQ</span>
      </RouterLink>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const collapsed = defineModel('collapsed')

const menu = [
  { rota: '/', icon: '⊞', label: 'Dashboard' },
  { rota: '/marcos', icon: '◎', label: 'Marcos e Metas' },
  { rota: '/desembolsos', icon: '€', label: 'Desembolsos' },
  { rota: '/indicadores', icon: '≡', label: 'Indicadores Comuns' },
  { rota: '/paises', icon: '⊕', label: 'Países' },
]

function isActive(rota) {
  if (rota === '/') return route.path === '/'
  return route.path === rota || route.path.startsWith(rota + '/')
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  height: calc(100vh - 70px);
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  padding: 1.5rem 0;
  transition: width 0.25s ease, background-color 0.3s ease;
  position: fixed;
  top: 70px;
  left: 0;
  z-index: 10;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: 56px;
}

.toggle-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: #555;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1rem 1rem auto;
  padding: 0;
  transition: color 0.2s, background 0.2s;
  border-radius: 6px;
}

.sidebar.collapsed .toggle-btn {
  margin: 0 auto 1rem auto;
}

.toggle-btn:hover {
  color: #931b18;
  background: #fdf2f2;
}

nav {
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: #444;
  font-size: 0.9rem;
  transition: background 0.2s, color 0.2s, border-left-color 0.2s;
  border-left: 3px solid transparent;
  white-space: nowrap;
}

.sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 0.75rem 0;
}

.menu-item:hover {
  background-color: #fdf2f2;
  color: #931b18;
}

.menu-item.ativo {
  background-color: #fef5e7;
  color: #931b18;
  font-weight: 600;
  border-left: 3px solid #d4af37;
}

.menu-icon {
  font-size: 1.2rem;
}

/* FAQ no fundo da sidebar */
.sidebar-footer {
  margin-top: auto;
  padding-bottom: 0.5rem;
}

.separador {
  height: 1px;
  background: #f0f0f0;
  margin: 0.5rem 1.5rem 0.5rem 1.5rem;
}

.faq-item {
  color: #888;
  font-size: 0.85rem;
}

.faq-item:hover {
  background-color: #f0f8ff;
  color: #2e6bbf;
}

.faq-item.ativo {
  background-color: #e8f4ff;
  color: #2e6bbf;
  border-left: 3px solid #2e6bbf;
}
</style>