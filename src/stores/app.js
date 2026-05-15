import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const paisSelecionado = ref('todos')
  const darkMode = ref(localStorage.getItem('prr-dark-mode') === 'true')
  const idioma = ref(localStorage.getItem('prr-idioma') || 'pt')

  const paises = computed(() => {
    const pt = idioma.value === 'pt'
    return [
      { code: 'todos', nome: pt ? 'Todos os países' : 'All countries' },
      { code: 'PT', nome: 'Portugal' },
      { code: 'ES', nome: pt ? 'Espanha' : 'Spain' },
      { code: 'FR', nome: pt ? 'França' : 'France' },
      { code: 'IT', nome: pt ? 'Itália' : 'Italy' },
      { code: 'DE', nome: pt ? 'Alemanha' : 'Germany' },
      { code: 'GR', nome: pt ? 'Grécia' : 'Greece' },
      { code: 'HR', nome: pt ? 'Croácia' : 'Croatia' },
      { code: 'RO', nome: pt ? 'Roménia' : 'Romania' },
    ]
  })

  // Aplica estados guardados antes do primeiro render
  if (darkMode.value) document.body.classList.add('dark-mode')

  // Textos traduzidos — usados pelos componentes partilhados e heroes
  const t = computed(() => {
    const pt = {
      // Navbar
      nav_pais_label: 'Todos os países',
      nav_dark_on: 'Mudar para modo claro',
      nav_dark_off: 'Mudar para modo escuro',
      nav_idioma: 'Mudar idioma',

      // Sidebar
      nav_dashboard: 'Início',
      nav_marcos: 'Marcos e Metas',
      nav_desembolsos: 'Desembolsos',
      nav_indicadores: 'Indicadores Comuns',
      nav_paises: 'Países',
      nav_faq: 'Ajuda / FAQ',

      // Footer
      footer_nav: 'Navegação',
      footer_fontes: 'Fontes',
      footer_academic: 'Trabalho académico desenvolvido para a UC de IPM · UMinho 2025/26',
      footer_copy: '© 2026 Portal PRR · Mecanismo de Recuperação e Resiliência da UE',
      footer_status: 'Dados actualizados · IPM 2025/26',

      // Marcos hero
      marcos_badge: '🎯 Monitorização em Tempo Real',
      marcos_titulo: 'Marcos',
      marcos_accent: 'e Metas',
      marcos_sub: 'Acompanhe o progresso dos objetivos definidos para cada país no âmbito do Mecanismo de Recuperação e Resiliência da EU.',
      marcos_btn_export: '📥 Exportar Dados',
      marcos_btn_tabela: 'Ver Tabela Completa',
      marcos_totais: 'Marcos Totais',
      marcos_concluidos: 'Concluídos',
      marcos_em_curso: 'Em Curso',
      marcos_em_atraso: 'Em Atraso',

      // Países hero
      paises_badge: '🌍 Estados-Membros Beneficiários',
      paises_titulo: 'Países',
      paises_accent: 'do PRR',
      paises_sub: 'Explore os dados de execução de cada país participante no Mecanismo de Recuperação e Resiliência da EU.',
      paises_btn_mapa: '🗺️ Ver Mapa Interativo',
      paises_btn_comparar: '⚖️ Comparar Países',

      // Comparar hero
      comparar_badge: '⚖️ Análise Comparativa',
      comparar_titulo: 'Comparar',
      comparar_accent: 'Países',
      comparar_sub: 'Selecione dois países e explore uma análise detalhada lado a lado do seu desempenho no PRR.',
      comparar_voltar: '← Voltar aos Países',

      // FAQ hero
      faq_badge: '❓ Apoio ao Utilizador',
      faq_titulo: 'Perguntas',
      faq_accent: 'Frequentes',
      faq_sub: 'Encontre respostas sobre o Portal PRR, as funcionalidades disponíveis e os dados do Mecanismo de Recuperação e Resiliência da UE.',
      faq_voltar: '← Voltar ao início',
    }

    const en = {
      // Navbar
      nav_pais_label: 'All countries',
      nav_dark_on: 'Switch to light mode',
      nav_dark_off: 'Switch to dark mode',
      nav_idioma: 'Change language',

      // Sidebar
      nav_dashboard: 'Dashboard',
      nav_marcos: 'Milestones & Targets',
      nav_desembolsos: 'Disbursements',
      nav_indicadores: 'Common Indicators',
      nav_paises: 'Countries',
      nav_faq: 'Help / FAQ',

      // Footer
      footer_nav: 'Navigation',
      footer_fontes: 'Sources',
      footer_academic: 'Academic project developed for the HCI course · UMinho 2025/26',
      footer_copy: '© 2026 PRR Portal · EU Recovery and Resilience Mechanism',
      footer_status: 'Data updated · HCI 2025/26',

      // Marcos hero
      marcos_badge: '🎯 Real-Time Monitoring',
      marcos_titulo: 'Milestones',
      marcos_accent: '& Targets',
      marcos_sub: 'Track the progress of objectives defined for each country under the EU Recovery and Resilience Mechanism.',
      marcos_btn_export: '📥 Export Data',
      marcos_btn_tabela: 'View Full Table',
      marcos_totais: 'Total Milestones',
      marcos_concluidos: 'Completed',
      marcos_em_curso: 'In Progress',
      marcos_em_atraso: 'Delayed',

      // Países hero
      paises_badge: '🌍 Beneficiary Member States',
      paises_titulo: 'Countries',
      paises_accent: 'in the RRP',
      paises_sub: 'Explore execution data for each country participating in the EU Recovery and Resilience Mechanism.',
      paises_btn_mapa: '🗺️ View Interactive Map',
      paises_btn_comparar: '⚖️ Compare Countries',

      // Comparar hero
      comparar_badge: '⚖️ Comparative Analysis',
      comparar_titulo: 'Compare',
      comparar_accent: 'Countries',
      comparar_sub: 'Select two countries and explore a detailed side-by-side analysis of their RRP performance.',
      comparar_voltar: '← Back to Countries',

      // FAQ hero
      faq_badge: '❓ User Support',
      faq_titulo: 'Frequently',
      faq_accent: 'Asked Questions',
      faq_sub: 'Find answers about the PRR Portal, available features and EU Recovery and Resilience Mechanism data.',
      faq_voltar: '← Back to home',
    }

    return idioma.value === 'pt' ? pt : en
  })

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    document.body.classList.toggle('dark-mode', darkMode.value)
    localStorage.setItem('prr-dark-mode', String(darkMode.value))

    // Actualiza os defaults globais do Chart.js (se carregado)
    // e notifica todos os componentes com gráficos para re-renderizar
    import('chart.js').then(({ Chart }) => {
      Chart.defaults.color = darkMode.value ? '#94a3b8' : '#666666'
      Chart.defaults.borderColor = darkMode.value ? '#334155' : '#e0e0e0'
    }).catch(() => { /* Chart.js não disponível */ })

    window.dispatchEvent(new CustomEvent('prr-theme-changed', {
      detail: { dark: darkMode.value }
    }))
  }

  function toggleIdioma() {
    idioma.value = idioma.value === 'pt' ? 'en' : 'pt'
    localStorage.setItem('prr-idioma', idioma.value)
  }

  function setPais(code) {
    paisSelecionado.value = code
  }

  return {
    paisSelecionado,
    darkMode,
    idioma,
    paises,
    t,
    toggleDarkMode,
    toggleIdioma,
    setPais,
  }
})