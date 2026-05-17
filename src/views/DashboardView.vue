<template>
  <div class="portal-container">

    <!-- ================= MODAL CARDS SUPERIORES ================= -->
    <div v-if="showExportModal" class="modal-overlay" @click.self="showExportModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showExportModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📥</span>
          <h2 class="modal-title-yellow">{{ t.modal_export_titulo }}</h2>
          <p>{{ t.modal_export_desc }}</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="executarDownload('csv')">
            <span>{{ t.modal_export_csv }}</span>
            <span class="ext">.csv</span>
          </button>
          <button class="export-item" @click="executarDownload('json')">
            <span>{{ t.modal_export_json }}</span>
            <span class="ext">.json</span>
          </button>
          <button class="export-item" @click="executarDownload('pdf')">
            <span>{{ t.modal_export_pdf }}</span>
            <span class="ext">.pdf</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL PILARES ================= -->
    <div v-if="showPilarModal" class="modal-overlay" @click.self="showPilarModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showPilarModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📥</span>
          <h2 class="modal-title-yellow">{{ t.modal_pilar_titulo }}</h2>
          <p>{{ pilarSelecionado.titulo }}</p>
        </div>
        <div class="pilar-detalhes-modal">
          <p><strong>{{ t.modal_pilar_meta_label }}</strong> {{ pilarSelecionado.meta }}</p>
          <p><strong>{{ t.modal_pilar_investimento_label }}</strong> {{ pilarSelecionado.investimento }}</p>
          <p><strong>{{ t.modal_pilar_impacto_label }}</strong> {{ pilarSelecionado.impacto }}</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="executarDownloadPilar('csv')">
            <span>{{ t.modal_export_csv }}</span>
            <span class="ext">.csv</span>
          </button>
          <button class="export-item" @click="executarDownloadPilar('json')">
            <span>{{ t.modal_export_json }}</span>
            <span class="ext">.json</span>
          </button>
          <button class="export-item" @click="executarDownloadPilar('pdf')">
            <span>{{ t.modal_export_pdf }}</span>
            <span class="ext">.pdf</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL ESTATÍSTICAS ================= -->
    <div v-if="showStatsModal" class="modal-overlay" @click.self="showStatsModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showStatsModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📥</span>
          <h2 class="modal-title-yellow">{{ t.modal_stats_titulo }}</h2>
          <p>{{ t.modal_stats_desc }}</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="exportarEstatisticas('csv')">
            <span>{{ t.modal_export_csv }}</span>
            <span class="ext">.csv</span>
          </button>
          <button class="export-item" @click="exportarEstatisticas('json')">
            <span>{{ t.modal_export_json }}</span>
            <span class="ext">.json</span>
          </button>
          <button class="export-item" @click="exportarEstatisticas('pdf')">
            <span>{{ t.modal_export_pdf }}</span>
            <span class="ext">.pdf</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ================= HERO ================= -->
    <section class="hero-ue">
      <div class="overlay">
        <h1>{{ t.hero_title }}</h1>
        <p>{{ t.hero_sub }}</p>
        <div class="button-group-main">
          <RouterLink to="/paises" class="btn-outline">{{ t.hero_btn_explorar }}</RouterLink>
          <a href="#sobre"><button class="btn-yellow">{{ t.hero_btn_saber }}</button></a>
          <a href="#pilares"><button class="btn-outline">{{ t.hero_btn_pilares }}</button></a>
        </div>
      </div>
    </section>

    <!-- ================= INTRO ================= -->
    <section id="sobre" class="intro">
      <h2>{{ t.intro_title }}</h2>
      <p class="intro-text">{{ t.intro_text }}</p>
      <div class="cards-grid">
        <div class="info-card">
          <div class="card-header">
            <div class="icon-circle">€</div>
            <div class="download-container" @click="abrirModalExportacao(t.card_investimento_title, t.card_investimento_desc, t.card_investimento_highlight_value)">
              <span class="download-icon">📥</span>
              <span class="download-text">{{ t.download_formats }}</span>
            </div>
          </div>
          <h3>{{ t.card_investimento_title }}</h3>
          <p>{{ t.card_investimento_desc }}</p>
          <p class="card-highlight">{{ t.card_investimento_highlight_label }} <span>{{ t.card_investimento_highlight_value }}</span></p>
        </div>
        <div class="info-card">
          <div class="card-header">
            <div class="icon-circle">🎯</div>
            <div class="download-container" @click="abrirModalExportacao(t.card_objetivos_title, t.card_objetivos_desc, t.card_objetivos_highlight_value)">
              <span class="download-icon">📥</span>
              <span class="download-text">{{ t.download_formats }}</span>
            </div>
          </div>
          <h3>{{ t.card_objetivos_title }}</h3>
          <p>{{ t.card_objetivos_desc }}</p>
          <p class="card-highlight">{{ t.card_objetivos_highlight_label }} <span>{{ t.card_objetivos_highlight_value }}</span></p>
        </div>
        <div class="info-card">
          <div class="card-header">
            <div class="icon-circle">📈</div>
            <div class="download-container" @click="abrirModalExportacao(t.card_crescimento_title, t.card_crescimento_desc, t.card_crescimento_highlight_value)">
              <span class="download-icon">📥</span>
              <span class="download-text">{{ t.download_formats }}</span>
            </div>
          </div>
          <h3>{{ t.card_crescimento_title }}</h3>
          <p>{{ t.card_crescimento_desc }}</p>
          <p class="card-highlight">{{ t.card_crescimento_highlight_label }} <span>{{ t.card_crescimento_highlight_value }}</span></p>
        </div>
      </div>
    </section>

    <!-- ================= IMPACTO ================= -->
    <section class="impacto">
      <div class="impacto-imagens">
        <div class="img-card img-topo">
          <img src="https://ctrlplay.com.br/wp-content/uploads/2020/04/ctrlplay_ctrlplay_image_223.jpeg" alt="Educação Digital" />
          <span class="img-label">Educação Digital</span>
        </div>
        <div class="img-card img-baixo">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRexNOIYL7Ap9dVYQbKcrkmDCkP47AoPYYg6g&s" alt="Saúde Moderna" />
          <span class="img-label">Saúde Moderna</span>
        </div>
      </div>
      <div class="impacto-conteudo">
        <h2>{{ t.impacto_title }}</h2>
        <div class="impacto-item">
          <div class="impacto-icone">🎓</div>
          <div>
            <p class="impacto-titulo">{{ t.impacto_educacao_titulo }}</p>
            <p class="impacto-desc">{{ t.impacto_educacao_desc }}</p>
          </div>
        </div>
        <div class="impacto-item">
          <div class="impacto-icone">🏠</div>
          <div>
            <p class="impacto-titulo">{{ t.impacto_habitacao_titulo }}</p>
            <p class="impacto-desc">{{ t.impacto_habitacao_desc }}</p>
          </div>
        </div>
        <div class="impacto-item">
          <div class="impacto-icone">🤍</div>
          <div>
            <p class="impacto-titulo">{{ t.impacto_saude_titulo }}</p>
            <p class="impacto-desc">{{ t.impacto_saude_desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= PILARES ================= -->
    <section id="pilares" class="pilares">
      <div class="pilares-header">
        <h2>{{ t.pilares_title }}</h2>
        <p>{{ t.pilares_sub }}</p>
      </div>
      <div class="pilares-grid">
        <!-- Clima -->
        <div class="pilar-card">
          <div class="pilar-image">
            <img src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600" alt="Clima">
            <div class="pilar-icon-float">🌿</div>
          </div>
          <div class="pilar-info">
            <div class="pilar-top">
              <h3>{{ t.pilar_climatica }}</h3>
              <div class="pilar-download" @click="abrirModalPilar(t.pilar_climatica, t.pilar_climatica_meta, t.pilar_climatica_investimento, t.pilar_climatica_impacto)">
                <span class="dl-icon">📥</span>
                <span class="dl-text">{{ t.download_formats }}</span>
              </div>
            </div>
            <div class="pilar-details">
              <p><strong>{{ t.modal_pilar_meta_label }}</strong> {{ t.pilar_climatica_meta }}</p>
              <p><strong>{{ t.modal_pilar_investimento_label }}</strong> {{ t.pilar_climatica_investimento }}</p>
              <p><strong>{{ t.modal_pilar_impacto_label }}</strong> {{ t.pilar_climatica_impacto }}</p>
            </div>
          </div>
        </div>
        <!-- Digital -->
        <div class="pilar-card">
          <div class="pilar-image">
            <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600" alt="Digital">
            <div class="pilar-icon-float">💻</div>
          </div>
          <div class="pilar-info">
            <div class="pilar-top">
              <h3>{{ t.pilar_digital }}</h3>
              <div class="pilar-download" @click="abrirModalPilar(t.pilar_digital, t.pilar_digital_meta, t.pilar_digital_investimento, t.pilar_digital_impacto)">
                <span class="dl-icon">📥</span>
                <span class="dl-text">{{ t.download_formats }}</span>
              </div>
            </div>
            <div class="pilar-details">
              <p><strong>{{ t.modal_pilar_meta_label }}</strong> {{ t.pilar_digital_meta }}</p>
              <p><strong>{{ t.modal_pilar_investimento_label }}</strong> {{ t.pilar_digital_investimento }}</p>
              <p><strong>{{ t.modal_pilar_impacto_label }}</strong> {{ t.pilar_digital_impacto }}</p>
            </div>
          </div>
        </div>
        <!-- Infraestruturas -->
        <div class="pilar-card">
          <div class="pilar-image">
            <img src="https://cdn1-www.bureauveritas.pt/sites/g/files/zypfnx751/files/styles/teaser_landing_1_desktop/public/2020-02/Infraestru.Transporte.jpg?h=29234840&itok=BU5mUpyM" alt="Infra">
            <div class="pilar-icon-float">🏢</div>
          </div>
          <div class="pilar-info">
            <div class="pilar-top">
              <h3>{{ t.pilar_infra }}</h3>
              <div class="pilar-download" @click="abrirModalPilar(t.pilar_infra, t.pilar_infra_meta, t.pilar_infra_investimento, t.pilar_infra_impacto)">
                <span class="dl-icon">📥</span>
                <span class="dl-text">{{ t.download_formats }}</span>
              </div>
            </div>
            <div class="pilar-details">
              <p><strong>{{ t.modal_pilar_meta_label }}</strong> {{ t.pilar_infra_meta }}</p>
              <p><strong>{{ t.modal_pilar_investimento_label }}</strong> {{ t.pilar_infra_investimento }}</p>
              <p><strong>{{ t.modal_pilar_impacto_label }}</strong> {{ t.pilar_infra_impacto }}</p>
            </div>
          </div>
        </div>
        <!-- Educação -->
        <div class="pilar-card">
          <div class="pilar-image">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5h3ACvYClsskA2hBgn1uNB03KXjqElVjkLZ7fl6x6buSGyjl6xaWrWUE6df9NZe_XchUw51oL2kx7nN82rAsFGlbVoHP9C05p1DVY6buhXzdIy7vp1lFETthEY6LiWl5jJ9apjkqF7SwI/s1600/043012-national-black-male-teacher.jpg" alt="Educação">
            <div class="pilar-icon-float">🎓</div>
          </div>
          <div class="pilar-info">
            <div class="pilar-top">
              <h3>{{ t.pilar_educacao }}</h3>
              <div class="pilar-download" @click="abrirModalPilar(t.pilar_educacao, t.pilar_educacao_meta, t.pilar_educacao_investimento, t.pilar_educacao_impacto)">
                <span class="dl-icon">📥</span>
                <span class="dl-text">{{ t.download_formats }}</span>
              </div>
            </div>
            <div class="pilar-details">
              <p><strong>{{ t.modal_pilar_meta_label }}</strong> {{ t.pilar_educacao_meta }}</p>
              <p><strong>{{ t.modal_pilar_investimento_label }}</strong> {{ t.pilar_educacao_investimento }}</p>
              <p><strong>{{ t.modal_pilar_impacto_label }}</strong> {{ t.pilar_educacao_impacto }}</p>
            </div>
          </div>
        </div>
        <!-- Coesão -->
        <div class="pilar-card">
          <div class="pilar-image">
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600" alt="Coesão">
            <div class="pilar-icon-float">👥</div>
          </div>
          <div class="pilar-info">
            <div class="pilar-top">
              <h3>{{ t.pilar_coesao }}</h3>
              <div class="pilar-download" @click="abrirModalPilar(t.pilar_coesao, t.pilar_coesao_meta, t.pilar_coesao_investimento, t.pilar_coesao_impacto)">
                <span class="dl-icon">📥</span>
                <span class="dl-text">{{ t.download_formats }}</span>
              </div>
            </div>
            <div class="pilar-details">
              <p><strong>{{ t.modal_pilar_meta_label }}</strong> {{ t.pilar_coesao_meta }}</p>
              <p><strong>{{ t.modal_pilar_investimento_label }}</strong> {{ t.pilar_coesao_investimento }}</p>
              <p><strong>{{ t.modal_pilar_impacto_label }}</strong> {{ t.pilar_coesao_impacto }}</p>
            </div>
          </div>
        </div>
        <!-- Saúde -->
        <div class="pilar-card">
          <div class="pilar-image">
            <img src="https://www.betha.com.br/blog/wp-content/uploads/2021/07/blog-25.jpg" alt="Saúde">
            <div class="pilar-icon-float">❤️</div>
          </div>
          <div class="pilar-info">
            <div class="pilar-top">
              <h3>{{ t.pilar_saude }}</h3>
              <div class="pilar-download" @click="abrirModalPilar(t.pilar_saude, t.pilar_saude_meta, t.pilar_saude_investimento, t.pilar_saude_impacto)">
                <span class="dl-icon">📥</span>
                <span class="dl-text">{{ t.download_formats }}</span>
              </div>
            </div>
            <div class="pilar-details">
              <p><strong>{{ t.modal_pilar_meta_label }}</strong> {{ t.pilar_saude_meta }}</p>
              <p><strong>{{ t.modal_pilar_investimento_label }}</strong> {{ t.pilar_saude_investimento }}</p>
              <p><strong>{{ t.modal_pilar_impacto_label }}</strong> {{ t.pilar_saude_impacto }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= DADOS E ESTATÍSTICAS ================= -->
    <section class="dados">
      <div class="dados-topo">
        <button class="btn-exportar-tudo" @click="abrirModalEstatisticas">{{ t.dados_exportar_tudo }}</button>
      </div>
      <h2>{{ t.dados_title }}</h2>
      <p class="dados-sub">{{ t.dados_sub }}</p>

      <div class="barras-card">
        <h3>{{ t.dados_areas_titulo }}</h3>
        <div class="barras-grid">
          <div class="barra-item" v-for="barra in dadosBarras" :key="barra.nome">
            <div class="barra-label-row">
              <span>{{ barra.nome }}</span>
              <span class="barra-valor">{{ barra.percentagem }}% — {{ barra.valor }}</span>
            </div>
            <div class="barra-bg">
              <div class="barra-fill" :style="{ width: barra.percentagem + '%' }"></div>
              <div class="barra-media"></div>
            </div>
          </div>
        </div>
        <p class="barras-nota">{{ t.dados_barras_nota }}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card" v-for="stat in dadosStats" :key="stat.label">
          <div class="stat-icone">{{ stat.icone }}</div>
          <div class="stat-valor">{{ stat.valor }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-desc">{{ stat.desc }}</div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

// ---- ESTADOS DOS MODAIS ----
const showExportModal = ref(false)
const showPilarModal = ref(false)
const showStatsModal = ref(false)

// ---- DADOS DOS CARDS SUPERIORES ----
const cardSelecionado = ref({ titulo: '', descricao: '', valor: '' })
const pilarSelecionado = ref({ titulo: '', meta: '', investimento: '', impacto: '' })

// ---- DADOS REATIVOS DAS BARRAS E STATS (ACEDEM DIRETAMENTE A store.t) ----
const dadosBarras = computed(() => [
  { nome: store.t.barra_climatica, percentagem: 37, valor: '€277,5 Mil milhões' },
  { nome: store.t.barra_educacao, percentagem: 12, valor: '€90 Mil milhões' },
  { nome: store.t.barra_digital, percentagem: 20, valor: '€150 Mil milhões' },
  { nome: store.t.barra_saude, percentagem: 8, valor: '€60 Mil milhões' },
  { nome: store.t.barra_infra, percentagem: 18, valor: '€135 Mil milhões' },
  { nome: store.t.barra_coesao, percentagem: 5, valor: '€37,5 Mil milhões' }
])

const dadosStats = computed(() => [
  { icone: '📈', valor: '€750', label: store.t.stat_investimento_label, desc: store.t.stat_investimento_desc },
  { icone: '👥', valor: '27', label: store.t.stat_paises_label, desc: store.t.stat_paises_desc },
  { icone: '🌿', valor: '37%', label: store.t.stat_verde_label, desc: store.t.stat_verde_desc },
  { icone: '⚡', valor: '20%', label: store.t.stat_digital_label, desc: store.t.stat_digital_desc }
])

const t = computed(() => store.t)   // ← isto sim mantém a reatividade

// ---- FUNÇÕES DOS MODAIS (usam t e o idioma da store para as datas) ----
function abrirModalExportacao(titulo, descricao, valor) {
  cardSelecionado.value = { titulo, descricao, valor }
  showExportModal.value = true
}

function executarDownload(formato) {
  const { titulo, descricao, valor } = cardSelecionado.value
  const dataGeracao = new Date().toLocaleDateString(store.idioma === 'pt' ? 'pt-PT' : 'en-GB')
  let conteudo = ''
  let mimeType = ''

  if (formato === 'csv') {
    conteudo = `Indicador;Descricao;Valor;Data\n${titulo};"${descricao}";"${valor}";${dataGeracao}`
    mimeType = 'text/csv;charset=utf-8'
  } else if (formato === 'json') {
    conteudo = JSON.stringify({ ...cardSelecionado.value, data: dataGeracao }, null, 2)
    mimeType = 'application/json'
  } else if (formato === 'pdf') {
    gerarPDF(
        titulo,
        descricao,
        valor,
        dataGeracao,
        store.t.modal_export_pdf_title,
        store.t.modal_export_pdf_description,
        store.t.modal_export_pdf_value,
        store.t.modal_export_pdf_generated
    )
    showExportModal.value = false
    return
  }

  const blob = new Blob([conteudo], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `PRR_${titulo.replace(/\s+/g, '_')}.${formato}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
  showExportModal.value = false
}

function gerarPDF(titulo, descricao, valor, data, labelRelatorio, labelDescricao, labelValor, labelGeradoEm) {
  const win = window.open('', '_blank')
  win.document.write(`
    <html>
      <body style="font-family:sans-serif; padding:40px;">
        <h1 style="color:#931b18;">${labelRelatorio}: ${titulo}</h1>
        <p><strong>${labelDescricao}:</strong> ${descricao}</p>
        <p><strong>${labelValor}:</strong> ${valor}</p>
        <hr>
        <p>${labelGeradoEm} ${data}</p>
      </body>
    </html>
  `)
  win.document.close()
  win.print()
}

function abrirModalPilar(titulo, meta, investimento, impacto) {
  pilarSelecionado.value = { titulo, meta, investimento, impacto }
  showPilarModal.value = true
}

function executarDownloadPilar(formato) {
  const { titulo, meta, investimento, impacto } = pilarSelecionado.value
  const dataGeracao = new Date().toLocaleDateString(store.idioma === 'pt' ? 'pt-PT' : 'en-GB')

  if (formato === 'csv') {
    const conteudo = `Pilar;Meta;Investimento;Impacto;Data\n${titulo};"${meta}";"${investimento}";"${impacto}";${dataGeracao}`
    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Pilar_${titulo.replace(/\s+/g, '_')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } else if (formato === 'json') {
    const dados = { titulo, meta, investimento, impacto, data: dataGeracao }
    const conteudo = JSON.stringify(dados, null, 2)
    const blob = new Blob([conteudo], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Pilar_${titulo.replace(/\s+/g, '_')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } else if (formato === 'pdf') {
    const win = window.open('', '_blank')
    win.document.write(`
      <html>
        <body style="font-family:sans-serif; padding:40px;">
          <h1 style="color:#931b18;">${store.t.modal_export_pdf_title}: ${titulo}</h1>
          <p><strong>${store.t.modal_pilar_meta_label}</strong> ${meta}</p>
          <p><strong>${store.t.modal_pilar_investimento_label}</strong> ${investimento}</p>
          <p><strong>${store.t.modal_pilar_impacto_label}</strong> ${impacto}</p>
          <hr>
          <p>${store.t.modal_export_pdf_generated} ${dataGeracao}</p>
        </body>
      </html>
    `)
    win.document.close()
    win.print()
  }
  showPilarModal.value = false
}

function abrirModalEstatisticas() {
  showStatsModal.value = true
}

function exportarEstatisticas(formato) {
  const dataGeracao = new Date().toLocaleDateString(store.idioma === 'pt' ? 'pt-PT' : 'en-GB')
  const areas = dadosBarras.value.map(b => ({
    nome: b.nome,
    percentagem: b.percentagem,
    valor: b.valor
  }))
  const stats = dadosStats.value.map(s => ({
    label: s.label,
    valor: s.valor,
    desc: s.desc
  }))
  const dadosCompletos = {
    dataGeracao,
    areasInvestimento: areas,
    indicadoresChave: stats
  }

  if (formato === 'csv') {
    let linhas = []
    linhas.push('Seção;Nome;Percentagem;Valor;Descrição')
    areas.forEach(b => {
      linhas.push(`Área de Investimento;${b.nome};${b.percentagem};${b.valor};-`)
    })
    stats.forEach(s => {
      linhas.push(`Indicador-Chave;${s.label};-;${s.valor};${s.desc}`)
    })
    const conteudo = linhas.join('\n')
    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Estatisticas_PRR_${dataGeracao.replace(/\//g, '-')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } 
  else if (formato === 'json') {
    const conteudo = JSON.stringify(dadosCompletos, null, 2)
    const blob = new Blob([conteudo], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Estatisticas_PRR_${dataGeracao.replace(/\//g, '-')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
  else if (formato === 'pdf') {
      const win = window.open('', '_blank')
      win.document.write(`
        <html>
          <head><title>${store.t.modal_stats_titulo}</title></head>
          <body style="font-family:sans-serif; padding:40px;">
            <h1 style="color:#931b18;">${store.t.modal_stats_titulo}</h1>
            <p>${store.t.modal_export_pdf_generated} ${dataGeracao}</p>
            <h2>${store.t.dados_areas_titulo}</h2>
            <table border="1" cellpadding="8" style="border-collapse:collapse; width:100%">
              <tr style="background:#931b18; color:white">
                <th>Área</th><th>Percentagem</th><th>Valor</th>
              </tr>
              ${areas.map(b => `<tr><td>${b.nome}</td><td>${b.percentagem}%</td><td>${b.valor}</td>`).join('')}
            </table>
            <h2>Indicadores‑Chave</h2>
            <table border="1" cellpadding="8" style="border-collapse:collapse; width:100%">
              <tr style="background:#931b18; color:white">
                <th>Indicador</th><th>Valor</th><th>Descrição</th>
              </tr>
              ${stats.map(s => `<tr><td>${s.label}</td><td>${s.valor}</td><td>${s.desc}</td></tr>`).join('')}
            </table>
          </body>
        </html>
      `)
      win.document.close()
      win.print()
  }
}
</script>

<style scoped>
html { scroll-behavior: smooth; }

.portal-container {
  margin: -2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-x: hidden;
}

.hero-ue {
  background-image: url('https://www.shutterstock.com/shutterstock/videos/3981582317/thumb/1.jpg?ip=x480');
  background-size: cover;
  background-position: center;
  background-attachment: fixed; 
  min-height: 72vh;
  position: relative;
}

.overlay {
  background-color: rgba(147, 27, 24, 0.92);
  min-height: 72vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 40px 20px;
}

.overlay h1 {
  font-size: 3.2rem;
  font-weight: bold;
  margin-bottom: 40px;
  color: white !important;
}

.overlay p {
  font-size: 1.2rem;
  margin-bottom: 80px;
}

.button-group-main {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-yellow, .btn-primary {
  background-color: #FFD700 !important;
  color: rgba(122, 22, 20, 1) !important;
  font-size: 1.0rem !important;
  font-weight: 900 !important;
  border: none !important;
  padding: 12px 35px;
  border-radius: 10px !important;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-yellow:hover, .btn-primary:hover {
  background-color: #e6b800 !important;
  transform: translateY(-3px);
}

.btn-outline, .btn-secondary {
  background: transparent !important;
  border: 2px solid white !important;
  color: white !important;
  font-size: 1.0rem !important;
  padding: 12px 30px;
  border-radius: 8px !important;
  margin: 0 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn-outline:hover, .btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-3px);
}

.intro {
  background-color: #ffffff;
  padding: 80px 10%;
  text-align: center;
}

.intro h2 {
  color: #931b18 !important;
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: bold;
}

.intro-text {
  max-width: 850px;
  margin: 0 auto 60px;
  line-height: 1.7;
  font-size: 1.1rem;
  color: #444;
}

.cards-grid {
  display: flex;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  justify-content: center;
}

.info-card {
  background-color: #fdf2f2;
  border-radius: 15px;
  padding: 35px;
  flex: 1;
  text-align: left;
  box-shadow: 0 10px 30px rgba(0,0,0,0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.12); 
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.icon-circle {
  background-color: #931b18;
  color: white;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}

.download-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.download-icon {
  font-size: 2rem !important;
  margin-bottom: 5px;
  cursor: pointer;
}

.modal-title-yellow {
  color: #FFD700 !important;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 1.8rem;
}

.download-text {
  font-size: 0.65rem;
  color: #931b18;
  font-weight: bold;
}

.info-card h3 {
  color: #931b18 !important;
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: bold;
}

.info-card p {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 25px;
  min-height: 50px;
  line-height: 1.5;
}

.card-highlight {
  color: #931b18 !important;
  font-weight: bold;
  font-size: 1.05rem;
}

.card-highlight span {
  font-weight: normal;
  color: #222;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.export-card {
  background-color: #931b18;
  width: 90%;
  max-width: 400px;
  padding: 40px;
  border-radius: 15px;
  position: relative;
  color: white;
  text-align: center;
  box-shadow: 0 15px 50px rgba(0,0,0,0.6);
}

.close-btn {
  position: absolute;
  top: 15px; right: 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.6rem;
  cursor: pointer;
  opacity: 0.8;
}

.close-btn:hover { 
  opacity: 1; 
}

.main-download-icon { 
  font-size: 3.5rem; 
  display: block; 
  margin-bottom: 10px; 
}

.export-header h2 { 
  font-size: 1.8rem; 
  margin-bottom: 8px; 
}

.export-header p { 
  font-size: 0.95rem;
  margin-bottom: 30px; 
  opacity: 0.9; 
}

.export-options { 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
}

.export-item {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 15px 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;
}

.export-item:hover { 
  background: rgba(255, 255, 255, 0.2); 
}

.export-item .ext { 
  opacity: 0.5; 
  font-family: monospace; 
  font-size: 0.85rem; 
}

.pilar-detalhes-modal {
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 15px;
  margin: 20px 0;
  text-align: left;
  font-size: 0.9rem;
}

.pilar-detalhes-modal p {
  margin: 8px 0;
}

.impacto {
  background-color: #fff;
  padding: 80px 10%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 40px;
}

.impacto-imagens {
  position: relative;
  width: 100%;
  height: 350px;
}

.img-card {
  position: absolute;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.img-card img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}

.img-topo { 
  width: 62%; 
  height: 210px; 
  top: 0; 
  left: 0; 
  z-index: 1; 
}

.img-baixo { 
  width: 62%; 
  height: 210px; 
  bottom: 0; 
  right: 0; 
  z-index: 2; 
}

.img-label {
  position: absolute;
  bottom: 10px; left: 12px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(0,0,0,0.4);
  padding: 2px 8px;
  border-radius: 4px;
}

.impacto-conteudo { 
  width: 100%; 
}

.impacto-conteudo h2 {
  color: #931b18;
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.impacto-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: #fdf2f2;
  border-radius: 10px;
  padding: 22px 24px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.impacto-item:hover {
  transform: translateY(-4px); 
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.impacto-icone {
  font-size: 1.2rem;
  background: white;
  border-radius: 50%;
  width: 38px; height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.impacto-titulo { 
  font-weight: 700; 
  color: #931b18; 
  margin-bottom: 3px; 
  font-size: 0.9rem;
}

.impacto-desc { 
  color: #555; 
  font-size: 0.85rem; 
  line-height: 1.4; 
}

.pilares {
  padding: 80px 10%;
  background-color: #fdf2f2;
  text-align: center;
}

.pilares-header h2 { 
  color: #931b18; 
  font-size: 2.8rem; 
  font-weight: 800; 
  margin-bottom: 10px; 
}

.pilares-header p { 
  color: #555; 
  font-size: 1.1rem; 
  max-width: 700px; 
  margin: 0 auto 50px; 
}

.pilares-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.pilar-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
  text-align: left;
}

.pilar-card:hover { 
  transform: translateY(-5px); 
}

.pilar-image { 
  position: relative; 
  height: 200px; 
}

.pilar-image img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}

.pilar-icon-float {
  position: absolute;
  bottom: -20px; left: 20px;
  background: #931b18;
  width: 45px; height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  border: 3px solid white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.pilar-info { 
  padding: 30px 20px 20px; 
}

.pilar-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.pilar-top h3 { 
  color: #931b18; 
  font-size: 1.3rem; 
  font-weight: 700; 
  margin: 0; 
}

.pilar-download {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #931b18;
}

.pilar-download .dl-icon { 
  font-size: 1.8rem; 
}

.pilar-download .dl-text { 
  font-size: 0.7rem; 
  font-weight: 700; 
  color: #931b18; 
  text-transform: uppercase; 
  margin-top: 2px; 
}

.pilar-details p { 
  margin: 5px 0; 
  font-size: 0.9rem; 
  color: #444; 
  line-height: 1.4; 
}

.pilar-details strong { 
  color: #931b18; 
}

.dados {
  background-color: #931b18;
  padding: 60px 8%;
  text-align: center;
  color: white;
}

.dados-topo { 
  display: flex; 
  justify-content: flex-start; 
  margin-bottom: 30px; 
}

.btn-exportar-tudo {
  background-color: #FFD700;
  color: #931b18;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.3s ease;
}

.btn-exportar-tudo:hover { 
  background-color: #e6b800; 
  transform: translateY(-3px);
}

.dados h2 { 
  font-size: 2.2rem; 
  font-weight: 800; 
  margin-bottom: 12px; 
  color: white; 
}

.dados-sub { 
  font-size: 1rem; 
  opacity: 0.85; 
  margin-bottom: 40px; 
}

.barras-card {
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 30px 35px;
  margin-bottom: 35px;
  text-align: left;
}

.barras-card h3 { 
  text-align: center; 
  font-size: 1.1rem; 
  font-weight: 700; 
  margin-bottom: 25px; 
  color: white; 
}

.barras-grid { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 18px 50px; 
}

.barra-item { 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
}

.barra-label-row { 
  display: flex; 
  justify-content: space-between; 
  font-size: 0.82rem; 
  color: rgba(255,255,255,0.9); 
}

.barra-valor { 
  opacity: 0.7; 
  font-size: 0.78rem; 
}

.barra-bg { 
  background: rgba(255,255,255,0.15); 
  border-radius: 4px; 
  height: 8px; 
  width: 100%; 
  position: relative; 
}

.barra-fill { 
  background: #FFD700; 
  height: 100%; 
  border-radius: 4px; 
  position: relative; 
}

.barra-media { 
  position: absolute; 
  left: 0; width: 25%; 
  height: 2px; 
  background: #1a1a1a; 
  border-radius: 2px; 
  top: 50%; 
  transform: translateY(-50%); 
  z-index: 2; 
}

.barras-nota { 
  font-size: 0.72rem; 
  opacity: 0.5; 
  margin-top: 20px; 
  font-style: italic; 
}

.stats-grid { 
  display: grid; 
  grid-template-columns: repeat(4, 1fr); 
  gap: 20px; 
}

.stat-card { 
  background: rgba(255,255,255,0.1); 
  border-radius: 14px; 
  padding: 25px 15px; 
  text-align: center; 
  transition: transform 0.3s ease, background 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-6px); 
  background: rgba(255,255,255,0.18); 
}

.stat-icone { 
  font-size: 1.8rem; 
  margin-bottom: 10px; 
}

.stat-valor { 
  font-size: 2rem; 
  font-weight: 800; 
  color: #FFD700; 
}

.stat-label { 
  font-size: 0.85rem; 
  font-weight: 600; 
  margin: 4px 0; 
}

.stat-desc { 
  font-size: 0.78rem; 
  opacity: 0.7; 
}
</style>