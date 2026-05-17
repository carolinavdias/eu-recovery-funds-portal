<template>
  <div>

    <div class="indicadores-container">

      <!-- LAYOUT PRINCIPAL: esquerda + painel direito -->
      <div class="main-layout">

        <!-- COLUNA ESQUERDA -->
        <div class="col-esquerda">

          <!-- HEADER -->
          <div class="page-header">
            <div class="header-left">
              <h1>{{ appStore.t.indicadores_titulo }}</h1>
              <p>{{ appStore.t.indicadores_sub }}</p>
            </div>
          </div>

          <!-- FILTROS -->
          <div class="filtros-row">
            <div class="filtro-group">
              <label>{{ appStore.t.indicadores_filtro_pais }}</label>
              <div class="select-wrapper">
                <select v-model="paisSelecionado">
                  <option value="todos">{{ appStore.t.todos_paises }}</option>
                  <option v-for="p in paisesStore" :key="p.code" :value="p.code">
                    {{ p.bandeira }} {{ getNomePais(p.code) }}
                  </option>
                </select>
              </div>
            </div>
            <div class="filtro-group">
              <label>{{ appStore.t.indicadores_filtro_periodo }}</label>
              <div class="select-wrapper">
                <select v-model="periodoSelecionado">
                  <option v-for="periodo in periodosDisponiveis" :key="periodo" :value="periodo">
                    {{ nomePeriodo(periodo) }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- SECÇÃO INDICADORES DE PERFORMANCE com indicador de país -->
          <div class="section-header">
            <div class="section-bar"></div>
            <h2>{{ appStore.t.indicadores_seccao_performance }} 
              <span class="pais-indicador-tabela">{{ bandeiraPais }} {{ nomePaisAtual }}</span>
            </h2>
          </div>

          <div class="cards-grid">
            <div class="indicador-card" v-for="ind in indicadores" :key="ind.id">
              <div class="card-top">
                <span class="card-icon">{{ ind.icone }}</span>
                <span class="card-categoria">{{ ind.categoria }}</span>
              </div>
              <p class="card-nome">{{ ind.nome }}</p>
              <p class="card-valor">{{ ind.valor }}</p>
              <div class="progresso-row">
                <span class="prog-label">{{ appStore.t.indicadores_progresso_meta }}</span>
                <span class="prog-pct">{{ ind.progresso }}%</span>
              </div>
              <div class="barra-bg">
                <div class="barra-fill" :style="{ width: ind.progresso + '%', background: corBarraCard(ind.progresso) }"></div>
              </div>
              <button class="btn-saber" @click="abrirSaberMais(ind.id)">{{ appStore.t.indicadores_saber_mais }}</button>
            </div>
          </div>

          <!-- OUTROS INDICADORES com indicador de país -->
          <div class="section-header" style="margin-top: 70px;">
            <div class="section-bar"></div>
            <h2>{{ appStore.t.indicadores_seccao_outros }}
              <span class="pais-indicador-tabela">{{ bandeiraPais }} {{ nomePaisAtual }}</span>
            </h2>
          </div>

          <div class="outros-lista">
            <div v-if="outrosIndicadores.length === 0" class="empty-other">
              <p>{{ appStore.t.outros_sem_dados }}</p>
            </div>
            <div v-else class="outro-item" v-for="outro in outrosIndicadores" :key="outro.id">
              <div class="outro-esq">
                <span class="outro-icone">{{ outro.icone }}</span>
                <span class="outro-nome">{{ outro.nome }}</span>
              </div>
              <span class="outro-valor">{{ outro.valor }}</span>
              <button class="btn-exportar-outro" @click="exportarOutroIndividual(outro)">{{ appStore.t.indicadores_exportar_outro }}</button>
            </div>
          </div>
        </div>

        <!-- COLUNA DIREITA (painel fixo) -->
        <div class="col-direita">

          <button class="btn-guia" @click="abrirMetodologia">
            <span class="icon-circle">?</span> {{ appStore.t.indicadores_guia }}
          </button>

          <div class="exportar-box">
            <div class="exportar-header">
              <span class="icon-download">📥</span>
              <div>
                <h3>{{ appStore.t.indicadores_exportar_dados }}</h3>
                <p>{{ appStore.t.indicadores_exportar_desc }}</p>
              </div>
            </div>

            <button class="btn-action csv" @click="exportar('csv')">
              <span class="btn-icon">📄</span> {{ appStore.t.indicadores_csv }}
            </button>

            <button class="btn-action pdf" @click="exportar('pdf')">
              <span class="btn-icon">📑</span> {{ appStore.t.indicadores_pdf }}
            </button>

            <button class="btn-action json" @click="exportar('json')">
              <span class="btn-icon">📦</span> {{ appStore.t.indicadores_json }}
            </button>

            <hr class="inner-divider">

            <div class="sync-status">
              <p class="sync-label">{{ appStore.t.indicadores_sync_estado }}</p>
              <div class="sync-time">
                <span class="check-circle">✔</span>
                <span>{{ appStore.t.indicadores_sync_texto.replace('%hora%', horaAtual) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- MODAL METODOLOGIA -->
    <div v-if="showMetodologiaModal" class="modal-overlay" @click.self="showMetodologiaModal = false">
      <div class="export-card metodologia-card">
        <button class="close-btn" @click="showMetodologiaModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📘</span>
          <h2>{{ appStore.t.modal_metodologia_titulo }}</h2>
          <p>{{ appStore.t.modal_metodologia_desc }}</p>
        </div>
        <div class="metodologia-content">
          <h3>{{ appStore.t.metodologia_fontes_titulo }}</h3>
          <p>{{ appStore.t.metodologia_fontes_texto }}</p>
          <h3>{{ appStore.t.metodologia_periodicidade_titulo }}</h3>
          <p>{{ appStore.t.metodologia_periodicidade_texto }}</p>
          <h3>{{ appStore.t.metodologia_calculo_titulo }}</h3>
          <p>{{ appStore.t.metodologia_calculo_texto }}</p>
          <h3>{{ appStore.t.metodologia_niveis_titulo }}</h3>
          <ul>
            <li>{{ appStore.t.metodologia_niveis_item1 }}</li>
            <li>{{ appStore.t.metodologia_niveis_item2 }}</li>
            <li>{{ appStore.t.metodologia_niveis_item3 }}</li>
          </ul>
          <h3>{{ appStore.t.metodologia_transparencia_titulo }}</h3>
          <p>{{ appStore.t.metodologia_transparencia_texto }}</p>
        </div>
        <div class="export-options" style="margin-top: 20px;">
          <button class="export-item btn-fechar" @click="showMetodologiaModal = false">{{ appStore.t.modal_fechar }}</button>
        </div>
      </div>
    </div>

    <!-- MODAL DADOS ABERTOS -->
    <div v-if="showDadosAbertosModal" class="modal-overlay" @click.self="showDadosAbertosModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showDadosAbertosModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📂</span>
          <h2>{{ appStore.t.modal_dados_abertos_titulo }}</h2>
          <p>{{ appStore.t.modal_dados_abertos_desc }}</p>
        </div>
        <div style="text-align:left; margin:20px 0;">
          <p>{{ appStore.t.dados_abertos_texto }}</p>
          <ul style="margin-top:10px; padding-left:20px;">
            <li><a href="https://recuperarportugal.gov.pt/" target="_blank" style="color:#FFD700;">{{ appStore.t.dados_abertos_link1 }}</a></li>
            <li><a href="https://ec.europa.eu/eurostat" target="_blank" style="color:#FFD700;">{{ appStore.t.dados_abertos_link2 }}</a></li>
            <li><a href="https://data.europa.eu/" target="_blank" style="color:#FFD700;">{{ appStore.t.dados_abertos_link3 }}</a></li>
          </ul>
          <p style="margin-top:15px;">{{ appStore.t.dados_abertos_reutilizacao }}</p>
        </div>
        <div class="export-options">          
          <button class="export-item btn-fechar" @click="showDadosAbertosModal = false">{{ appStore.t.modal_fechar }}</button>
        </div>
      </div>
    </div>

    <!-- MODAL FAQ -->
    <div v-if="showFAQModal" class="modal-overlay" @click.self="showFAQModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showFAQModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">❓</span>
          <h2>{{ appStore.t.modal_faq_titulo }}</h2>
          <p>{{ appStore.t.modal_faq_desc }}</p>
        </div>
        <div style="text-align:left; margin:20px 0;">
          <p><strong>{{ appStore.t.faq_pergunta1 }}</strong><br>{{ appStore.t.faq_resposta1 }}</p>
          <p><strong>{{ appStore.t.faq_pergunta2 }}</strong><br>{{ appStore.t.faq_resposta2 }}</p>
          <p><strong>{{ appStore.t.faq_pergunta3 }}</strong><br>{{ appStore.t.faq_resposta3 }}</p>
          <p><strong>{{ appStore.t.faq_pergunta4 }}</strong><br>{{ appStore.t.faq_resposta4 }}</p>
        </div>
        <div class="export-options">
          <button class="export-item btn-fechar" @click="showFAQModal = false">{{ appStore.t.modal_fechar }}</button>
        </div>
      </div>
    </div>

    <!-- MODAL CONTACTOS -->
    <div v-if="showContactosModal" class="modal-overlay" @click.self="showContactosModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showContactosModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📞</span>
          <h2>{{ appStore.t.modal_contactos_titulo }}</h2>
          <p>{{ appStore.t.modal_contactos_desc }}</p>
        </div>
        <div style="text-align:left; margin:20px 0;">
          <p><strong>{{ appStore.t.contactos_email }}</strong> <a href="mailto:info@prr-europa.eu" style="color:#FFD700;">{{ appStore.t.contactos_email_valor }}</a></p>
          <p><strong>{{ appStore.t.contactos_telefone }}</strong> {{ appStore.t.contactos_telefone_valor }}</p>
          <p><strong>{{ appStore.t.contactos_morada }}</strong> {{ appStore.t.contactos_morada_valor }}</p>
          <p><strong>{{ appStore.t.contactos_horario }}</strong> {{ appStore.t.contactos_horario_valor }}</p>
        </div>
        <div class="export-options">
          <button class="export-item btn-fechar" @click="showContactosModal = false">{{ appStore.t.modal_fechar }}</button>
        </div>
      </div>
    </div>

    <!-- MODAL PRIVACIDADE -->
    <div v-if="showPrivacidadeModal" class="modal-overlay" @click.self="showPrivacidadeModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showPrivacidadeModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">🔒</span>
          <h2>{{ appStore.t.modal_privacidade_titulo }}</h2>
          <p>{{ appStore.t.modal_privacidade_desc }}</p>
        </div>
        <div style="text-align:left; margin:20px 0;">
          <p>{{ appStore.t.privacidade_texto }}</p>
        </div>
        <div class="export-options">
          <button class="export-item btn-fechar" @click="showPrivacidadeModal = false">{{ appStore.t.modal_fechar }}</button>
        </div>
      </div>
    </div>

    <!-- MODAL TERMOS E CONDIÇÕES -->
    <div v-if="showTermosModal" class="modal-overlay" @click.self="showTermosModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showTermosModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">⚖️</span>
          <h2>{{ appStore.t.modal_termos_titulo }}</h2>
          <p>{{ appStore.t.modal_termos_desc }}</p>
        </div>
        <div style="text-align:left; margin:20px 0;">
          <p>{{ appStore.t.termos_texto }}</p>
        </div>
        <div class="export-options">
          <button class="export-item btn-fechar" @click="showTermosModal = false">{{ appStore.t.modal_fechar }}</button>
        </div>
      </div>
    </div>

    <!-- MODAL COOKIES -->
    <div v-if="showCookiesModal" class="modal-overlay" @click.self="showCookiesModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showCookiesModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">🍪</span>
          <h2>{{ appStore.t.modal_cookies_titulo }}</h2>
          <p>{{ appStore.t.modal_cookies_desc }}</p>
        </div>
        <div style="text-align:left; margin:20px 0;">
          <p>{{ appStore.t.cookies_texto }}</p>
        </div>
        <div class="export-options">
          <button class="export-item btn-fechar" @click="showCookiesModal = false">{{ appStore.t.modal_fechar }}</button>
        </div>
      </div>
    </div>

    <!-- MODAL SABER MAIS -->
    <div v-if="showSaberMaisModal" class="modal-overlay" @click.self="showSaberMaisModal = false">
      <div class="export-card saber-mais-card" :key="`${indicadorIdSelecionado}-${paisSelecionado}-${periodoSelecionado}`">
        <button class="close-btn" @click="showSaberMaisModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">{{ getIndicadorPorId(indicadorIdSelecionado)?.icone }}</span>
          <h2>{{ getIndicadorPorId(indicadorIdSelecionado)?.nome }}</h2>
          <p>{{ getIndicadorPorId(indicadorIdSelecionado)?.categoria }}</p>
        </div>
        <div class="saber-mais-content">
          <p><strong>{{ appStore.t.saber_mais_valor_atual }}</strong> {{ getIndicadorPorId(indicadorIdSelecionado)?.valor }}</p>
          <p><strong>{{ appStore.t.saber_mais_progresso }}</strong> {{ getIndicadorPorId(indicadorIdSelecionado)?.progresso }}%</p>
          <div class="barra-bg-saber">
            <div class="barra-fill-saber" :style="{ width: getIndicadorPorId(indicadorIdSelecionado)?.progresso + '%', background: corBarraModal(getIndicadorPorId(indicadorIdSelecionado)?.progresso) }"></div>
          </div>
          <div style="background: rgba(255,255,255,0.15); border-radius: 8px; padding: 8px 12px; margin: 10px 0; text-align: center;">
            📍 {{ nomePaisAtual }} | 📅 {{ nomePeriodoAtual }}
          </div>
          <hr>
          <h3>🔍 {{ appStore.t.saber_mais_descricao }}</h3>
          <p>{{ descricaoIndicador }}</p>
          <p><strong>{{ appStore.t.saber_mais_meta_nacional }}</strong> {{ metaIndicador }}</p>
          <p><strong>{{ appStore.t.saber_mais_fonte }}</strong> Comissão Europeia / PRR Relatório Semestral</p>
          <p><strong>{{ appStore.t.saber_mais_atualizacao }}</strong> {{ new Date().toLocaleDateString(appStore.idioma === 'pt' ? 'pt-PT' : 'en-GB') }}</p>
        </div>
        <div class="export-options" style="margin-top: 20px;">
          <button class="export-item btn-fechar" @click="showSaberMaisModal = false">{{ appStore.t.modal_fechar }}</button>
        </div>
      </div>
    </div>

    <!-- MODAL EXPORTAÇÃO OUTROS INDICADORES -->
    <div v-if="showExportOutroModal" class="modal-overlay" @click.self="showExportOutroModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showExportOutroModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📤</span>
          <h2>{{ appStore.t.modal_export_titulo }}</h2>
          <p>{{ outroSelecionado?.nome }}</p>
        </div>
        <div class="outro-detalhes-modal">
          <p><strong>{{ appStore.t.saber_mais_valor_atual }}</strong> {{ outroSelecionado?.valor }}</p>
          <p><strong>{{ appStore.t.marco_pdf_pais }}</strong> {{ nomePaisAtual }}</p>
          <p><strong>{{ appStore.t.indicadores_filtro_periodo }}</strong> {{ nomePeriodoAtual }}</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="exportarOutroIndividualAcao('csv')">
            <span>{{ appStore.t.modal_export_csv }}</span><span class="ext">.csv</span>
          </button>
          <button class="export-item" @click="exportarOutroIndividualAcao('json')">
            <span>{{ appStore.t.modal_export_json }}</span><span class="ext">.json</span>
          </button>
          <button class="export-item" @click="exportarOutroIndividualAcao('pdf')">
            <span>{{ appStore.t.modal_export_pdf }}</span><span class="ext">.pdf</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '../stores/app'
import { getPaises } from '@/services/api.js'

const appStore = useAppStore()
const paisesStore = ref([])

// Filtros
const paisSelecionado = computed({ 
  get: () => appStore.paisSelecionado, 
  set: (v) => appStore.setPais(v) 
})
const periodoSelecionado = ref('s2-2025') // valor padrão

// ============================================================
// DADOS DE PORTUGAL (estrutura base)
// ============================================================
const dadosBasePortugalPt = {
  's1-2023': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCAÇÃO', nome: 'Participantes em formação', valor: '412.300', progresso: 58 },
      { id: 2, icone: '⚡', categoria: 'ENERGIA', nome: 'Capacidade renovável', valor: '980 MW', progresso: 32 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Serviços públicos digitais', valor: '720', progresso: 65 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Habitação social renovada', valor: '8.200', progresso: 38 },
      { id: 5, icone: '📊', categoria: 'ECONOMIA', nome: 'Apoio a PME e Inovação', valor: '2.450', progresso: 22 },
      { id: 6, icone: '🏥', categoria: 'SAÚDE', nome: 'Capacidade hospitalar', valor: '620', progresso: 56 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'Redução de emissões de CO2', valor: '12% Redução' },
      { id: 2, icone: '🚌', nome: 'Mobilidade sustentável urbana', valor: '85 novas rotas' },
      { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€420M' }
    ]
  },
  's2-2023': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCAÇÃO', nome: 'Participantes em formação', valor: '428.500', progresso: 62 },
      { id: 2, icone: '⚡', categoria: 'ENERGIA', nome: 'Capacidade renovável', valor: '1.050 MW', progresso: 36 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Serviços públicos digitais', valor: '810', progresso: 73 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Habitação social renovada', valor: '9.540', progresso: 44 },
      { id: 5, icone: '📊', categoria: 'ECONOMIA', nome: 'Apoio a PME e Inovação', valor: '2.780', progresso: 26 },
      { id: 6, icone: '🏥', categoria: 'SAÚDE', nome: 'Capacidade hospitalar', valor: '710', progresso: 64 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'Redução de emissões de CO2', valor: '14% Redução' },
      { id: 2, icone: '🚌', nome: 'Mobilidade sustentável urbana', valor: '98 novas rotas' },
      { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€470M' }
    ]
  },
  's1-2024': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCAÇÃO', nome: 'Participantes em formação', valor: '442.100', progresso: 65 },
      { id: 2, icone: '⚡', categoria: 'ENERGIA', nome: 'Capacidade renovável', valor: '1.120 MW', progresso: 39 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Serviços públicos digitais', valor: '890', progresso: 80 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Habitação social renovada', valor: '10.750', progresso: 49 },
      { id: 5, icone: '📊', categoria: 'ECONOMIA', nome: 'Apoio a PME e Inovação', valor: '2.950', progresso: 28 },
      { id: 6, icone: '🏥', categoria: 'SAÚDE', nome: 'Capacidade hospitalar', valor: '780', progresso: 70 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'Redução de emissões de CO2', valor: '15% Redução' },
      { id: 2, icone: '🚌', nome: 'Mobilidade sustentável urbana', valor: '105 novas rotas' },
      { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€500M' }
    ]
  },
  's2-2024': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCAÇÃO', nome: 'Participantes em formação', valor: '452.890', progresso: 68 },
      { id: 2, icone: '⚡', categoria: 'ENERGIA', nome: 'Capacidade renovável', valor: '1.250 MW', progresso: 42 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Serviços públicos digitais', valor: '1.000', progresso: 91 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Habitação social renovada', valor: '12.450', progresso: 55 },
      { id: 5, icone: '📊', categoria: 'ECONOMIA', nome: 'Apoio a PME e Inovação', valor: '3.120', progresso: 30 },
      { id: 6, icone: '🏥', categoria: 'SAÚDE', nome: 'Capacidade hospitalar', valor: '850', progresso: 78 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'Redução de emissões de CO2', valor: '18% Redução' },
      { id: 2, icone: '🚌', nome: 'Mobilidade sustentável urbana', valor: '120 novas rotas' },
      { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€540M' }
    ]
  },
  's1-2025': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCAÇÃO', nome: 'Participantes em formação', valor: '468.200', progresso: 72 },
      { id: 2, icone: '⚡', categoria: 'ENERGIA', nome: 'Capacidade renovável', valor: '1.380 MW', progresso: 46 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Serviços públicos digitais', valor: '1.050', progresso: 95 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Habitação social renovada', valor: '13.800', progresso: 60 },
      { id: 5, icone: '📊', categoria: 'ECONOMIA', nome: 'Apoio a PME e Inovação', valor: '3.450', progresso: 33 },
      { id: 6, icone: '🏥', categoria: 'SAÚDE', nome: 'Capacidade hospitalar', valor: '910', progresso: 84 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'Redução de emissões de CO2', valor: '20% Redução' },
      { id: 2, icone: '🚌', nome: 'Mobilidade sustentável urbana', valor: '135 novas rotas' },
      { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€590M' }
    ]
  },
  's2-2025': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCAÇÃO', nome: 'Participantes em formação', valor: '485.500', progresso: 76 },
      { id: 2, icone: '⚡', categoria: 'ENERGIA', nome: 'Capacidade renovável', valor: '1.520 MW', progresso: 51 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Serviços públicos digitais', valor: '1.100', progresso: 98 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Habitação social renovada', valor: '15.200', progresso: 66 },
      { id: 5, icone: '📊', categoria: 'ECONOMIA', nome: 'Apoio a PME e Inovação', valor: '3.780', progresso: 36 },
      { id: 6, icone: '🏥', categoria: 'SAÚDE', nome: 'Capacidade hospitalar', valor: '980', progresso: 89 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'Redução de emissões de CO2', valor: '22% Redução' },
      { id: 2, icone: '🚌', nome: 'Mobilidade sustentável urbana', valor: '150 novas rotas' },
      { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€630M' }
    ]
  }
}

// Dados de Portugal em inglês (tradução dos nomes dos indicadores)
const dadosBasePortugalEn = {
  's1-2023': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCATION', nome: 'Participants in training', valor: '412,300', progresso: 58 },
      { id: 2, icone: '⚡', categoria: 'ENERGY', nome: 'Renewable capacity', valor: '980 MW', progresso: 32 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Digital public services', valor: '720', progresso: 65 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Renovated social housing', valor: '8,200', progresso: 38 },
      { id: 5, icone: '📊', categoria: 'ECONOMY', nome: 'SME support and innovation', valor: '2,450', progresso: 22 },
      { id: 6, icone: '🏥', categoria: 'HEALTH', nome: 'Hospital capacity', valor: '620', progresso: 56 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'CO2 emission reduction', valor: '12% Reduction' },
      { id: 2, icone: '🚌', nome: 'Sustainable urban mobility', valor: '85 new routes' },
      { id: 3, icone: '🔬', nome: 'R&D investment', valor: '€420M' }
    ]
  },
  's2-2025': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCATION', nome: 'Participants in training', valor: '485,500', progresso: 76 },
      { id: 2, icone: '⚡', categoria: 'ENERGY', nome: 'Renewable capacity', valor: '1,520 MW', progresso: 51 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Digital public services', valor: '1,100', progresso: 98 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Renovated social housing', valor: '15,200', progresso: 66 },
      { id: 5, icone: '📊', categoria: 'ECONOMY', nome: 'SME support and innovation', valor: '3,780', progresso: 36 },
      { id: 6, icone: '🏥', categoria: 'HEALTH', nome: 'Hospital capacity', valor: '980', progresso: 89 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'CO2 emission reduction', valor: '22% Reduction' },
      { id: 2, icone: '🚌', nome: 'Sustainable urban mobility', valor: '150 new routes' },
      { id: 3, icone: '🔬', nome: 'R&D investment', valor: '€630M' }
    ]
  }
}

// Função que retorna os dados do país/periodo, aplicando tradução se necessário
function obterDadosPorPaisPeriodo(pais, periodo) {
  if (pais === 'todos') pais = 'PT'
  const dadosBase = appStore.idioma === 'pt' ? dadosBasePortugalPt : dadosBasePortugalEn
  if (pais === 'PT') return dadosBase[periodo] || dadosBase['s2-2025']
  if (pais === 'ES') {
    // Para Espanha, usamos os dados de Portugal com fator de escala e depois traduzimos os nomes se necessário
    const dadosPt = dadosBase[periodo] || dadosBase['s2-2025']
    const mult = 1.3
    const principais = dadosPt.principais.map(ind => {
      let novoValor = ind.valor
      let novoProgresso = Math.min(100, Math.round(ind.progresso * mult))
      if (typeof ind.valor === 'string') {
        const numMatch = ind.valor.match(/([\d.,]+)/)
        if (numMatch) {
          let num = parseFloat(numMatch[0].replace(/\./g, '').replace(',', '.'))
          if (!isNaN(num)) {
            num = Math.round(num * mult)
            novoValor = ind.valor.replace(numMatch[0], num.toLocaleString())
          }
        }
      }
      return { ...ind, valor: novoValor, progresso: novoProgresso }
    })
    const outros = dadosPt.outros.map(out => {
      let novoValor = out.valor
      const numMatch = out.valor.match(/([\d.,]+)/)
      if (numMatch) {
        let num = parseFloat(numMatch[0].replace(/\./g, '').replace(',', '.'))
        if (!isNaN(num)) {
          num = Math.round(num * mult)
          novoValor = out.valor.replace(numMatch[0], num.toLocaleString())
        }
      }
      return { ...out, valor: novoValor }
    })
    return { principais, outros }
  }
  // Para os restantes países, aplicar fator de escala dinâmico
  const mult = { FR: 1.3, IT: 1.2, DE: 1.5, GR: 0.7, HR: 0.5, RO: 0.6 }[pais] || 1.0
  const dadosPt = dadosBase[periodo] || dadosBase['s2-2025']
  const principais = dadosPt.principais.map(ind => {
    let novoValor = ind.valor
    let novoProgresso = Math.min(100, Math.round(ind.progresso * mult))
    if (typeof ind.valor === 'string') {
      const numMatch = ind.valor.match(/([\d.,]+)/)
      if (numMatch) {
        let num = parseFloat(numMatch[0].replace(/\./g, '').replace(',', '.'))
        if (!isNaN(num)) {
          num = Math.round(num * mult)
          novoValor = ind.valor.replace(numMatch[0], num.toLocaleString())
        }
      }
    }
    return { ...ind, valor: novoValor, progresso: novoProgresso }
  })
  const outros = dadosPt.outros.map(out => {
    let novoValor = out.valor
    const numMatch = out.valor.match(/([\d.,]+)/)
    if (numMatch) {
      let num = parseFloat(numMatch[0].replace(/\./g, '').replace(',', '.'))
      if (!isNaN(num)) {
        num = Math.round(num * mult)
        novoValor = out.valor.replace(numMatch[0], num.toLocaleString())
      }
    }
    return { ...out, valor: novoValor }
  })
  return { principais, outros }
}

// Computed que devolve os indicadores principais traduzidos (já com os textos no idioma atual)
const indicadores = computed(() => {
  const dados = obterDadosPorPaisPeriodo(paisSelecionado.value, periodoSelecionado.value)
  return dados.principais
})

const outrosIndicadores = computed(() => {
  const dados = obterDadosPorPaisPeriodo(paisSelecionado.value, periodoSelecionado.value)
  return dados.outros
})

// Lista dinâmica de períodos disponíveis (desde o primeiro semestre do PRR até ao último concluído)
const periodosDisponiveis = computed(() => {
  const periodos = []
  const anoInicio = 2023 // primeiro ano com dados
  const agora = new Date()
  const anoAtual = agora.getFullYear()
  const mes = agora.getMonth() // 0-11
  // Determinar o último semestre concluído: se mes >= 5 (junho) então S1 do ano atual; se mes >= 0 então S2 do ano anterior?
  // Para simplificar, incluímos todos os semestres até ao ano atual, mas limitamos aos que têm dados (até 2025)
  for (let ano = anoInicio; ano <= Math.min(anoAtual + 1, 2025); ano++) {
    // S1 do ano (junho)
    if (ano === anoAtual && mes < 5) {
      // ainda não passou junho, não incluir S1 deste ano
    } else {
      periodos.push(`s1-${ano}`)
    }
    // S2 do ano (dezembro)
    if (ano === anoAtual && mes < 11) {
      // ainda não passou dezembro, não incluir S2 deste ano
    } else {
      periodos.push(`s2-${ano}`)
    }
  }
  // Remover duplicados e ordenar
  const unicos = [...new Set(periodos)]
  unicos.sort((a,b) => {
    const [s1, ano1] = a.split('-')
    const [s2, ano2] = b.split('-')
    if (ano1 !== ano2) return ano1 - ano2
    return s1 === 's1' ? -1 : 1
  })
  return unicos
})

// Nome do período formatado
function nomePeriodo(periodo) {
  const [sem, ano] = periodo.split('-')
  const num = sem === 's1' ? 1 : 2
  const isPt = appStore.idioma === 'pt'
  return `${isPt ? (num === 1 ? '1º Semestre' : '2º Semestre') : (num === 1 ? '1st Semester' : '2nd Semester')} ${ano}`
}

const nomePaisAtual = computed(() => {
  if (paisSelecionado.value === 'todos') return appStore.t.todos_paises
  const pais = paisesStore.value.find(p => p.code === paisSelecionado.value)
  if (!pais) return paisSelecionado.value
  const isPt = appStore.idioma === 'pt'
  return isPt ? pais.nome_pt : pais.nome_en
})

const bandeiraPais = computed(() => {
  if (paisSelecionado.value === 'todos') return '🌍'
  const pais = paisesStore.value.find(p => p.code === paisSelecionado.value)
  return pais?.bandeira || '🌍'
})

const nomePeriodoAtual = computed(() => nomePeriodo(periodoSelecionado.value))

// Horário dinâmico
const horaAtual = ref('')
let intervalo = null

function atualizarHora() {
  const now = new Date()
  const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  horaAtual.value = now.toLocaleDateString(appStore.idioma === 'pt' ? 'pt-PT' : 'en-GB', options).replace(',', '')
}

// Estados dos modais
const showMetodologiaModal = ref(false)
const showDadosAbertosModal = ref(false)
const showFAQModal = ref(false)
const showContactosModal = ref(false)
const showPrivacidadeModal = ref(false)
const showTermosModal = ref(false)
const showCookiesModal = ref(false)
const showSaberMaisModal = ref(false)
const showExportOutroModal = ref(false)
const indicadorIdSelecionado = ref(null)
const outroSelecionado = ref(null)

function abrirMetodologia() { showMetodologiaModal.value = true }
function abrirDadosAbertos() { showDadosAbertosModal.value = true }
function abrirFAQ() { showFAQModal.value = true }
function abrirContactos() { showContactosModal.value = true }
function abrirPrivacidade() { showPrivacidadeModal.value = true }
function abrirTermos() { showTermosModal.value = true }
function abrirCookies() { showCookiesModal.value = true }
function abrirSaberMais(id) { 
  indicadorIdSelecionado.value = id
  showSaberMaisModal.value = true
}
function exportarOutroIndividual(outro) { 
  outroSelecionado.value = outro
  showExportOutroModal.value = true
}

function getIndicadorPorId(id) {
  return indicadores.value.find(ind => ind.id === id)
}

// Descrição e meta para o modal Saber Mais (traduzidos)
const descricaoIndicador = computed(() => {
  const id = indicadorIdSelecionado.value
  const isPt = appStore.idioma === 'pt'
  if (id === 1) return isPt ? 'Número de participantes que concluíram ações de formação financiadas pelo PRR nas áreas de qualificação e requalificação profissional.' : 'Number of participants who completed training activities funded by the RRP in the areas of professional qualification and retraining.'
  if (id === 2) return isPt ? 'Capacidade instalada de energias renováveis (MW) com apoio do PRR.' : 'Installed renewable energy capacity (MW) supported by the RRP.'
  if (id === 3) return isPt ? 'Número de serviços públicos digitais disponibilizados à população.' : 'Number of digital public services made available to the population.'
  if (id === 4) return isPt ? 'Habitações renovadas ou construídas ao abrigo do programa de habitação social.' : 'Homes renovated or built under the social housing program.'
  if (id === 5) return isPt ? 'Número de pequenas e médias empresas apoiadas para inovação e digitalização.' : 'Number of small and medium-sized enterprises supported for innovation and digitalization.'
  if (id === 6) return isPt ? 'Incremento de camas ou equipamentos no Serviço Nacional de Saúde.' : 'Increase in beds or equipment in the National Health Service.'
  return ''
})

const metaIndicador = computed(() => {
  const id = indicadorIdSelecionado.value
  const isPt = appStore.idioma === 'pt'
  if (id === 1) return isPt ? '650.000 participantes' : '650,000 participants'
  if (id === 2) return isPt ? '2.500 MW' : '2,500 MW'
  if (id === 3) return isPt ? '1.500 serviços' : '1,500 services'
  if (id === 4) return isPt ? '25.000 habitações' : '25,000 homes'
  if (id === 5) return isPt ? '8.000 PME' : '8,000 SMEs'
  if (id === 6) return isPt ? '1.200 camas' : '1,200 beds'
  return ''
})

// Funções de exportação
function exportar(tipo) {
  try {
    const inds = [...indicadores.value]
    const outros = [...outrosIndicadores.value]
    const pais = nomePaisAtual.value
    const periodo = nomePeriodoAtual.value
    const dataGeracao = new Date().toLocaleDateString(appStore.idioma === 'pt' ? 'pt-PT' : 'en-GB')
    const codigoPais = paisSelecionado.value
    const codigoPeriodo = periodoSelecionado.value

    if (tipo === 'csv') {
      let csv = `${appStore.idioma === 'pt' ? 'Relatório de Indicadores PRR' : 'PRR Indicators Report'}\n`
      csv += `${appStore.idioma === 'pt' ? 'País' : 'Country'};${pais}\n`
      csv += `${appStore.idioma === 'pt' ? 'Período' : 'Period'};${periodo}\n`
      csv += `${appStore.idioma === 'pt' ? 'Data de geração' : 'Generation date'};${dataGeracao}\n\n`
      csv += `${appStore.idioma === 'pt' ? 'INDICADORES DE PERFORMANCE' : 'PERFORMANCE INDICATORS'}\n`
      csv += `${appStore.idioma === 'pt' ? 'Indicador;Valor;Progresso (%)' : 'Indicator;Value;Progress (%)'}\n`
      inds.forEach(ind => {
        csv += `${ind.nome};${ind.valor};${ind.progresso}\n`
      })
      csv += `\n${appStore.idioma === 'pt' ? 'OUTROS INDICADORES OBRIGATÓRIOS' : 'OTHER MANDATORY INDICATORS'}\n`
      csv += `${appStore.idioma === 'pt' ? 'Indicador;Valor' : 'Indicator;Value'}\n`
      outros.forEach(out => {
        csv += `${out.nome};${out.valor}\n`
      })
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `indicadores_prr_${codigoPais}_${codigoPeriodo}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } 
    else if (tipo === 'json') {
      const jsonData = {
        pais,
        periodo,
        dataGeracao,
        indicadores_performance: inds,
        outros_indicadores: outros
      }
      const json = JSON.stringify(jsonData, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `indicadores_prr_${codigoPais}_${codigoPeriodo}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
    else if (tipo === 'pdf') {
      const win = window.open('', '_blank')
      if (!win || win.closed || typeof win.closed === 'undefined') {
        alert(appStore.idioma === 'pt' ? '❌ O navegador bloqueou a janela de impressão. Permita pop-ups para este site.' : '❌ The browser blocked the print window. Please allow pop-ups for this site.')
        return
      }
      const html = `
        <html>
          <head>
            <title>${appStore.idioma === 'pt' ? 'Indicadores PRR' : 'PRR Indicators'} - ${pais}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              h1 { color: #931b18; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #931b18; color: white; }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <h1>${appStore.idioma === 'pt' ? 'Indicadores Comuns do PRR' : 'RRP Common Indicators'} - ${pais}</h1>
            <p><strong>${appStore.idioma === 'pt' ? 'Período' : 'Period'}:</strong> ${periodo}</p>
            <p><strong>${appStore.idioma === 'pt' ? 'Data' : 'Date'}:</strong> ${dataGeracao}</p>
            <h2>${appStore.idioma === 'pt' ? 'Indicadores de Performance' : 'Performance Indicators'}</h2>
            <table>
              <thead><tr><th>${appStore.idioma === 'pt' ? 'Indicador' : 'Indicator'}</th><th>${appStore.idioma === 'pt' ? 'Valor' : 'Value'}</th><th>${appStore.idioma === 'pt' ? 'Progresso (%)' : 'Progress (%)'}</th></tr></thead>
              <tbody>
                ${inds.map(ind => `<tr><td>${ind.nome}</td><td>${ind.valor}</td><td>${ind.progresso}%</td></tr>`).join('')}
              </tbody>
            </table>
            <h2>${appStore.idioma === 'pt' ? 'Outros Indicadores Obrigatórios' : 'Other Mandatory Indicators'}</h2>
            <table>
              <thead><tr><th>${appStore.idioma === 'pt' ? 'Indicador' : 'Indicator'}</th><th>${appStore.idioma === 'pt' ? 'Valor' : 'Value'}</th></tr></thead>
              <tbody>
                ${outros.map(out => `<tr><td>${out.nome}</td><td>${out.valor}</td></tr>`).join('')}
              </tbody>
            </table>
            <div class="footer">${appStore.idioma === 'pt' ? 'Gerado pelo Sistema de Monitorização do PRR' : 'Generated by the PRR Monitoring System'} - ${dataGeracao}</div>
          </body>
        </html>
      `
      win.document.write(html)
      win.document.close()
      win.print()
    }
  } catch (err) {
    console.error('Erro na exportação:', err)
    alert(appStore.idioma === 'pt' ? '❌ Erro ao exportar dados. Tente novamente.' : '❌ Error exporting data. Please try again.')
  }
}

function exportarOutroIndividualAcao(formato) {
  try {
    const outro = outroSelecionado.value
    if (!outro) return
    const dataGeracao = new Date().toLocaleDateString(appStore.idioma === 'pt' ? 'pt-PT' : 'en-GB')
    const nomeLimpo = outro.nome.replace(/\s+/g, '_').toLowerCase()
    const pais = nomePaisAtual.value
    const periodo = nomePeriodoAtual.value
    const codigoPais = paisSelecionado.value
    const codigoPeriodo = periodoSelecionado.value

    if (formato === 'csv') {
      const csv = `${appStore.idioma === 'pt' ? 'Indicador' : 'Indicator'};${outro.nome}\n${appStore.idioma === 'pt' ? 'Valor' : 'Value'};${outro.valor}\n${appStore.idioma === 'pt' ? 'País' : 'Country'};${pais}\n${appStore.idioma === 'pt' ? 'Período' : 'Period'};${periodo}\n${appStore.idioma === 'pt' ? 'Data de exportação' : 'Export date'};${dataGeracao}`
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${nomeLimpo}_${codigoPais}_${codigoPeriodo}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } 
    else if (formato === 'json') {
      const jsonData = {
        indicador: outro.nome,
        valor: outro.valor,
        pais: pais,
        periodo: periodo,
        dataExportacao: dataGeracao,
        codigoPais: codigoPais,
        codigoPeriodo: codigoPeriodo
      }
      const json = JSON.stringify(jsonData, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${nomeLimpo}_${codigoPais}_${codigoPeriodo}.json`
      a.click()
      URL.revokeObjectURL(url)
    } 
    else if (formato === 'pdf') {
      const win = window.open('', '_blank')
      if (!win || win.closed || typeof win.closed === 'undefined') {
        alert(appStore.idioma === 'pt' ? '❌ O navegador bloqueou a janela de impressão. Permita pop-ups para este site.' : '❌ The browser blocked the print window. Please allow pop-ups for this site.')
        return
      }
      win.document.write(`
        <html>
          <head><title>${outro.nome} - PRR</title></head>
          <body style="font-family:sans-serif; padding:40px;">
            <h1 style="color:#931b18;">${outro.nome}</h1>
            <p><strong>${appStore.idioma === 'pt' ? 'Valor' : 'Value'}:</strong> ${outro.valor}</p>
            <p><strong>${appStore.idioma === 'pt' ? 'País' : 'Country'}:</strong> ${pais}</p>
            <p><strong>${appStore.idioma === 'pt' ? 'Período' : 'Period'}:</strong> ${periodo}</p>
            <p><strong>${appStore.idioma === 'pt' ? 'Data de exportação' : 'Export date'}:</strong> ${dataGeracao}</p>
          </body>
        </html>
      `)
      win.document.close()
      win.print()
    }
    showExportOutroModal.value = false
  } catch (err) {
    console.error('Erro na exportação individual:', err)
    alert(appStore.idioma === 'pt' ? '❌ Erro ao exportar indicador.' : '❌ Error exporting indicator.')
  }
}

function corBarraCard(pct) {
  if (pct >= 75) return '#931b18'
  return '#d4af37'
}
function corBarraModal(pct) {
  if (pct >= 75) return '#ff6b6b'
  return '#d4af37'
}

function getNomePais(paisCode) {
  if (!paisCode || paisCode === 'todos') return appStore.t.todos_paises
  const isPt = appStore.idioma === 'pt'
  const pais = paisesStore.value.find(p => p.code === paisCode)
  if (!pais) return paisCode
  return isPt ? pais.nome_pt : pais.nome_en
}

// Carregar países da API
onMounted(async () => {
  try {
    const paises = await getPaises()
    paisesStore.value = paises
    if (!appStore.paises || appStore.paises.length === 0) {
      appStore.paises = paises
    }
  } catch (err) {
    console.error('Erro ao carregar países:', err)
  }
  atualizarHora()
  intervalo = setInterval(atualizarHora, 60000)
})

onUnmounted(() => {
  if (intervalo) clearInterval(intervalo)
})

watch([paisSelecionado, periodoSelecionado, () => appStore.idioma], () => {
  // Os dados mudam automaticamente via computed, apenas fechamos o modal se estiver aberto
  if (showSaberMaisModal.value) {
    showSaberMaisModal.value = false
  }
})
</script>

<style scoped>
/* ========== ESTILOS ORIGINAIS ========== */
* { box-sizing: border-box; }

@keyframes notificacaoEntrada {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes notificacaoSaida {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}

.indicadores-container {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden !important;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 30px;
  padding: 30px 4% 0 4%;
  width: 100%;
}

.col-esquerda {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  gap: 20px;
}

.header-left h1 {
  font-size: 2.2rem;
  font-weight: 800;
  color: #931b18;
  margin-bottom: 40px;
}
.header-left p {
  font-size: 1rem;
  color: #666;
  max-width: 700px;
  line-height: 1.8;
}

.filtros-row {
  display: flex;
  gap: 20px;
  margin-top: 50px;
  margin-bottom: 70px;
  padding-bottom: 25px;
  border-bottom: 1px solid #eee;
}
.filtro-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.filtro-group label {
  font-size: 0.68rem;
  font-weight: 700;
  color: #931b18;
  letter-spacing: 1px;
}
.select-wrapper select {
  padding: 10px 36px 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #333;
  background: white;
  cursor: pointer;
  min-width: 250px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  margin-top: 60px;
}
.section-bar {
  width: 4px;
  height: 28px;
  background: #d4af37;
  border-radius: 2px;
  flex-shrink: 0;
}
.section-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #931b18;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  padding: 10px 0;
}
.indicador-card {
  background: white;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f0f0f0;
}
.indicador-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
  border-color: #d4af37;
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.card-icon { font-size: 1.3rem; color: #931b18; }
.card-categoria {
  font-size: 0.62rem;
  font-weight: 700;
  color: #aaa;
  letter-spacing: 1px;
}
.card-nome {
  font-size: 0.88rem;
  font-weight: 700;
  color: #931b18;
  line-height: 1.3;
  margin-bottom: 4px;
}
.card-valor {
  font-size: 1.9rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1;
  margin-bottom: 10px;
}
.progresso-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.prog-label {
  font-size: 0.62rem;
  color: #aaa;
  font-weight: 700;
}
.prog-pct {
  font-size: 0.75rem;
  font-weight: 700;
  color: #555;
}
.barra-bg {
  height: 5px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 14px;
}
.barra-fill {
  height: 100%;
  border-radius: 3px;
}
.btn-saber {
  margin-top: auto;
  background: #931b18;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-saber:hover { background: #7a1614; }

.outros-lista {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.outro-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.outro-item:hover {
  transform: translateX(8px);
  border-color: #d4af37;
}
.outro-esq {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}
.outro-icone { font-size: 1.1rem; }
.outro-nome { font-size: 0.88rem; color: #333; }
.outro-valor {
  font-size: 1rem;
  font-weight: 800;
  color: #d4af37;
  margin: 0 25px;
}
.btn-exportar-outro {
  background: #931b18;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-exportar-outro:hover { background: #7a1614; }

.col-direita {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 20px;
}
.btn-guia {
  background: #931b18;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-guia .icon-circle {
  border: 2px solid white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.btn-guia:hover {
  background: #7a1614;
  transform: translateY(-5px);
}
.exportar-box {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
.exportar-header h3 {
  color: #931b18;
  margin: 0 0 5px;
  font-size: 1.2rem;
}
.exportar-header p {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 20px;
}
.btn-action {
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.btn-action.csv {
  background: #931b18;
  color: white;
  border: none;
}
.btn-action.csv:hover { background: #7a1614; }
.btn-action.pdf {
  background: white;
  color: #931b18;
  border: 2px solid #931b18;
}
.btn-action.pdf:hover { background: #fdf2f2; }
.btn-action.json {
  background: #2e6bbf;
  color: white;
  border: none;
}
.btn-action.json:hover { background: #1a4e9a; }
.inner-divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
}
.sync-label {
  font-size: 0.7rem;
  font-weight: bold;
  color: #999;
  letter-spacing: 1px;
  margin-bottom: 12px;
}
.sync-time {
  color: #931b18;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}
.check-circle {
  color: #ffcc00;
  border: 2px solid #ffcc00;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

/* ========== MODAIS ========== */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}
.export-card {
  background: #931b18;
  width: 90%;
  max-width: 550px;
  padding: 40px;
  border-radius: 15px;
  position: relative;
  color: white;
  text-align: center;
  box-shadow: 0 15px 50px rgba(0,0,0,0.6);
}
.export-card p {
  margin-bottom: 20px; 
  line-height: 1.6; 
}
.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.6rem;
  cursor: pointer;
  opacity: 0.8;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
}
.close-btn:hover { opacity: 1; }
.main-download-icon { font-size: 3rem; display: block; margin-bottom: 10px; }
.export-header h2 {
  font-size: 1.8rem;
  margin-bottom: 8px;
  color: #FFD700;
}
.export-header p {
  font-size: 0.95rem;
  margin-bottom: 20px;
  opacity: 0.9;
}
.export-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.export-item {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 10px;
  padding: 12px 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;
}
.export-item:hover { background: rgba(255,255,255,0.2); }
.export-item .ext { opacity: 0.6; font-family: monospace; }

.metodologia-card { max-width: 600px; text-align: left; }
.metodologia-content { margin: 20px 0; }
.metodologia-content h3 {
  color: white;
  font-weight: bold;
  margin: 15px 0 8px;
  font-size: 1.2rem;
}
.metodologia-content p, .metodologia-content ul {
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 5px 0 10px;
  color: rgba(255,255,255,0.9);
}
.metodologia-content ul { padding-left: 20px; }
.metodologia-content li { margin: 5px 0; }

.saber-mais-card { max-width: 600px; text-align: left; }
.saber-mais-content { margin: 20px 0; }
.saber-mais-content h3 {
  color: #FFD700;
  margin: 15px 0 8px;
  font-size: 1.1rem;
}
.saber-mais-content p { font-size: 0.9rem; line-height: 1.5; margin: 8px 0; }
.barra-bg-saber {
  height: 8px;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 10px 0;
}
.barra-fill-saber { height: 100%; border-radius: 4px; }

.outro-detalhes-modal {
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 15px;
  margin: 20px 0;
  text-align: left;
  font-size: 0.9rem;
}
.outro-detalhes-modal p { margin: 8px 0; }

.pais-indicador-tabela {
  font-size: 0.7em;
  color: #333;
  background: #f5f5f5;
  padding: 3px 10px;
  border-radius: 20px;
  margin-left: 10px;
  font-weight: 600;
  border: 1px solid #ddd;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem;
  white-space: normal;
  word-break: keep-all;
}

@media (max-width: 1100px) {
  .main-layout { grid-template-columns: 1fr; }
  .col-direita { width: 100%; }
}

@media (max-width: 768px) {
  .filtros-row { flex-direction: column; }
  .cards-grid { grid-template-columns: 1fr; }
  .section-header h2 { flex-direction: column; align-items: flex-start; }
  .pais-indicador-tabela { margin-left: 0; margin-top: 0.25rem; }
}
</style>