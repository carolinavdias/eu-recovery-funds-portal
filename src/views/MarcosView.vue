<template>
  <div class="marcos-container">

    <!-- MODAL DE EXPORTAÇÃO -->
    <div v-if="showExportModal" class="modal-overlay" @click.self="showExportModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showExportModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📥</span>
          <h2>Exportar Dados</h2>
          <p>Descarregue os dados de Marcos e Metas para análise offline</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="exportarDados('csv')"><span>Exportar como CSV</span><span class="ext">.csv</span></button>
          <button class="export-item" @click="exportarDados('json')"><span>Feed de Dados (JSON)</span><span class="ext">.json</span></button>
        </div>
      </div>
    </div>

    <!-- MODAL DE DETALHE -->
    <div v-if="marcoDetalhe" class="modal-overlay" @click.self="marcoDetalhe = null">
      <div class="detalhe-card">
        <button class="close-btn-detalhe" @click="marcoDetalhe = null">✕</button>
        <div class="detalhe-img-wrap">
          <img :src="marcoDetalhe.imagem" :alt="marcoDetalhe.titulo" class="detalhe-img" />
          <div class="detalhe-img-overlay" :style="{ background: overlayGradiente(marcoDetalhe.setor) }"></div>
          <div class="detalhe-img-content">
            <span class="marco-setor-pill">{{ marcoDetalhe.setorLabel }}</span>
            <span :class="['estado-pill', marcoDetalhe.estado]">{{ estadoLabel(marcoDetalhe.estado) }}</span>
          </div>
        </div>
        <div class="detalhe-body">
          <div class="detalhe-meta">
            <span class="tag-pais">🌍 {{ marcoDetalhe.pais }}</span>
            <span class="tag-prazo">📅 {{ marcoDetalhe.prazo }}</span>
          </div>
          <h2 class="detalhe-titulo">{{ marcoDetalhe.titulo }}</h2>
          <p class="detalhe-desc">{{ marcoDetalhe.descricao }}</p>
          <div class="detalhe-progresso">
            <div class="progresso-header">
              <span>Progresso de execução</span>
              <strong :style="{ color: corProgresso(marcoDetalhe.estado) }">{{ marcoDetalhe.progresso }}%</strong>
            </div>
            <div class="progresso-bg">
              <div class="progresso-fill" :style="{ width: marcoDetalhe.progresso + '%', background: corProgresso(marcoDetalhe.estado) }"></div>
            </div>
          </div>
          <div class="detalhe-stats">
            <div class="dstat">
              <span class="dstat-label">Estado</span>
              <span :class="['tabela-badge', marcoDetalhe.estado]">{{ estadoLabel(marcoDetalhe.estado) }}</span>
            </div>
            <div class="dstat">
              <span class="dstat-label">Setor</span>
              <span class="dstat-val">{{ marcoDetalhe.setorLabel }}</span>
            </div>
            <div class="dstat">
              <span class="dstat-label">Investimento</span>
              <span class="dstat-val dstat-highlight">{{ marcoDetalhe.investimento }}</span>
            </div>
            <div class="dstat">
              <span class="dstat-label">Beneficiários</span>
              <span class="dstat-val">{{ marcoDetalhe.beneficiarios }}</span>
            </div>
            <div class="dstat dstat-full">
              <span class="dstat-label">Indicador de Sucesso</span>
              <span class="dstat-val">{{ marcoDetalhe.indicadorSucesso }}</span>
            </div>
            <div class="dstat dstat-full">
              <span class="dstat-label">Entidade Responsável</span>
              <span class="dstat-val">{{ marcoDetalhe.entidade }}</span>
            </div>
          </div>
          <div class="detalhe-actions">
            <button class="btn-export-detalhe" @click="showExportModal = true; marcoDetalhe = null">📥 Exportar dados</button>
            <button class="btn-fechar-detalhe" @click="marcoDetalhe = null">Fechar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>A carregar dados...</p>
    </div>

    <!-- ERRO -->
    <div v-if="erro" class="erro-state">
      <span>⚠️</span>
      <p>{{ erro }}</p>
    </div>    

    <!-- HERO -->
    <section class="hero">
      <div class="hero-overlay">
        <div class="hero-left" :class="{ 'animate-in': heroVisible }">
          <div class="hero-badge">🎯 Monitorização em Tempo Real</div>
          <h1>Marcos<br><span class="hero-accent">e Metas</span></h1>
          <p>Acompanhe o progresso dos objetivos definidos para cada país no âmbito do Mecanismo de Recuperação e Resiliência da EU.</p>
          <div class="hero-actions">
            <button class="btn-hero-primary" @click="showExportModal = true">📥 Exportar Dados</button>
            <button class="btn-hero-outline" @click="scrollSmooth('tabela-marcos')">Ver Tabela Completa</button>
          </div>
        </div>
        <div class="hero-stats" :class="{ 'animate-in': heroVisible }">
          <div class="hsc total"><div class="hsc-icon-wrap">🎯</div><span class="hsc-val">{{ contadorTotal }}</span><span class="hsc-label">Marcos Totais</span></div>
          <div class="hsc verde"><div class="hsc-icon-wrap">✅</div><span class="hsc-val">{{ contadorConcluidos }}</span><span class="hsc-label">Concluídos</span></div>
          <div class="hsc amarelo"><div class="hsc-icon-wrap">⏳</div><span class="hsc-val">{{ contadorEmCurso }}</span><span class="hsc-label">Em Curso</span></div>
          <div class="hsc vermelho"><div class="hsc-icon-wrap">⚠️</div><span class="hsc-val">{{ contadorEmAtraso }}</span><span class="hsc-label">Em Atraso</span></div>
        </div>
      </div>
    </section>

    <!-- FILTROS -->
    <section class="filtros-section" id="filtros">
      <div class="filtros-inner">
        <div class="filtros-left">
          <span class="filtros-titulo">🔍 Filtrar</span>
          <!-- INDICADOR DE FILTROS ACTIVOS -->
          <div v-if="filtrosActivos > 0" class="filtros-activos-badge">
            {{ filtrosActivos }} filtro{{ filtrosActivos > 1 ? 's' : '' }} activo{{ filtrosActivos > 1 ? 's' : '' }}
            · {{ marcosFiltrados.length }} resultado{{ marcosFiltrados.length !== 1 ? 's' : '' }}
          </div>
        </div>
        <div class="filtros-grid">
          <div class="filtro-item" :class="{ 'filtro-activo': filtroPais !== 'todos' }">
            <label>País</label>
            <select v-model="filtroPais">
              <option value="todos">Todos os países</option>
              <option v-for="p in appStore.paises.filter(p => p.code !== 'todos')" :key="p.code" :value="p.code">{{ p.nome }}</option>
            </select>
          </div>
          <div class="filtro-item" :class="{ 'filtro-activo': filtroSetor !== 'todos' }">
            <label>Setor</label>
            <select v-model="filtroSetor">
              <option value="todos">Todos os setores</option>
              <option value="digital">💻 Transição Digital</option>
              <option value="clima">🌿 Transição Climática</option>
              <option value="saude">❤️ Saúde</option>
              <option value="educacao">🎓 Educação e Formação</option>
              <option value="coesao">👥 Coesão Social</option>
              <option value="infraestrutura">🏢 Infraestruturas</option>
            </select>
          </div>
          <div class="filtro-item" :class="{ 'filtro-activo': filtroEstado !== 'todos' }">
            <label>Estado</label>
            <select v-model="filtroEstado">
              <option value="todos">Todos os estados</option>
              <option value="concluido">✅ Concluído</option>
              <option value="em_curso">⏳ Em curso</option>
              <option value="em_atraso">⚠️ Em atraso</option>
            </select>
          </div>
          <button class="btn-limpar" :class="{ 'btn-limpar-activo': filtrosActivos > 0 }" @click="limparFiltros">✕ Limpar</button>
        </div>
      </div>
    </section>

    <!-- GRÁFICOS -->
    <section class="graficos-section" id="graficos">
      <div class="graficos-titulo-area">
        <h2>Análise Visual</h2>
        <p>Dados agregados dos marcos e metas por setor e estado de execução — atualizam automaticamente com os filtros</p>
      </div>
      <div class="graficos-grid">
        <div class="grafico-card grande">
          <div class="grafico-header">
            <div>
              <h3>📊 Progresso por Pilar</h3>
              <p class="grafico-sub">Progresso médio (%) dos marcos concluídos em cada setor de intervenção do PRR</p>
            </div>
            <button class="btn-export-grafico" @click="exportarGrafico('graficoBarras')" title="Exportar gráfico como imagem PNG com fundo branco">📥 PNG</button>
          </div>
          <div class="grafico-canvas-wrap"><canvas id="graficoBarras"></canvas></div>
          <p class="grafico-legenda-texto">Cada barra representa a média de progresso de todos os marcos nesse setor. 100% = todos os marcos concluídos.</p>
        </div>
        <div class="grafico-card">
          <div class="grafico-header">
            <div>
              <h3>🍩 Distribuição por Estado</h3>
              <p class="grafico-sub">Proporção de marcos por estado de execução (concluído, em curso, em atraso)</p>
            </div>
            <button class="btn-export-grafico" @click="exportarGrafico('graficoDonut')" title="Exportar gráfico como imagem PNG com fundo branco">📥 PNG</button>
          </div>
          <div class="donut-wrap">
            <div class="donut-canvas-wrap"><canvas id="graficoDonut"></canvas></div>
            <div class="donut-legenda">
              <div class="leg-item"><span class="leg-cor" style="background:#1a7a4a"></span><div class="leg-info"><span>Concluído</span><strong>{{ marcosFiltrados.filter(m=>m.estado==='concluido').length }}</strong></div></div>
              <div class="leg-item"><span class="leg-cor" style="background:#e6a817"></span><div class="leg-info"><span>Em Curso</span><strong>{{ marcosFiltrados.filter(m=>m.estado==='em_curso').length }}</strong></div></div>
              <div class="leg-item"><span class="leg-cor" style="background:#931b18"></span><div class="leg-info"><span>Em Atraso</span><strong>{{ marcosFiltrados.filter(m=>m.estado==='em_atraso').length }}</strong></div></div>
              <div class="leg-total"><span>Total</span><strong>{{ marcosFiltrados.length }}</strong></div>
            </div>
          </div>
          <p class="grafico-legenda-texto">O gráfico mostra a distribuição percentual dos {{ marcos.length }} marcos monitorizados.</p>
        </div>
      </div>
    </section>

    <!-- LISTA DE MARCOS -->
    <section class="lista-section" id="lista-marcos">
      <div class="lista-header">
        <div>
          <h2>Lista de Marcos</h2>
          <p class="lista-sub">
            {{ marcosFiltrados.length }} resultado{{ marcosFiltrados.length !== 1 ? 's' : '' }} encontrado{{ marcosFiltrados.length !== 1 ? 's' : '' }}
            <span v-if="filtrosActivos > 0" class="lista-filtro-info"> com {{ filtrosActivos }} filtro{{ filtrosActivos > 1 ? 's' : '' }} aplicado{{ filtrosActivos > 1 ? 's' : '' }}</span>
          </p>
        </div>
        <div class="lista-header-actions">
          <button class="btn-scroll-tabela" @click="scrollSmooth('tabela-marcos')">📋 Ver tabela</button>
          <button class="btn-export-lista" @click="showExportModal = true">📥 Exportar lista</button>
        </div>
      </div>

      <div v-if="marcosFiltrados.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Nenhum resultado encontrado</h3>
        <p>Não existem marcos que correspondam aos filtros selecionados.</p>
        <button class="btn-limpar-empty" @click="limparFiltros">Limpar filtros</button>
      </div>

      <div v-else class="marcos-grid">
        <div v-for="(marco, index) in marcosFiltrados" :key="marco.id" class="marco-card" :style="{ animationDelay: (index * 0.08) + 's' }">
          <div class="marco-img-wrap">
            <img :src="marco.imagem" :alt="marco.titulo" class="marco-img" />
            <div class="marco-img-overlay" :style="{ background: overlayGradiente(marco.setor) }"></div>
            <div class="marco-img-content">
              <span class="marco-setor-pill">{{ marco.setorLabel }}</span>
              <span :class="['estado-pill', marco.estado]">{{ estadoLabel(marco.estado) }}</span>
            </div>
            <div class="marco-pais-badge">🌍 {{ marco.pais }}</div>
          </div>
          <div class="marco-body">
            <h3 class="marco-titulo">{{ marco.titulo }}</h3>
            <p class="marco-desc">{{ marco.descricao }}</p>
            <div class="marco-meta"><span class="meta-item">📅 <strong>{{ marco.prazo }}</strong></span></div>
            <div class="progresso-wrapper">
              <div class="progresso-header">
                <span>Progresso</span>
                <strong :style="{ color: corProgresso(marco.estado) }">{{ marco.progresso }}%</strong>
              </div>
              <div class="progresso-bg">
                <div class="progresso-fill" :style="{ width: marco.progresso + '%', background: corProgresso(marco.estado) }"></div>
              </div>
            </div>
            <div class="marco-footer">
              <button class="btn-detalhe" @click="marcoDetalhe = marco">Ver detalhes →</button>
              <div class="marco-dl" @click="showExportModal = true" title="Exportar dados deste marco">
                <span class="dl-icon">📥</span>
                <small>CSV | JSON</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TABELA -->
    <section class="tabela-section" id="tabela-marcos">
      <div class="tabela-header">
        <div>
          <h2>Detalhamento de Execução</h2>
          <p class="tabela-sub">Listagem completa · clique numa linha para ver detalhes · clique nos cabeçalhos para ordenar</p>
        </div>
        <div class="tabela-btns">
          <button class="btn-csv" @click="exportarDados('csv')">⬇ CSV</button>
          <button class="btn-json" @click="exportarDados('json')">⬇ JSON</button>
        </div>
      </div>
      <div class="tabela-wrap">
        <table class="tabela">
          <thead>
            <tr>
              <th @click="ordenarPor('id')" class="th-sort">ID <span class="sort-icon">{{ sortCol === 'id' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span></th>
              <th @click="ordenarPor('titulo')" class="th-sort">Designação do Marco <span class="sort-icon">{{ sortCol === 'titulo' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span></th>
              <th @click="ordenarPor('pais')" class="th-sort">País <span class="sort-icon">{{ sortCol === 'pais' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span></th>
              <th @click="ordenarPor('prazo')" class="th-sort">Prazo <span class="sort-icon">{{ sortCol === 'prazo' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span></th>
              <th @click="ordenarPor('estado')" class="th-sort">Estado <span class="sort-icon">{{ sortCol === 'estado' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span></th>
              <th @click="ordenarPor('progresso')" class="th-sort">Progresso <span class="sort-icon">{{ sortCol === 'progresso' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="marco in marcosOrdenados" :key="'t'+marco.id" @click="marcoDetalhe = marco" class="tabela-row-clicavel">
              <td class="td-id">M{{ marco.id }}</td>
              <td class="td-titulo">{{ marco.titulo }}</td>
              <td>{{ marco.pais }}</td>
              <td>{{ marco.prazo }}</td>
              <td><span :class="['tabela-badge', marco.estado]">{{ estadoLabel(marco.estado) }}</span></td>
              <td>
                <div class="tab-prog">
                  <div class="tab-prog-bg"><div class="tab-prog-fill" :style="{ width: marco.progresso+'%', background: corProgresso(marco.estado) }"></div></div>
                  <span>{{ marco.progresso }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="tabela-nota">A mostrar {{ marcosFiltrados.length }} de {{ marcos.length }} registos</p>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useAppStore } from '@/stores/app'
import { getMarcos } from '@/services/api.js'

Chart.register(...registerables)
const appStore = useAppStore()

const showExportModal = ref(false)
const marcoDetalhe = ref(null)
const filtroSetor = ref('todos')
const filtroEstado = ref('todos')
const heroVisible = ref(false)
const sortCol = ref('id')
const sortDir = ref('asc')

const contadorTotal = ref(0)
const contadorConcluidos = ref(0)
const contadorEmCurso = ref(0)
const contadorEmAtraso = ref(0)

let chartBarras = null
let chartDonut = null

const filtroPais = computed({
  get: () => appStore.paisSelecionado,
  set: (val) => appStore.setPais(val)
})

const filtrosActivos = computed(() => {
  let n = 0
  if (filtroPais.value !== 'todos') n++
  if (filtroSetor.value !== 'todos') n++
  if (filtroEstado.value !== 'todos') n++
  return n
})

const marcos = ref([])
const loading = ref(true)
const erro = ref(null)

const marcosFiltrados = computed(() => marcos.value.filter(m => {
  const paisMatch = filtroPais.value === 'todos' || m.paisCode === filtroPais.value
  const setorMatch = filtroSetor.value === 'todos' || m.setor === filtroSetor.value
  const estadoMatch = filtroEstado.value === 'todos' || m.estado === filtroEstado.value
  return paisMatch && setorMatch && estadoMatch
}))

const marcosOrdenados = computed(() => {
  return [...marcosFiltrados.value].sort((a, b) => {
    let valA = a[sortCol.value]
    let valB = b[sortCol.value]
    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()
    if (valA < valB) return sortDir.value === 'asc' ? -1 : 1
    if (valA > valB) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })
})

function ordenarPor(col) {
  if (sortCol.value === col) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = col
    sortDir.value = 'asc'
  }
}

function animarContador(ref, target, duration = 1500) {
  const start = performance.now()
  const update = (now) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    ref.value = Math.round(eased * target)
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

function estadoLabel(e) {
  return e === 'concluido' ? '✅ Concluído' : e === 'em_curso' ? '⏳ Em curso' : '⚠️ Em atraso'
}
function corProgresso(e) {
  return e === 'concluido' ? '#1a7a4a' : e === 'em_curso' ? '#e6a817' : '#931b18'
}
function overlayGradiente(s) {
  const cores = {
    digital: 'linear-gradient(to top, rgba(26,58,107,0.85) 0%, rgba(26,58,107,0.1) 60%)',
    clima: 'linear-gradient(to top, rgba(26,92,46,0.85) 0%, rgba(26,92,46,0.1) 60%)',
    saude: 'linear-gradient(to top, rgba(123,28,28,0.85) 0%, rgba(123,28,28,0.1) 60%)',
    educacao: 'linear-gradient(to top, rgba(107,58,26,0.85) 0%, rgba(107,58,26,0.1) 60%)',
    coesao: 'linear-gradient(to top, rgba(58,26,107,0.85) 0%, rgba(58,26,107,0.1) 60%)',
    infraestrutura: 'linear-gradient(to top, rgba(42,42,42,0.85) 0%, rgba(42,42,42,0.1) 60%)',
  }
  return cores[s] || 'linear-gradient(to top, rgba(147,27,24,0.85) 0%, rgba(147,27,24,0.1) 60%)'
}
function limparFiltros() {
  appStore.setPais('todos')
  filtroSetor.value = 'todos'
  filtroEstado.value = 'todos'
}

// SCROLL SUAVE
function scrollSmooth(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function criarGraficos() {
  const setores = ['digital', 'clima', 'saude', 'educacao', 'coesao', 'infraestrutura']
  const labels = ['💻 Digital', '🌿 Clima', '❤️ Saúde', '🎓 Educação', '👥 Coesão', '🏢 Infra']
  const progresso = setores.map(s => {
    const lst = marcosFiltrados.value.filter(m => m.setor === s)
    if (!lst.length) return 0
    return Math.round(lst.reduce((a, m) => a + m.progresso, 0) / lst.length)
  })

  // plugin para fundo branco ao exportar PNG
  const whiteBgPlugin = {
    id: 'whiteBg',
    beforeDraw(chart) {
      const ctx = chart.canvas.getContext('2d')
      ctx.save()
      ctx.globalCompositeOperation = 'destination-over'
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, chart.width, chart.height)
      ctx.restore()
    }
  }

  if (chartBarras) chartBarras.destroy()
  const ctxB = document.getElementById('graficoBarras')
  if (ctxB) {
    chartBarras = new Chart(ctxB, {
      type: 'bar',
      plugins: [whiteBgPlugin],
      data: {
        labels,
        datasets: [{
          label: 'Progresso médio (%)',
          data: progresso,
          backgroundColor: ['rgba(46,107,191,0.85)', 'rgba(46,158,82,0.85)', 'rgba(192,57,43,0.85)', 'rgba(191,126,46,0.85)', 'rgba(123,82,192,0.85)', 'rgba(85,85,85,0.85)'],
          borderRadius: 10,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1a1a2e', padding: 12, callbacks: { label: ctx => ` ${ctx.parsed.y}% de progresso médio neste pilar` } }
        },
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.06)' } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        }
      }
    })
  }

  if (chartDonut) chartDonut.destroy()
  const ctxD = document.getElementById('graficoDonut')
  if (ctxD) {
    chartDonut = new Chart(ctxD, {
      type: 'doughnut',
      plugins: [whiteBgPlugin],
      data: {
        labels: ['Concluído', 'Em Curso', 'Em Atraso'],
        datasets: [{
        data: [
          marcosFiltrados.value.filter(m => m.estado === 'concluido').length,
          marcosFiltrados.value.filter(m => m.estado === 'em_curso').length,
          marcosFiltrados.value.filter(m => m.estado === 'em_atraso').length,
        ],
          backgroundColor: ['#1a7a4a', '#e6a817', '#931b18'],
          borderWidth: 3, borderColor: '#fff', hoverOffset: 8,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        animation: { duration: 1500, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1a1a2e', padding: 12, callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} marcos (${Math.round(ctx.parsed / marcos.value.length * 100)}%)` } }
        }
      }
    })
  }
}

function exportarGrafico(id) {
  const canvas = document.getElementById(id)
  if (!canvas) return
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = `${id}.png`
  a.click()
}

function exportarDados(tipo) {
  const dados = marcosFiltrados.value
  let conteudo, mime, extensao
  if (tipo === 'csv') {
    conteudo = 'id,titulo,pais,setor,estado,prazo,progresso,investimento,beneficiarios\n' + dados.map(m => `${m.id},"${m.titulo}",${m.pais},${m.setor},${m.estado},${m.prazo},${m.progresso}%,"${m.investimento}","${m.beneficiarios}"`).join('\n')
    mime = 'text/csv'; extensao = 'csv'
  } else {
    conteudo = JSON.stringify(dados, null, 2)
    mime = 'application/json'; extensao = 'json'
  }
  const blob = new Blob([conteudo], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `marcos-metas.${extensao}`; a.click()
  URL.revokeObjectURL(url)
  showExportModal.value = false
}

onMounted(async () => {
  try {
    marcos.value = await getMarcos()
    erro.value = null
  } catch (e) {
    erro.value = 'Não foi possível carregar os dados. Verifica se o servidor está ligado.'
  } finally {
    loading.value = false
  }

  setTimeout(() => {
      heroVisible.value = true
      animarContador(contadorTotal, marcos.value.length)
      animarContador(contadorConcluidos, marcos.value.filter(m => m.estado === 'concluido').length)
      animarContador(contadorEmCurso, marcos.value.filter(m => m.estado === 'em_curso').length)
      animarContador(contadorEmAtraso, marcos.value.filter(m => m.estado === 'em_atraso').length)
      criarGraficos()
    }, 100)
})

watch(marcosFiltrados, () => criarGraficos())
</script>

<style scoped>
.marcos-container { margin: -2rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow-x: hidden; }

.hero { background-image: url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600'); background-size: cover; background-position: center; background-attachment: fixed; min-height: 70vh; }
.hero-overlay { background: linear-gradient(135deg, rgba(100,15,13,0.95) 0%, rgba(147,27,24,0.85) 100%); min-height: 70vh; display: flex; align-items: center; justify-content: space-between; padding: 70px 10%; gap: 50px; flex-wrap: wrap; }
.hero-left { flex: 1; min-width: 300px; opacity: 0; transform: translateX(-40px); transition: all 0.8s ease; }
.hero-left.animate-in { opacity: 1; transform: translateX(0); }
.hero-stats { opacity: 0; transform: translateX(40px); transition: all 0.8s ease 0.3s; }
.hero-stats.animate-in { opacity: 1; transform: translateX(0); }
.hero-badge { display: inline-block; background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.6); color: #d4af37; padding: 7px 18px; border-radius: 99px; font-size: 0.82rem; font-weight: 600; margin-bottom: 20px; letter-spacing: 0.03em; }
.hero-left h1 { font-size: 4rem; font-weight: 900; color: white; margin-bottom: 18px; line-height: 1; letter-spacing: -0.02em; }
.hero-accent { color: #d4af37; }
.hero-left p { font-size: 1rem; color: rgba(255,255,255,0.8); max-width: 480px; line-height: 1.8; margin-bottom: 32px; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-hero-primary { background: linear-gradient(135deg, #d4af37, #c49a28); color: #5a0f0f; border: none; padding: 14px 28px; border-radius: 10px; font-weight: 800; font-size: 0.92rem; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(212,175,55,0.3); }
.btn-hero-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(212,175,55,0.4); }
.btn-hero-outline { background: transparent; color: white; border: 2px solid rgba(255,255,255,0.6); padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 0.92rem; cursor: pointer; transition: all 0.3s; }
.btn-hero-outline:hover { border-color: white; background: rgba(255,255,255,0.1); }
.hero-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.hsc { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 24px 20px; text-align: center; backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 130px; transition: transform 0.3s, border-color 0.3s; cursor: default; }
.hsc:hover { transform: translateY(-4px); }
.hsc.verde { border-color: rgba(26,122,74,0.4); }
.hsc.amarelo { border-color: rgba(230,168,23,0.4); }
.hsc.vermelho { border-color: rgba(147,27,24,0.5); }
.hsc-icon-wrap { font-size: 1.8rem; }
.hsc-val { font-size: 2.5rem; font-weight: 900; color: #d4af37; line-height: 1; }
.hsc-label { font-size: 0.72rem; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.06em; }

/* FILTROS */
.filtros-section { background: white; padding: 16px 10%; box-shadow: 0 4px 20px rgba(0,0,0,0.08); position: sticky; top: 70px; z-index: 50; border-bottom: 1px solid #f0f0f0; }
.filtros-inner { display: flex; flex-direction: column; gap: 10px; }
.filtros-left { display: flex; align-items: center; gap: 12px; }
.filtros-titulo { font-size: 0.78rem; font-weight: 700; color: #931b18; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
.filtros-activos-badge { background: #931b18; color: white; font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 99px; animation: fadeInUp 0.3s ease; }
.filtros-grid { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
.filtro-item { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 120px; }
.filtro-item label { font-size: 0.68rem; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em; }
.filtro-item select { padding: 9px 12px; border: 1.5px solid #e8e8e8; border-radius: 8px; font-size: 0.84rem; cursor: pointer; background: #fafafa; color: #333; transition: all 0.2s; }
.filtro-item select:focus { outline: none; border-color: #931b18; background: white; }
.filtro-activo select { border-color: #931b18; background: #fdf2f2; color: #931b18; font-weight: 600; }
.filtro-activo label { color: #931b18; }
.btn-limpar { background: transparent; border: 1.5px solid #e0e0e0; color: #999; padding: 9px 16px; border-radius: 8px; font-size: 0.82rem; cursor: pointer; font-weight: 600; transition: all 0.2s; white-space: nowrap; }
.btn-limpar:hover { border-color: #931b18; color: #931b18; }
.btn-limpar-activo { border-color: #931b18; color: #931b18; background: #fdf2f2; }

/* GRÁFICOS */
.graficos-section { padding: 60px 10%; background: #f5f5f7; }
.graficos-titulo-area { text-align: center; margin-bottom: 35px; }
.graficos-titulo-area h2 { font-size: 2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 8px; }
.graficos-titulo-area p { font-size: 0.92rem; color: #aaa; max-width: 600px; margin: 0 auto; }
.graficos-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 25px; align-items: start; }
.grafico-card { background: white; border-radius: 24px; padding: 28px; box-shadow: 0 4px 30px rgba(0,0,0,0.07); }
.grafico-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.grafico-header h3 { font-size: 1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
.grafico-sub { font-size: 0.76rem; color: #aaa; line-height: 1.4; max-width: 300px; }
.btn-export-grafico { background: #f5f5f7; color: #931b18; border: none; padding: 7px 14px; border-radius: 8px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; flex-shrink: 0; }
.btn-export-grafico:hover { background: #931b18; color: white; }
.grafico-canvas-wrap { position: relative; height: 260px; }
.grafico-canvas-wrap canvas { width: 100% !important; height: 100% !important; }
.grafico-legenda-texto { font-size: 0.72rem; color: #bbb; margin-top: 12px; line-height: 1.5; font-style: italic; }
.donut-wrap { display: flex; flex-direction: column; gap: 20px; }
.donut-canvas-wrap { position: relative; height: 200px; }
.donut-canvas-wrap canvas { width: 100% !important; height: 100% !important; }
.donut-legenda { display: flex; flex-direction: column; gap: 10px; padding: 0 4px; }
.leg-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: #f9f9f9; border-radius: 10px; }
.leg-cor { width: 14px; height: 14px; border-radius: 4px; flex-shrink: 0; }
.leg-info { display: flex; justify-content: space-between; flex: 1; font-size: 0.84rem; }
.leg-info span { color: #666; }
.leg-info strong { color: #1a1a1a; }
.leg-total { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #931b18; border-radius: 10px; color: white; font-size: 0.84rem; font-weight: 600; }
.leg-total strong { font-size: 1rem; }

/* LISTA */
.lista-section { padding: 50px 10%; background: #f5f5f7; }
.lista-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
.lista-header h2 { font-size: 2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 5px; }
.lista-sub { font-size: 0.88rem; color: #aaa; }
.lista-filtro-info { color: #931b18; font-weight: 600; }
.lista-header-actions { display: flex; gap: 10px; }
.btn-scroll-tabela { background: white; color: #931b18; border: 1.5px solid #e0e0e0; padding: 11px 18px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-scroll-tabela:hover { border-color: #931b18; background: #fdf2f2; }
.btn-export-lista { background: #931b18; color: white; border: none; padding: 11px 22px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-export-lista:hover { background: #6b1210; transform: translateY(-2px); }

/* EMPTY */
.empty-state { text-align: center; padding: 80px 20px; background: white; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
.empty-icon { font-size: 4rem; display: block; margin-bottom: 20px; }
.empty-state h3 { font-size: 1.4rem; color: #333; margin-bottom: 10px; font-weight: 700; }
.empty-state p { color: #888; margin-bottom: 25px; }
.btn-limpar-empty { background: #931b18; color: white; border: none; padding: 12px 28px; border-radius: 10px; cursor: pointer; font-weight: 700; }

/* CARDS */
.marcos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 24px; }
.marco-card { background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: transform 0.35s ease, box-shadow 0.35s ease; animation: fadeInUp 0.6s ease both; }
.marco-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.14); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.marco-img-wrap { position: relative; height: 200px; overflow: hidden; }
.marco-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.marco-card:hover .marco-img { transform: scale(1.08); }
.marco-img-overlay { position: absolute; inset: 0; }
.marco-img-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 14px; display: flex; justify-content: space-between; align-items: flex-end; }
.marco-setor-pill { font-size: 0.72rem; font-weight: 700; color: white; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.3); padding: 4px 10px; border-radius: 99px; }
.estado-pill { font-size: 0.7rem; font-weight: 700; padding: 5px 11px; border-radius: 99px; }
.estado-pill.concluido { background: rgba(26,122,74,0.9); color: white; }
.estado-pill.em_curso { background: rgba(230,168,23,0.9); color: white; }
.estado-pill.em_atraso { background: rgba(147,27,24,0.9); color: white; }
.marco-pais-badge { position: absolute; top: 12px; left: 12px; font-size: 0.7rem; font-weight: 700; color: white; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); padding: 4px 10px; border-radius: 99px; }
.marco-body { padding: 20px 22px 22px; }
.marco-titulo { font-size: 1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; line-height: 1.4; }
.marco-desc { font-size: 0.82rem; color: #888; line-height: 1.6; margin-bottom: 14px; }
.marco-meta { margin-bottom: 14px; }
.meta-item { font-size: 0.8rem; color: #666; }
.progresso-wrapper { margin-bottom: 16px; }
.progresso-header { display: flex; justify-content: space-between; font-size: 0.76rem; color: #aaa; margin-bottom: 6px; }
.progresso-bg { height: 8px; background: #f0f0f0; border-radius: 99px; overflow: hidden; }
.progresso-fill { height: 100%; border-radius: 99px; transition: width 0.8s ease; }
.marco-footer { display: flex; justify-content: space-between; align-items: center; }
.btn-detalhe { background: #f5f5f7; color: #931b18; border: none; padding: 8px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-detalhe:hover { background: #931b18; color: white; }
.marco-dl { display: flex; flex-direction: column; align-items: center; cursor: pointer; color: #931b18; transition: transform 0.2s; }
.marco-dl:hover { transform: translateY(-2px); }
.dl-icon { font-size: 1.4rem; }
.marco-dl small { font-size: 0.6rem; font-weight: 800; }

/* TABELA */
.tabela-section { padding: 50px 10%; background: white; }
.tabela-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
.tabela-header h2 { font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
.tabela-sub { font-size: 0.88rem; color: #aaa; }
.tabela-btns { display: flex; gap: 10px; }
.btn-csv { background: #1a7a4a; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-csv:hover { background: #145c38; transform: translateY(-2px); }
.btn-json { background: #2e6bbf; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-json:hover { background: #1a4e9a; transform: translateY(-2px); }
.tabela-wrap { overflow-x: auto; border-radius: 16px; border: 1px solid #f0f0f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.tabela { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
.tabela thead tr { background: linear-gradient(135deg, #931b18, #6b1210); }
.th-sort { padding: 15px 18px; text-align: left; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: white; cursor: pointer; user-select: none; white-space: nowrap; transition: background 0.2s; }
.th-sort:hover { background: rgba(255,255,255,0.15); }
.sort-icon { opacity: 0.6; margin-left: 4px; font-size: 0.8rem; }
.tabela-row-clicavel { border-bottom: 1px solid #f5f5f5; transition: background 0.15s; cursor: pointer; }
.tabela-row-clicavel:hover { background: #fdf2f2; }
.tabela-row-clicavel:last-child { border-bottom: none; }
.td-id { font-weight: 700; color: #931b18; }
.td-titulo { font-weight: 500; color: #333; }
.tabela td { padding: 14px 18px; color: #555; }
.tabela-badge { font-size: 0.72rem; font-weight: 700; padding: 5px 11px; border-radius: 99px; }
.tabela-badge.concluido { background: #d4edda; color: #155724; }
.tabela-badge.em_curso { background: #fff3cd; color: #856404; }
.tabela-badge.em_atraso { background: #f8d7da; color: #721c24; }
.tab-prog { display: flex; align-items: center; gap: 10px; }
.tab-prog-bg { flex: 1; height: 6px; background: #f0f0f0; border-radius: 99px; overflow: hidden; min-width: 80px; }
.tab-prog-fill { height: 100%; border-radius: 99px; transition: width 0.6s ease; }
.tabela-nota { font-size: 0.78rem; color: #bbb; padding: 12px 18px; }

/* MODAL DETALHE */
.detalhe-card { background: white; width: 90%; max-width: 580px; border-radius: 24px; overflow: hidden; position: relative; box-shadow: 0 25px 60px rgba(0,0,0,0.4); animation: fadeInUp 0.3s ease; max-height: 90vh; overflow-y: auto; }
.close-btn-detalhe { position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.4); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; font-size: 1rem; cursor: pointer; z-index: 10; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.close-btn-detalhe:hover { background: rgba(0,0,0,0.7); }
.detalhe-img-wrap { position: relative; height: 220px; flex-shrink: 0; }
.detalhe-img { width: 100%; height: 100%; object-fit: cover; }
.detalhe-img-overlay { position: absolute; inset: 0; }
.detalhe-img-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 14px 18px; display: flex; justify-content: space-between; align-items: flex-end; }
.detalhe-body { padding: 28px; }
.detalhe-meta { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
.tag-pais, .tag-prazo { font-size: 0.78rem; font-weight: 600; color: #666; background: #f5f5f7; padding: 4px 12px; border-radius: 99px; }
.detalhe-titulo { font-size: 1.4rem; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; line-height: 1.3; }
.detalhe-desc { font-size: 0.88rem; color: #777; line-height: 1.7; margin-bottom: 20px; }
.detalhe-progresso { margin-bottom: 24px; }
.detalhe-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; background: #f9f9f9; border-radius: 14px; padding: 16px; }
.dstat { display: flex; flex-direction: column; gap: 4px; }
.dstat-full { grid-column: 1 / -1; }
.dstat-label { font-size: 0.68rem; font-weight: 700; color: #bbb; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
.dstat-val { font-size: 0.88rem; font-weight: 600; color: #333; line-height: 1.4; }
.dstat-highlight { color: #931b18; font-size: 1rem; font-weight: 800; }
.detalhe-actions { display: flex; gap: 10px; }
.btn-export-detalhe { flex: 1; background: #931b18; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; }
.btn-export-detalhe:hover { background: #6b1210; }
.btn-fechar-detalhe { background: #f5f5f7; color: #666; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; }
.btn-fechar-detalhe:hover { background: #e8e8e8; }

/* MODAL EXPORTAÇÃO */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.75); display: flex; justify-content: center; align-items: center; z-index: 3000; }
.export-card { background-color: #931b18; width: 90%; max-width: 400px; padding: 40px; border-radius: 20px; position: relative; color: white; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
.close-btn { position: absolute; top: 15px; right: 20px; background: transparent; border: none; color: white; font-size: 1.6rem; cursor: pointer; opacity: 0.8; }
.close-btn:hover { opacity: 1; }
.main-download-icon { font-size: 3.5rem; display: block; margin-bottom: 10px; }
.export-header h2 { font-size: 1.8rem; margin-bottom: 8px; }
.export-header p { font-size: 0.95rem; margin-bottom: 30px; opacity: 0.9; }
.export-options { display: flex; flex-direction: column; gap: 12px; }
.export-item { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; padding: 15px 20px; color: white; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.3s; }
.export-item:hover { background: rgba(255,255,255,0.2); }
.export-item .ext { opacity: 0.5; font-family: monospace; font-size: 0.85rem; }
.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; gap: 16px; color: #888; font-size: 0.9rem; }
.loading-spinner { width: 40px; height: 40px; border: 3px solid #f0f0f0; border-top-color: #931b18; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.erro-state { background: #fdf2f2; border: 1px solid #f8d7da; border-radius: 16px; padding: 20px 30px; margin: 20px 10%; display: flex; align-items: center; gap: 12px; color: #721c24; font-size: 0.9rem; }
</style>