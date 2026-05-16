<template>
  <div class="faq-container">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-overlay">
        <div class="hero-content" :class="{ 'animate-in': heroVisible }">
          <div class="hero-badge">{{ appStore.t.faq_badge }}</div>
          <h1>{{ appStore.t.faq_titulo }}<br><span class="hero-accent">{{ appStore.t.faq_accent }}</span></h1>
          <p>{{ appStore.t.faq_sub }}</p>
          <RouterLink to="/" class="btn-voltar">{{ appStore.t.faq_voltar }}</RouterLink>
        </div>
        <div class="hero-deco" :class="{ 'animate-in': heroVisible }">
          <div class="deco-circle c1"></div>
          <div class="deco-circle c2"></div>
          <div class="faq-icon">❓</div>
        </div>
      </div>
    </section>

    <!-- CONTEÚDO -->
    <section class="faq-section">
      <div class="faq-inner">

        <!-- CATEGORIAS (traduzidas) -->
        <div class="categorias">
          <button
            v-for="cat in categorias"
            :key="cat.id"
            class="cat-btn"
            :class="{ ativo: categoriaActiva === cat.id }"
            @click="categoriaActiva = cat.id"
          >
            {{ cat.icone }} {{ cat.label }}
          </button>
        </div>

        <!-- PERGUNTAS (conforme idioma) -->
        <div class="faq-lista">
          <div
            v-for="(item, i) in perguntasFiltradas"
            :key="i"
            class="faq-item"
            :class="{ aberto: abertos.includes(i) }"
          >
            <button class="faq-pergunta" @click="toggle(i)">
              <span class="faq-q-texto">{{ item.pergunta }}</span>
              <span class="faq-chevron">{{ abertos.includes(i) ? '▲' : '▼' }}</span>
            </button>
            <div class="faq-resposta" v-show="abertos.includes(i)">
              <p v-for="(linha, j) in item.resposta" :key="j">{{ linha }}</p>
              <RouterLink v-if="item.link" :to="item.link.rota" class="faq-link">
                {{ item.link.texto }} →
              </RouterLink>
            </div>
          </div>

          <div v-if="perguntasFiltradas.length === 0" class="faq-empty">
            <span>🔍</span>
            <p>{{ appStore.t.faq_empty_titulo }}</p>
            <p>{{ appStore.t.faq_empty_desc }}</p>
          </div>
        </div>

        <!-- CONTACTO (traduzido) -->
        <div class="contacto-card">
          <div class="contacto-icon">✉️</div>
          <div class="contacto-texto">
            <h3>{{ appStore.t.faq_contact_titulo }}</h3>
            <p>{{ appStore.t.faq_contact_desc }}</p>
          </div>
          <div class="contacto-links">
            <a href="https://recuperarportugal.gov.pt/" target="_blank" rel="noopener noreferrer" class="contacto-btn">{{ appStore.t.faq_contact_btn_prr }}</a>
            <a href="https://ec.europa.eu/economy_finance/recovery-and-resilience-scoreboard/" target="_blank" rel="noopener noreferrer" class="contacto-btn">{{ appStore.t.faq_contact_btn_scoreboard }}</a>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { watch } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const heroVisible = ref(false)
const categoriaActiva = ref('geral')
const abertos = ref([0]) // primeira pergunta aberta por defeito

// Categorias (usando traduções da store)
const categorias = computed(() => [
  { id: 'geral', icone: '🌍', label: appStore.t.faq_cat_geral },
  { id: 'dados', icone: '📊', label: appStore.t.faq_cat_dados },
  { id: 'funcionalidades', icone: '⚙️', label: appStore.t.faq_cat_funcionalidades },
  { id: 'exportacao', icone: '📥', label: appStore.t.faq_cat_exportacao },
])

// Dados das perguntas em português
const perguntasDataPt = [
  {
    categoria: 'geral',
    pergunta: 'O que é o Portal PRR?',
    resposta: [
      'O Portal PRR é um sistema de visualização de dados inspirado no EU Recovery and Resilience Scoreboard, o portal europeu de monitorização do Mecanismo de Recuperação e Resiliência (MRR).',
      'Permite analisar e interpretar dados complexos sobre a execução de marcos e metas, os pagamentos efetuados e a alocação de fundos, facilitando a extração de informação objetiva sobre o progresso dos Planos Nacionais de Recuperação.',
      'Este portal foi desenvolvido como trabalho académico na UC de Interface Pessoa-Máquina (IPM) da Universidade do Minho, 2025/26.',
    ],
  },
  {
    categoria: 'geral',
    pergunta: 'O que é o Mecanismo de Recuperação e Resiliência da UE?',
    resposta: [
      'O Mecanismo de Recuperação e Resiliência (MRR) é o principal instrumento do plano de recuperação da UE, NextGenerationEU, com um total de €750 mil milhões disponíveis para apoiar os Estados-Membros.',
      'Os fundos são distribuídos sob a forma de subvenções e empréstimos, condicionados ao cumprimento de marcos e metas acordados com a Comissão Europeia.',
      'Portugal, através do PRR (Plano de Recuperação e Resiliência) tem acesso a €16,6 mil milhões para investimentos nas áreas da transição climática, digitalização, habitação, saúde e educação.',
    ],
  },
  {
    categoria: 'geral',
    pergunta: 'Os dados apresentados são reais?',
    resposta: [
      'Os dados utilizados neste portal são dados de mockup (simulados) criados para fins académicos, inspirados na estrutura e tipologia dos dados reais disponíveis no EU Recovery and Resilience Scoreboard.',
      'Para dados oficiais e actualizados, consulte o EU Recovery and Resilience Scoreboard em recovery-and-resilience-scoreboard.ec.europa.eu ou o site oficial do PRR Portugal em recuperarportugal.gov.pt.',
    ],
  },
  {
    categoria: 'dados',
    pergunta: 'O que são Marcos e Metas?',
    resposta: [
      'Os Marcos e Metas ("Milestones and Targets") são os objetivos específicos que cada Estado-Membro se comprometeu a cumprir para receber os fundos do MRR.',
      'Os Marcos são objetivos qualitativos (ex: aprovação de legislação, criação de entidades). As Metas são objetivos quantitativos mensuráveis (ex: número de edifícios renovados, % de serviços digitalizados).',
      'Neste portal pode filtrar por país, setor e estado de execução, ver o progresso de cada objetivo e exportar os dados.',
    ],
    link: { rota: '/marcos', texto: 'Ver Marcos e Metas' },
  },
  {
    categoria: 'dados',
    pergunta: 'O que são os Indicadores Comuns?',
    resposta: [
      'Os Indicadores Comuns ("Common Indicators") são 14 indicadores de reporte obrigatório e semestral por todos os Estados-Membros, definidos pela Comissão Europeia.',
      'Cobrem áreas como digitalização (utilizadores de internet, banda larga), clima (energia renovável, emissões de GEE), emprego e educação (taxa de emprego, abandono escolar).',
      'Para cada indicador é possível ver o valor de Portugal face à média europeia e a tendência de evolução.',
    ],
    link: { rota: '/indicadores', texto: 'Ver Indicadores Comuns' },
  },
  {
    categoria: 'dados',
    pergunta: 'O que são os Desembolsos?',
    resposta: [
      'Os Desembolsos ("Disbursements") são os pagamentos efectuados pela UE a cada Estado-Membro, à medida que os marcos e metas são cumpridos e validados pela Comissão Europeia.',
      'Portugal recebeu o pré-financiamento de €2,2 mil milhões em 2021, seguido de pedidos de pagamento subsequentes à medida que os objetivos são verificados.',
      'Esta secção inclui também a listagem dos 100 maiores beneficiários por país.',
    ],
    link: { rota: '/desembolsos', texto: 'Ver Desembolsos' },
  },
  {
    categoria: 'dados',
    pergunta: 'Como estão organizados os dados por país?',
    resposta: [
      'A secção de Países permite explorar dados de execução individualizados para cada um dos 8 Estados-Membros disponíveis: Portugal, Espanha, França, Itália, Alemanha, Grécia, Croácia e Roménia.',
      'Para cada país é apresentado o progresso geral, total de fundos alocados, marcos totais e concluídos, e desembolsos recebidos.',
      'É também possível comparar dois países lado a lado para análise comparativa de desempenho.',
    ],
    link: { rota: '/paises', texto: 'Ver Países' },
  },
  {
    categoria: 'funcionalidades',
    pergunta: 'Como funciona o filtro de país na barra superior?',
    resposta: [
      'O selector de país na barra de navegação superior permite filtrar os dados de toda a aplicação para um país específico.',
      'Ao seleccionar um país, as páginas de Marcos e Metas e outras secções actualizarão automaticamente os dados para mostrar apenas informação relativa ao país escolhido.',
      'Para ver dados de todos os países, seleccione "Todos os países" (opção por defeito).',
    ],
  },
  {
    categoria: 'funcionalidades',
    pergunta: 'Como comparar dois países?',
    resposta: [
      'Aceda à secção "Países" e clique em "Comparar Países", ou aceda directamente ao menu lateral.',
      'Seleccione o País A e o País B a partir da grelha de países disponíveis.',
      'O sistema calcula automaticamente um scorecard comparativo com 6 métricas (progresso, marcos totais, marcos concluídos, taxa de conclusão, fundos alocados e população) e determina o país com melhor desempenho geral.',
    ],
    link: { rota: '/paises/comparar', texto: 'Comparar Países' },
  },
  {
    categoria: 'funcionalidades',
    pergunta: 'Como ativar o modo escuro?',
    resposta: [
      'Clique no ícone da lua (🌙) na barra de navegação superior para ativar o modo escuro.',
      'Clique no ícone do sol (☀️) para voltar ao modo claro.',
      'A preferência é guardada automaticamente e mantém-se entre sessões.',
    ],
  },
  {
    categoria: 'funcionalidades',
    pergunta: 'Os gráficos actualizam com os filtros?',
    resposta: [
      'Sim. Na página de Marcos e Metas, os gráficos de "Progresso por Pilar" e "Distribuição por Estado" actualizam automaticamente sempre que aplica ou remove filtros de país, setor ou estado.',
      'Desta forma consegue visualizar rapidamente o desempenho de um país específico ou de um setor em particular.',
    ],
    link: { rota: '/marcos', texto: 'Ver gráficos em Marcos e Metas' },
  },
  {
    categoria: 'exportacao',
    pergunta: 'Como exportar dados em CSV ou JSON?',
    resposta: [
      'Na página de Marcos e Metas, clique em "Exportar Dados" no hero ou nos botões "⬇ CSV" / "⬇ JSON" da tabela completa.',
      'A exportação aplica os filtros ativos: se tiver filtrado por Portugal, o CSV/JSON exportado conterá apenas os marcos de Portugal.',
      'O formato CSV é ideal para abrir no Excel ou Google Sheets. O formato JSON é adequado para análise programática ou integração com outras ferramentas.',
    ],
    link: { rota: '/marcos', texto: 'Ir para Marcos e Metas' },
  },
  {
    categoria: 'exportacao',
    pergunta: 'Como exportar um gráfico como imagem?',
    resposta: [
      'Em cada gráfico da página de Marcos e Metas existe um botão "📥 PNG" no canto superior direito.',
      'Ao clicar, o gráfico é exportado como imagem PNG com fundo branco, pronto para usar em apresentações ou relatórios.',
      'A imagem exportada reflecte o estado actual do gráfico, incluindo os filtros aplicados.',
    ],
  },
  {
    categoria: 'exportacao',
    pergunta: 'Em que formatos estão disponíveis os dados?',
    resposta: [
      'Os dados de Marcos e Metas estão disponíveis em CSV, JSON e PDF.',
      'Os dados de Desembolsos estão disponíveis em CSV, JSON e PDF.',
      'Os gráficos estão disponíveis em PNG (imagem de alta qualidade com fundo branco).',
      'Os dados de Indicadores Comuns estão disponíveis com opção de exportação por indicador.',
    ],
  },
]

// Dados das perguntas em inglês
const perguntasDataEn = [
  {
    categoria: 'geral',
    pergunta: 'What is the PRR Portal?',
    resposta: [
      'The PRR Portal is a data visualization system inspired by the EU Recovery and Resilience Scoreboard, the European monitoring portal for the Recovery and Resilience Mechanism (RRM).',
      'It allows you to analyze and interpret complex data on the implementation of milestones and targets, payments made, and fund allocation, facilitating the extraction of objective information on the progress of National Recovery Plans.',
      'This portal was developed as an academic project for the Human-Computer Interaction (HCI) course at the University of Minho, 2025/26.',
    ],
  },
  {
    categoria: 'geral',
    pergunta: 'What is the EU Recovery and Resilience Mechanism?',
    resposta: [
      'The Recovery and Resilience Mechanism (RRM) is the main instrument of the EU recovery plan, NextGenerationEU, with a total of €750 billion available to support Member States.',
      'Funds are distributed as grants and loans, conditional on the fulfillment of milestones and targets agreed with the European Commission.',
      'Portugal, through the RRP (Recovery and Resilience Plan) has access to €16.6 billion for investments in climate transition, digitalization, housing, health, and education.',
    ],
  },
  {
    categoria: 'geral',
    pergunta: 'Are the data presented real?',
    resposta: [
      'The data used in this portal are mockup (simulated) data created for academic purposes, inspired by the structure and typology of real data available on the EU Recovery and Resilience Scoreboard.',
      'For official and updated data, please consult the EU Recovery and Resilience Scoreboard at recovery-and-resilience-scoreboard.ec.europa.eu or the official Portuguese RRP website at recuperarportugal.gov.pt.',
    ],
  },
  {
    categoria: 'dados',
    pergunta: 'What are Milestones and Targets?',
    resposta: [
      'Milestones and Targets are the specific objectives each Member State has committed to achieving in order to receive RRM funds.',
      'Milestones are qualitative objectives (e.g., approval of legislation, creation of entities). Targets are measurable quantitative objectives (e.g., number of renovated buildings, percentage of digitalized services).',
      'On this portal you can filter by country, sector and execution status, view the progress of each objective, and export the data.',
    ],
    link: { rota: '/marcos', texto: 'View Milestones & Targets' },
  },
  {
    categoria: 'dados',
    pergunta: 'What are Common Indicators?',
    resposta: [
      'Common Indicators are 14 mandatory semi-annual reporting indicators for all Member States, defined by the European Commission.',
      'They cover areas such as digitalization (internet users, broadband), climate (renewable energy, GHG emissions), employment, and education (employment rate, school dropout rate).',
      'For each indicator you can see Portugal’s value compared to the European average and the evolution trend.',
    ],
    link: { rota: '/indicadores', texto: 'View Common Indicators' },
  },
  {
    categoria: 'dados',
    pergunta: 'What are Disbursements?',
    resposta: [
      'Disbursements are payments made by the EU to each Member State as milestones and targets are met and validated by the European Commission.',
      'Portugal received a pre-financing of €2.2 billion in 2021, followed by subsequent payment requests as objectives are verified.',
      'This section also includes a list of the top 100 beneficiaries by country.',
    ],
    link: { rota: '/desembolsos', texto: 'View Disbursements' },
  },
  {
    categoria: 'dados',
    pergunta: 'How are country data organized?',
    resposta: [
      'The Countries section allows you to explore individualized execution data for each of the 8 available Member States: Portugal, Spain, France, Italy, Germany, Greece, Croatia, and Romania.',
      'For each country, overall progress, total allocated funds, total and completed milestones, and received disbursements are displayed.',
      'You can also compare two countries side by side for comparative performance analysis.',
    ],
    link: { rota: '/paises', texto: 'View Countries' },
  },
  {
    categoria: 'funcionalidades',
    pergunta: 'How does the country filter in the top bar work?',
    resposta: [
      'The country selector in the top navigation bar allows you to filter all application data for a specific country.',
      'When you select a country, the Milestones & Targets page and other sections will automatically update to show only information related to the chosen country.',
      'To view data for all countries, select "All countries" (default option).',
    ],
  },
  {
    categoria: 'funcionalidades',
    pergunta: 'How to compare two countries?',
    resposta: [
      'Go to the "Countries" section and click "Compare Countries", or access directly from the side menu.',
      'Select Country A and Country B from the available country grid.',
      'The system automatically calculates a comparative scorecard with 6 metrics (progress, total milestones, completed milestones, completion rate, allocated funds, and population) and determines the country with the best overall performance.',
    ],
    link: { rota: '/paises/comparar', texto: 'Compare Countries' },
  },
  {
    categoria: 'funcionalidades',
    pergunta: 'How to enable dark mode?',
    resposta: [
      'Click the moon icon (🌙) in the top navigation bar to enable dark mode.',
      'Click the sun icon (☀️) to return to light mode.',
      'The preference is automatically saved and maintained between sessions.',
    ],
  },
  {
    categoria: 'funcionalidades',
    pergunta: 'Do charts update with filters?',
    resposta: [
      'Yes. On the Milestones & Targets page, the "Progress by Pillar" and "Distribution by Status" charts automatically update whenever you apply or remove country, sector, or status filters.',
      'This allows you to quickly visualize the performance of a specific country or sector.',
    ],
    link: { rota: '/marcos', texto: 'View charts on Milestones & Targets' },
  },
  {
    categoria: 'exportacao',
    pergunta: 'How to export data as CSV or JSON?',
    resposta: [
      'On the Milestones & Targets page, click "Export Data" in the hero section or use the "⬇ CSV" / "⬇ JSON" buttons in the complete table.',
      'The export applies the active filters: if you have filtered for Portugal, the exported CSV/JSON will contain only Portuguese milestones.',
      'CSV format is ideal for opening in Excel or Google Sheets. JSON format is suitable for programmatic analysis or integration with other tools.',
    ],
    link: { rota: '/marcos', texto: 'Go to Milestones & Targets' },
  },
  {
    categoria: 'exportacao',
    pergunta: 'How to export a chart as an image?',
    resposta: [
      'On each chart on the Milestones & Targets page, there is a "📥 PNG" button in the top right corner.',
      'Clicking it exports the chart as a PNG image with a white background, ready to use in presentations or reports.',
      'The exported image reflects the current state of the chart, including applied filters.',
    ],
  },
  {
    categoria: 'exportacao',
    pergunta: 'What data formats are available?',
    resposta: [
      'Milestones & Targets data are available as CSV, JSON and PDF.',
      'Disbursements data are available as CSV, JSON and PDF.',
      'Charts are available as PNG (high-quality image with white background).',
      'Common Indicators data are available with per‑indicator export options.',
    ],
  },
]

// Perguntas consoante idioma actual
const perguntas = computed(() => {
  return appStore.idioma === 'pt' ? perguntasDataPt : perguntasDataEn
})

const perguntasFiltradas = computed(() =>
  perguntas.value.filter(p => p.categoria === categoriaActiva.value)
)

function toggle(i) {
  if (abertos.value.includes(i)) {
    abertos.value = abertos.value.filter(x => x !== i)
  } else {
    abertos.value = [...abertos.value, i]
  }
}

// Reset abertos quando muda categoria
watch(categoriaActiva, () => {
  abertos.value = [0]
})

onMounted(() => {
  setTimeout(() => { heroVisible.value = true }, 100)
})
</script>

<style scoped>
/* Mantém o teu CSS original – não mexemos */
.faq-container { margin: -2rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow-x: hidden; }

/* HERO */
.hero {
  background-image: url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 50vh;
}
.hero-overlay {
  background: linear-gradient(135deg, rgba(80,10,8,0.97) 0%, rgba(147,27,24,0.9) 100%);
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 10%;
  gap: 40px;
  flex-wrap: wrap;
}
.hero-content { flex: 1; min-width: 280px; opacity: 0; transform: translateX(-40px); transition: all 0.9s ease; }
.hero-content.animate-in { opacity: 1; transform: translateX(0); }
.hero-deco { opacity: 0; transition: all 0.9s ease 0.4s; position: relative; width: 180px; height: 180px; flex-shrink: 0; }
.hero-deco.animate-in { opacity: 1; }
.deco-circle { position: absolute; border-radius: 50%; border: 2px solid rgba(255,255,255,0.15); }
.c1 { width: 180px; height: 180px; top: 0; left: 0; animation: spin-slow 20s linear infinite; }
.c2 { width: 120px; height: 120px; top: 30px; left: 30px; animation: spin-slow 14s linear infinite reverse; }
.faq-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3.5rem; animation: pulse-faq 2s ease infinite; }
@keyframes spin-slow { to { transform: rotate(360deg); } }
@keyframes pulse-faq { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.12); } }
.hero-badge { display: inline-block; background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.6); color: #d4af37; padding: 6px 16px; border-radius: 99px; font-size: 0.78rem; font-weight: 700; margin-bottom: 16px; }
.hero-content h1 { font-size: 3.5rem; font-weight: 900; color: white; margin-bottom: 14px; line-height: 1; letter-spacing: -0.02em; }
.hero-accent { color: #d4af37; }
.hero-content p { font-size: 0.95rem; color: rgba(255,255,255,0.75); max-width: 460px; line-height: 1.7; margin-bottom: 24px; }
.btn-voltar { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: color 0.2s; }
.btn-voltar:hover { color: white; }

/* SECÇÃO FAQ */
.faq-section { padding: 60px 10%; background: #f5f5f7; }
.faq-inner { max-width: 860px; margin: 0 auto; }

/* CATEGORIAS */
.categorias { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 32px; }
.cat-btn {
  background: white;
  border: 1.5px solid #e0e0e0;
  color: #666;
  padding: 9px 18px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.cat-btn:hover { border-color: #931b18; color: #931b18; }
.cat-btn.ativo { background: #931b18; border-color: #931b18; color: white; }

/* LISTA DE PERGUNTAS */
.faq-lista { display: flex; flex-direction: column; gap: 10px; margin-bottom: 40px; }

.faq-item {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1.5px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.faq-item.aberto {
  border-color: #d4af37;
  box-shadow: 0 4px 20px rgba(212,175,55,0.12);
}

.faq-pergunta {
  width: 100%;
  background: transparent;
  border: none;
  padding: 18px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}
.faq-pergunta:hover { background: #fdf9f0; }
.faq-item.aberto .faq-pergunta { background: #fdf9f0; }

.faq-q-texto { font-size: 0.95rem; font-weight: 700; color: #1a1a1a; line-height: 1.4; flex: 1; }
.faq-item.aberto .faq-q-texto { color: #931b18; }
.faq-chevron { font-size: 0.7rem; color: #aaa; flex-shrink: 0; transition: color 0.2s; }
.faq-item.aberto .faq-chevron { color: #d4af37; }

.faq-resposta {
  padding: 0 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.faq-resposta p { font-size: 0.88rem; color: #555; line-height: 1.7; }
.faq-link {
  display: inline-flex;
  align-items: center;
  margin-top: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #931b18;
  text-decoration: none;
  transition: color 0.2s;
}
.faq-link:hover { color: #6b1210; text-decoration: underline; }

.faq-empty { text-align: center; padding: 40px; color: #aaa; font-size: 0.9rem; }
.faq-empty span { font-size: 2rem; display: block; margin-bottom: 10px; }

/* CONTACTO */
.contacto-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  flex-wrap: wrap;
  border-left: 4px solid #d4af37;
}
.contacto-icon { font-size: 2.5rem; flex-shrink: 0; }
.contacto-texto { flex: 1; min-width: 200px; }
.contacto-texto h3 { font-size: 1.05rem; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; }
.contacto-texto p { font-size: 0.85rem; color: #777; line-height: 1.6; }
.contacto-links { display: flex; gap: 10px; flex-wrap: wrap; flex-shrink: 0; }
.contacto-btn {
  background: #931b18;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  transition: all 0.2s;
  white-space: nowrap;
}
.contacto-btn:hover { background: #6b1210; transform: translateY(-2px); }
</style>