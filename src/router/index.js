import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout, 
      children: [
        {
          path: '', // Página inicial (Visão Geral)
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
        }
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router