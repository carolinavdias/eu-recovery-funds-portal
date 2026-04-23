<template>
  <aside class="sidebar">
    <nav>
      <RouterLink
        v-for="item in menu"
        :key="item.rota"
        :to="item.rota"
        class="menu-item"
        :class="{ ativo: route.path === item.rota }"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-label">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const menu = [
  { rota: '/',             icon: '⊞', label: 'Dashboard' },
  { rota: '/marcos',       icon: '◎', label: 'Marcos e Metas' },
  { rota: '/desembolsos',  icon: '€', label: 'Desembolsos' },
  { rota: '/indicadores',  icon: '≡', label: 'Indicadores Comuns' },
  { rota: '/paises',       icon: '⊕', label: 'Países' },
]
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100%;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  padding: 1.5rem 0;
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
  font-size: 1rem;
}
</style>