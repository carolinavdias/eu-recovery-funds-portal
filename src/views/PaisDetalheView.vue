<template>
  <div class="detalhe-container">

    <!-- MODAL DE EXPORTAÇÃO -->
    <div v-if="showExportModal" class="modal-overlay" @click.self="showExportModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showExportModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📥</span>
          <h2>{{ appStore.t.pais_detalhe_exportar_titulo }}</h2>
          <p>{{ appStore.t.pais_detalhe_exportar_desc }}</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="exportarDados('csv')"><span>{{ appStore.t.pais_detalhe_exportar_csv }}</span><span class="ext">.csv</span></button>
          <button class="export-item" @click="exportarDados('json')"><span>{{ appStore.t.pais_detalhe_exportar_json }}</span><span class="ext">.json</span></button>
          <button class="export-item" @click="exportarDados('pdf')"><span>{{ appStore.t.pais_detalhe_exportar_pdf }}</span><span class="ext">.pdf</span></button>
        </div>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>{{ appStore.t.pais_detalhe_loading }}</p>
    </div>

    <!-- ERRO -->
    <div v-if="erro" class="erro-state">
      <span>⚠️</span><p>{{ erro }}</p>
    </div>

    <template v-if="paisRaw && !loading">

      <!-- HERO -->
      <section class="hero" :style="{ backgroundImage: `url(${paisRaw.imagem})` }">
        <div class="hero-overlay">
          <div class="hero-left" :class="{ 'animate-in': heroVisible }">
            <RouterLink to="/paises" class="btn-voltar">{{ appStore.t.pais_detalhe_voltar }}</RouterLink>
            <div class="hero-bandeira">{{ paisRaw.bandeira }}</div>
            <h1>{{ paisTraduzido.nome }}</h1>
            <p>🏛️ {{ paisTraduzido.capital }} · 👥 {{ paisTraduzido.populacao }}</p>
            <div class="hero-fundos">💶 {{ paisTraduzido.totalFundos }} {{ appStore.t.pais_detalhe_alocados }}</div>
          </div>
          <div class="hero-stats" :class="{ 'animate-in': heroVisible }">
            <div class="hsc">
              <span class="hsc-icon">🎯</span>
              <span class="hsc-val">{{ marcosStats.total }}</span>
              <span class="hsc-label">{{ appStore.t.pais_detalhe_marcos_totais }}</span>
            </div>
            <div class="hsc verde">
              <span class="hsc-icon">✅</span>
              <span class="hsc-val">{{ marcosStats.concluidos }}</span>
              <span class="hsc-label">{{ appStore.t.pais_detalhe_concluidos }}</span>
            </div>
            <div class="hsc amarelo">
              <span class="hsc-icon">⏳</span>
              <span class="hsc-val">{{ marcosStats.total - marcosStats.concluidos }}</span>
              <span class="hsc-label">{{ appStore.t.pais_detalhe_em_curso }}</span>
            </div>
            <div class="hsc azul">
              <span class="hsc-icon">📊</span>
              <span class="hsc-val">{{progressoCalculado }}%</span>
              <span class="hsc-label">{{ appStore.t.pais_detalhe_progresso }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- BARRA DE PROGRESSO GLOBAL -->
      <section class="progresso-global" v-if="!loading && marcosRaw.length">
        <div class="pg-inner">
          <div class="pg-info">
            <span>{{ appStore.t.pais_detalhe_progresso_geral }} {{ paisTraduzido.nome }}</span>
            <strong :style="{ color: corProgresso(progressoCalculado) }">{{ progressoCalculado }}%</strong>
          </div>
          <div class="pg-bar-bg">
            <div class="pg-bar-fill" :style="{ width: progressoCalculado + '%', background: corProgresso(progressoCalculado) }"></div>
          </div>
        </div>
      </section>

      <!-- MARCOS DESTE PAÍS -->
      <section class="marcos-section">
        <div class="section-header">
          <div>
            <h2>{{ appStore.t.pais_detalhe_marcos_metas }}</h2>
            <p class="section-sub">{{ marcosTraduzidos.length }} {{ appStore.t.pais_detalhe_marcos_registados }} {{ paisTraduzido.nome }}</p>
          </div>
          <RouterLink to="/marcos" class="btn-ver-todos">{{ appStore.t.pais_detalhe_ver_todos_marcos }}</RouterLink>
        </div>

        <div v-if="marcosTraduzidos.length === 0" class="empty-state">
          <span class="empty-icon">📋</span>
          <p>{{ appStore.t.pais_detalhe_sem_marcos_desc }}</p>
        </div>

        <div v-else class="marcos-grid">
          <div v-for="marco in marcosTraduzidos" :key="marco.id" class="marco-card">
            <div class="marco-img-wrap">
              <img :src="marco.imagem" :alt="marco.titulo" class="marco-img" />
              <div class="marco-overlay"></div>
              <div class="marco-pills">
                <span class="setor-pill">{{ marco.setorLabel }}</span>
                <span :class="['estado-pill', marco.estado]">{{ estadoLabel(marco.estado) }}</span>
              </div>
              <div class="marco-pais-badge">{{ paisRaw.bandeira }} {{ paisTraduzido.nome }}</div>
            </div>
            <div class="marco-body">
              <h3>{{ marco.titulo }}</h3>
              <p>{{ marco.descricao }}</p>
              <div class="marco-meta">📅 {{ traduzirData(marco.prazo) }} · 💶 {{ marco.investimento }}</div>
              <div class="progresso-wrap">
                <div class="progresso-header">
                  <span>{{ appStore.t.pais_detalhe_progresso_label }}</span>
                  <strong :style="{ color: corProgresso(marco.progresso) }">{{ marco.progresso }}%</strong>
                </div>
                <div class="prog-bg">
                  <div class="prog-fill" :style="{ width: marco.progresso + '%', background: corProgresso(marco.progresso) }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DESEMBOLSOS DESTE PAÍS -->
      <section class="desembolsos-section">
        <div class="section-header">
          <div>
            <h2>{{ appStore.t.pais_detalhe_desembolsos_titulo }}</h2>
            <p class="section-sub">{{ desembolsosTraduzidos.length }} {{ appStore.t.pais_detalhe_desembolsos_sub }} {{ paisTraduzido.nome }}</p>
          </div>
          <RouterLink to="/desembolsos" class="btn-ver-todos">{{ appStore.t.pais_detalhe_ver_desembolsos }}</RouterLink>
        </div>

        <div v-if="desembolsosTraduzidos.length === 0" class="empty-state">
          <span class="empty-icon">💶</span>
          <h3>{{ appStore.t.pais_detalhe_sem_desembolsos_titulo }}</h3>
          <p>{{ appStore.t.pais_detalhe_erro_sem_desembolsos }}</p>
        </div>

        <div v-else class="tabela-wrap">
          <table class="tabela">
            <thead>
              <tr>
                <th>{{ appStore.t.pais_detalhe_tabela_data }}</th>
                <th>{{ appStore.t.pais_detalhe_tabela_tipologia }}</th>
                <th>{{ appStore.t.pais_detalhe_tabela_descricao }}</th>
                <th>{{ appStore.t.pais_detalhe_tabela_montante }}</th>
                <th>{{ appStore.t.pais_detalhe_tabela_estado }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in desembolsosTraduzidos" :key="d.id">
                <td>{{ formatarData(d.data) }}</td>
                <td><span class="tipo-badge">{{ traduzirTipologia(d.tipologia) }}</span></td>
                <td>{{ d.descricaoCurta }}</td>
                <td class="montante">{{ formatarMontante(d.montante) }}</td>
                <td><span :class="['estado-badge', estadoDesembolsoClass(d.estado)]">{{ estadoDesembolsoLabel(d.estado) }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- BOTÕES DE AÇÃO -->
      <section class="acoes-section">
        <RouterLink to="/paises" class="btn-acao-outline">{{ appStore.t.pais_detalhe_voltar_paises }}</RouterLink>
        <RouterLink to="/paises/comparar" class="btn-acao-primary">{{ appStore.t.pais_detalhe_comparar }}</RouterLink>
        <button class="btn-ver-todos" @click="showExportModal = true">📥 {{ appStore.t.pais_detalhe_exportar_titulo }}</button>
      </section>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPaisByCode, getMarcosByPais, getDesembolsosByPais } from '@/services/api.js'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const route = useRoute()
const paisRaw = ref(null)
const marcosRaw = ref([])
const desembolsosRaw = ref([])
const loading = ref(true)
const erro = ref(null)
const heroVisible = ref(false)
const showExportModal = ref(false)

// Dados traduzidos (reativos ao idioma)
const paisTraduzido = computed(() => {
  if (!paisRaw.value) return {}
  const isPt = appStore.idioma === 'pt'
  return {
    nome: isPt ? paisRaw.value.nome_pt : paisRaw.value.nome_en,
    capital: isPt ? paisRaw.value.capital_pt : paisRaw.value.capital_en,
    populacao: isPt ? paisRaw.value.populacao_pt : paisRaw.value.populacao_en,
    totalFundos: isPt ? paisRaw.value.totalFundos_pt : paisRaw.value.totalFundos_en,
  }
})

const marcosTraduzidos = computed(() => {
  const isPt = appStore.idioma === 'pt'
  return marcosRaw.value.map(m => ({
    ...m,
    titulo: isPt ? m.titulo_pt : m.titulo_en,
    descricao: isPt ? m.descricao_pt : m.descricao_en,
    setorLabel: isPt ? m.setorLabel_pt : m.setorLabel_en,
    investimento: isPt ? m.investimento_pt : m.investimento_en,
  }))
})

const desembolsosTraduzidos = computed(() => {
  const isPt = appStore.idioma === 'pt'
  return desembolsosRaw.value.map(d => ({
    ...d,
    descricaoCurta: isPt ? (d.descricaoCurta_pt || d.descricaoCurta || d.descricao || '—')
                         : (d.descricaoCurta_en || d.descricaoCurta || d.descricao || '—'),
  }))
})

const marcosStats = computed(() => {
  const items = marcosRaw.value || []
  const total = items.length
  const concluidos = items.filter(m => m.estado === 'concluido').length
  return { total, concluidos }
})

const progressoCalculado = computed(() => {
  const total = marcosStats.value.total
  const concluidos = marcosStats.value.concluidos
  // Garantir que não há divisão por zero e que os valores são números
  if (total === 0 || isNaN(total) || isNaN(concluidos)) return 0
  return Math.round((concluidos / total) * 100)
})

function corProgresso(p) {
  const val = typeof p === 'number' && !isNaN(p) ? p : 0
  if (val >= 80) return '#1a7a4a'
  if (val >= 40) return '#e6a817'
  if (val === 0) return '#aaa'
  return '#931b18'
}

function estadoLabel(e) {
  if (e === 'concluido') return appStore.t.estado_concluido
  if (e === 'em_curso') return appStore.t.estado_em_curso
  return appStore.t.estado_em_atraso
}

function estadoDesembolsoLabel(estado) {
  if (!estado) return '—'
  const estadoMap = {
    'Pago': appStore.t.desembolso_estado_pago,
    'Em Avaliação': appStore.t.desembolso_estado_avaliacao,
    'Planeado': appStore.t.desembolso_estado_planeado
  }
  return estadoMap[estado] || estado
}

function estadoDesembolsoClass(estado) {
  if (estado === 'Pago') return 'concluido'
  if (estado === 'Em Avaliação') return 'em_curso'
  if (estado === 'Planeado') return 'planeado'
  return ''
}

function formatarData(dataStr) {
  const data = new Date(dataStr)
  return data.toLocaleDateString(appStore.idioma === 'pt' ? 'pt-PT' : 'en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

function formatarMontante(v) {
  if (v >= 1e9) return '€' + (v / 1e9).toFixed(1) + 'B'
  if (v >= 1e6) return '€' + (v / 1e6).toFixed(1) + 'M'
  return '€' + (v / 1e3).toFixed(0) + 'k'
}

function traduzirTipologia(tipologia) {
  if (appStore.idioma === 'pt') return tipologia
  if (tipologia === 'Subvenção') return appStore.t.tipo_subvencao || 'Grant'
  if (tipologia === 'Empréstimo') return appStore.t.tipo_emprestimo || 'Loan'
  if (tipologia === 'Misto') return appStore.t.tipo_misto || 'Mixed'
  return tipologia
}

function traduzirData(dataStr) {
  if (!dataStr) return ''
  if (appStore.idioma !== 'en') return dataStr
  const mesesPt = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const mesesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let resultado = dataStr
  for (let i = 0; i < mesesPt.length; i++) {
    resultado = resultado.replace(mesesPt[i], mesesEn[i])
  }
  return resultado
}

function downloadBlob(content, mime, filename) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function exportarDados(tipo) {
  const isPt = appStore.idioma === 'pt'
  const paisNome = paisTraduzido.value.nome
  const dadosMarcos = marcosTraduzidos.value
  const dadosDesembolsos = desembolsosTraduzidos.value

  if (tipo === 'csv') {
    let csv = `${isPt ? 'Relatório do País' : 'Country Report'} - ${paisNome}\n\n`
    csv += `${isPt ? 'INDICADORES' : 'INDICATORS'}\n`
    csv += `${isPt ? 'Total de Marcos' : 'Total Milestones'},${paisRaw.value.marcosTotal}\n`
    csv += `${isPt ? 'Marcos Concluídos' : 'Completed Milestones'},${paisRaw.value.marcosConcluidos}\n`
    csv += `${isPt ? 'Progresso' : 'Progress'},${paisRaw.value.progresso}%\n\n`
    csv += `${isPt ? 'MARCOS' : 'MILESTONES'}\n`
    csv += `ID,${isPt ? 'Título' : 'Title'},${isPt ? 'Descrição' : 'Description'},${isPt ? 'Setor' : 'Sector'},${isPt ? 'Estado' : 'Status'},${isPt ? 'Prazo' : 'Deadline'},${isPt ? 'Progresso' : 'Progress'},${isPt ? 'Investimento' : 'Investment'}\n`
    dadosMarcos.forEach(m => {
      csv += `${m.id},"${m.titulo.replace(/"/g, '""')}","${m.descricao.replace(/"/g, '""')}",${m.setorLabel},${estadoLabel(m.estado)},${traduzirData(m.prazo)},${m.progresso}%,"${m.investimento}"\n`
    })
    csv += `\n${isPt ? 'DESEMBOLSOS' : 'DISBURSEMENTS'}\n`
    csv += `${isPt ? 'Data' : 'Date'},${isPt ? 'Tipologia' : 'Type'},${isPt ? 'Descrição' : 'Description'},${isPt ? 'Montante' : 'Amount'},${isPt ? 'Estado' : 'Status'}\n`
    dadosDesembolsos.forEach(d => {
      csv += `${formatarData(d.data)},${traduzirTipologia(d.tipologia)},"${d.descricaoCurta.replace(/"/g, '""')}",${formatarMontante(d.montante)},${estadoDesembolsoLabel(d.estado)}\n`
    })
    downloadBlob(csv, 'text/csv', `${paisRaw.value.code}_dados.csv`)
  } 
  else if (tipo === 'json') {
    const exportObj = {
      pais: {
        nome: paisNome,
        capital: paisTraduzido.value.capital,
        populacao: paisTraduzido.value.populacao,
        totalFundos: paisTraduzido.value.totalFundos,
        marcosTotal: paisRaw.value.marcosTotal,
        marcosConcluidos: paisRaw.value.marcosConcluidos,
        progresso: paisRaw.value.progresso
      },
      marcos: dadosMarcos.map(m => ({
        id: m.id,
        titulo: m.titulo,
        descricao: m.descricao,
        setor: m.setorLabel,
        estado: estadoLabel(m.estado),
        prazo: traduzirData(m.prazo),
        progresso: m.progresso,
        investimento: m.investimento
      })),
      desembolsos: dadosDesembolsos.map(d => ({
        data: d.data,
        dataFormatada: formatarData(d.data),
        tipologia: traduzirTipologia(d.tipologia),
        descricao: d.descricaoCurta,
        montante: d.montante,
        montanteFormatado: formatarMontante(d.montante),
        estado: estadoDesembolsoLabel(d.estado)
      }))
    }
    const json = JSON.stringify(exportObj, null, 2)
    downloadBlob(json, 'application/json', `${paisRaw.value.code}_dados.json`)
  } 
  else if (tipo === 'pdf') {
    const win = window.open('', '_blank')
    if (!win || win.closed || typeof win.closed === 'undefined') {
      alert(isPt ? 'O navegador bloqueou a janela de impressão. Permita pop-ups para este site.' : 'The browser blocked the print window. Please allow pop-ups for this site.')
      return
    }
    win.document.write(`
      <html>
        <head>
          <title>${paisNome} - ${isPt ? 'Dados do PRR' : 'RRP Data'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #931b18; }
            h2 { margin-top: 30px; color: #2e6bbf; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 25px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
            th { background-color: #931b18; color: white; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <h1>${paisNome} - ${isPt ? 'Dados do PRR' : 'RRP Data'}</h1>
          <h2>${isPt ? 'Indicadores Gerais' : 'General Indicators'}</h2>
          <table>
            <tr><th>${isPt ? 'Total de Marcos' : 'Total Milestones'}</th><td>${paisRaw.value.marcosTotal}</td></tr>
            <tr><th>${isPt ? 'Marcos Concluídos' : 'Completed Milestones'}</th><td>${paisRaw.value.marcosConcluidos}</td></tr>
            <tr><th>${isPt ? 'Progresso' : 'Progress'}</th><td>${paisRaw.value.progresso}%</td></tr>
          </table>
          <h2>${isPt ? 'Marcos e Metas' : 'Milestones & Targets'}</h2>
          <table>
            <thead><tr><th>ID</th><th>${isPt ? 'Título' : 'Title'}</th><th>${isPt ? 'Setor' : 'Sector'}</th><th>${isPt ? 'Estado' : 'Status'}</th><th>${isPt ? 'Prazo' : 'Deadline'}</th><th>${isPt ? 'Progresso' : 'Progress'}</th><th>${isPt ? 'Investimento' : 'Investment'}</th></tr></thead>
            <tbody>
              ${dadosMarcos.map(m => `<tr><td>M${m.id}</td><td>${m.titulo}</td><td>${m.setorLabel}</td><td>${estadoLabel(m.estado)}</td><td>${traduzirData(m.prazo)}</td><td>${m.progresso}%</td><td>${m.investimento}</td></tr>`).join('')}
            </tbody>
          </table>
          <h2>${isPt ? 'Desembolsos' : 'Disbursements'}</h2>
          <table>
            <thead><tr><th>${isPt ? 'Data' : 'Date'}</th><th>${isPt ? 'Tipologia' : 'Type'}</th><th>${isPt ? 'Descrição' : 'Description'}</th><th>${isPt ? 'Montante' : 'Amount'}</th><th>${isPt ? 'Estado' : 'Status'}</th></tr></thead>
            <tbody>
              ${dadosDesembolsos.map(d => `<tr><td>${formatarData(d.data)}</td><td>${traduzirTipologia(d.tipologia)}</td><td>${d.descricaoCurta}</td><td>${formatarMontante(d.montante)}</td><td>${estadoDesembolsoLabel(d.estado)}</td></tr>`).join('')}
            </tbody>
          </table>
          <div class="footer">${isPt ? 'Documento gerado pelo Sistema de Monitorização do PRR em' : 'Generated by the PRR Monitoring System on'} ${new Date().toLocaleString('pt-PT')}</div>
        </body>
      </html>
    `)
    win.document.close()
    win.print()
  }
  showExportModal.value = false
}

onMounted(async () => {
  try {
    const code = route.params.id
    const [paisData, marcosData, desembolsosData] = await Promise.all([
      getPaisByCode(code),
      getMarcosByPais(code),
      getDesembolsosByPais(code),
    ])
    if (!paisData) { erro.value = appStore.t.pais_detalhe_nao_encontrado; return }
    paisRaw.value = paisData
    marcosRaw.value = marcosData
    desembolsosRaw.value = desembolsosData
  } catch (e) {
    console.error(e)
    erro.value = appStore.t.pais_detalhe_erro
  } finally {
    loading.value = false
  }
  setTimeout(() => { heroVisible.value = true }, 100)
})

// Reacção à mudança de idioma – os computed já tratam da tradução, mas precisamos forçar re-renderização dos gráficos se houver.
// Como não há gráficos complexos, os computed são suficientes.
</script>

<style scoped>
/* (todo o CSS original mantém-se exactamente igual) */
.detalhe-container { margin: -2rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow-x: hidden; }

.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; gap: 16px; color: #888; }
.loading-spinner { width: 40px; height: 40px; border: 3px solid #f0f0f0; border-top-color: #931b18; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.erro-state { background: #fdf2f2; border: 1px solid #f8d7da; border-radius: 16px; padding: 20px 30px; margin: 20px 10%; display: flex; align-items: center; gap: 12px; color: #721c24; }

/* HERO */
.hero { background-size: cover; background-position: center; background-attachment: fixed; min-height: 65vh; }
.hero-overlay { background: linear-gradient(135deg, rgba(14,30,80,0.95) 0%, rgba(26,58,107,0.88) 100%); min-height: 65vh; display: flex; align-items: center; justify-content: space-between; padding: 60px 10%; gap: 50px; flex-wrap: wrap; }
.hero-left { flex: 1; min-width: 300px; opacity: 0; transform: translateX(-40px); transition: all 0.8s ease; }
.hero-left.animate-in { opacity: 1; transform: translateX(0); }
.hero-stats { opacity: 0; transform: translateX(40px); transition: all 0.8s ease 0.3s; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.hero-stats.animate-in { opacity: 1; transform: translateX(0); }
.btn-voltar { display: inline-block; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px; transition: color 0.2s; }
.btn-voltar:hover { color: white; }
.hero-bandeira { font-size: 4rem; margin-bottom: 10px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3)); }
.hero-left h1 { font-size: 3.5rem; font-weight: 900; color: white; margin-bottom: 10px; line-height: 1; }
.hero-left p { font-size: 0.95rem; color: rgba(255,255,255,0.75); margin-bottom: 16px; }
.hero-fundos { display: inline-block; background: rgba(212,175,55,0.2); border: 1px solid rgba(212,175,55,0.6); color: #d4af37; padding: 8px 18px; border-radius: 99px; font-size: 0.88rem; font-weight: 700; }
.hsc { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 22px 18px; text-align: center; backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 120px; transition: transform 0.3s; }
.hsc:hover { transform: translateY(-4px); }
.hsc.verde { border-color: rgba(26,122,74,0.4); }
.hsc.amarelo { border-color: rgba(230,168,23,0.4); }
.hsc.azul { border-color: rgba(46,107,191,0.4); }
.hsc-icon { font-size: 1.5rem; }
.hsc-val { font-size: 2rem; font-weight: 900; color: #d4af37; line-height: 1; }
.hsc-label { font-size: 0.7rem; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.06em; }

/* PROGRESSO GLOBAL */
.progresso-global { background: white; padding: 20px 10%; border-bottom: 1px solid #f0f0f0; }
.pg-inner { max-width: 100%; }
.pg-info { display: flex; justify-content: space-between; font-size: 0.85rem; color: #666; margin-bottom: 8px; }
.pg-bar-bg { height: 10px; background: #f0f0f0; border-radius: 99px; overflow: hidden; }
.pg-bar-fill { height: 100%; border-radius: 99px; transition: width 1s ease; }

/* MARCOS */
.marcos-section { padding: 50px 10%; background: #f5f5f7; }
.section-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; flex-wrap: wrap; gap: 12px; }
.section-header h2 { font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
.section-sub { font-size: 0.88rem; color: #aaa; }
.btn-ver-todos { background: #931b18; color: white; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; transition: all 0.2s; }
.btn-ver-todos:hover { background: #6b1210; transform: translateY(-2px); }

.empty-state { text-align: center; padding: 60px; background: white; border-radius: 20px; }
.empty-icon { font-size: 3rem; display: block; margin-bottom: 15px; }
.empty-state h3 { font-size: 1.2rem; color: #333; margin-bottom: 8px; }
.empty-state p { color: #888; }

.marcos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 22px; }
.marco-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); transition: transform 0.3s, box-shadow 0.3s; }
.marco-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
.marco-img-wrap { position: relative; height: 160px; overflow: hidden; }
.marco-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.marco-card:hover .marco-img { transform: scale(1.08); }
.marco-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%); }
.marco-pills { position: absolute; bottom: 10px; left: 10px; right: 10px; display: flex; justify-content: space-between; }
.setor-pill { font-size: 0.7rem; font-weight: 700; color: white; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.3); padding: 3px 9px; border-radius: 99px; }
.estado-pill { font-size: 0.7rem; font-weight: 700; padding: 3px 9px; border-radius: 99px; }
.estado-pill.concluido { background: rgba(26,122,74,0.9); color: white; }
.estado-pill.em_curso { background: rgba(230,168,23,0.9); color: white; }
.estado-pill.em_atraso { background: rgba(147,27,24,0.9); color: white; }
.marco-pais-badge { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); padding: 4px 10px; border-radius: 99px; font-size: 0.7rem; font-weight: 700; color: white; display: flex; align-items: center; gap: 5px; }
.marco-body { padding: 18px 20px; }
.marco-body h3 { font-size: 0.95rem; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; line-height: 1.4; }
.marco-body p { font-size: 0.8rem; color: #888; line-height: 1.5; margin-bottom: 10px; }
.marco-meta { font-size: 0.78rem; color: #666; margin-bottom: 12px; }
.progresso-wrap { }
.progresso-header { display: flex; justify-content: space-between; font-size: 0.74rem; color: #aaa; margin-bottom: 5px; }
.prog-bg { height: 6px; background: #f0f0f0; border-radius: 99px; overflow: hidden; }
.prog-fill { height: 100%; border-radius: 99px; transition: width 0.8s ease; }

/* DESEMBOLSOS */
.desembolsos-section { padding: 50px 10%; background: white; }
.tabela-wrap { overflow-x: auto; border-radius: 16px; border: 1px solid #f0f0f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.tabela { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
.tabela thead tr { background: linear-gradient(135deg, #0e1e50, #2e6bbf); }
.tabela th { padding: 14px 18px; text-align: left; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: white; }
.tabela tbody tr { border-bottom: 1px solid #f5f5f5; transition: background 0.15s; }
.tabela tbody tr:hover { background: #f0f5ff; }
.tabela td { padding: 14px 18px; color: #555; }
.tipo-badge { background: #e6f1fb; color: #2e6bbf; font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 99px; }
.montante { font-weight: 700; color: #1a7a4a; font-size: 0.95rem; }
.estado-badge { font-size: 0.72rem; font-weight: 700; padding: 5px 11px; border-radius: 99px; }
.estado-badge.concluido { background: #d4edda; color: #155724; }
.estado-badge.em_curso { background: #fff3cd; color: #856404; }
.estado-badge.planeado { background: #e9ecef; color: #495057; }

/* AÇÕES */
.acoes-section { padding: 40px 10%; background: #f5f5f7; display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
.btn-acao-primary { background: #2e6bbf; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 0.92rem; transition: all 0.2s; }
.btn-acao-primary:hover { background: #1a4e9a; transform: translateY(-2px); }
.btn-acao-outline { background: white; color: #333; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 0.92rem; border: 1.5px solid #e0e0e0; transition: all 0.2s; }
.btn-acao-outline:hover { border-color: #2e6bbf; color: #2e6bbf; }
.btn-ver-todos { background: #931b18; color: white; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; transition: all 0.2s; display: inline-block; }
.btn-ver-todos:hover { background: #6b1210; transform: translateY(-2px); }

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
</style>