<template>
  <aside class="sidebar" :class="{ collapsed }">
    <button class="toggle-btn" @click="collapsed = !collapsed">
      <span>{{ collapsed ? '☰' : '<' }}</span>
    </button>

    <nav>
      <RouterLink
        v-for="item in menu"
        :key="item.rota"
        :to="item.rota"
        class="menu-item"
        :class="{ ativo: route.path === item.rota }"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span v-if="!collapsed" class="menu-label">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
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
</script>

<style scoped>

.sidebar {
  width: 220px;
  height: calc(100vh - 70px);
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  padding: 1.5rem 0;
  transition: width 0.25s ease;
  position: fixed;
  top: 70px;
  left: 0;
  z-index: 10;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: 56px;
}

.toggle-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: #444;
  cursor: pointer;
  font-size: 1.2rem;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 1rem 1rem auto;
  padding: 0 1.5rem;
}

.sidebar.collapsed .toggle-btn {
  margin: 0 0 1rem 0;
  width: 100%;
  height: 40px;
  padding: 0;
  border-left: 3px solid transparent;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}

.toggle-btn:hover {
  background-color: transparent;
  color: #d4af37;
}

.sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 0.75rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: #444;
  font-size: 0.9rem;
  transition: background 0.2s;
  border-left: 3px solid transparent;
  white-space: nowrap;
}

.sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 0.75rem 0;
}

.menu-item:hover {
  background-color: #f0f4ff;
  color: #d4af37;
}

.menu-item.ativo {
  background-color: #e8f0fe;
  color: #d4af37;
  font-weight: 600;
  border-left: 3px solid #d4af37;
}

.menu-icon {
  font-size: 1.2rem;
}
</style>