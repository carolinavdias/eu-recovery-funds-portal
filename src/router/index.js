import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'marcos',
          name: 'marcos',
          component: () => import('@/views/MarcosView.vue'),
        },
        {
          path: 'desembolsos',
          name: 'desembolsos',
          component: () => import('@/views/DesembolsosView.vue'),
        },
        {
          path: 'indicadores',
          name: 'indicadores',
          component: () => import('@/views/IndicadoresView.vue'),
        },
        {
          path: 'paises',
          name: 'paises',
          component: () => import('@/views/PaisesView.vue'),
        },
        {
          path: 'paises/comparar',
          name: 'comparar',
          component: () => import('@/views/CompararView.vue'),
        },
       {
          path: 'paises/:id',
          name: 'pais-detalhe',
          component: () => import('@/views/PaisDetalheView.vue'),
        },
        {
          path: 'faq',          // ← adicionar aqui
          name: 'faq',
          component: () => import('@/views/FAQView.vue'),
        },
      ],                        // fecha children
    },
    {
      path: '/:pathMatch(.*)*', // 404 mantém-se
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router