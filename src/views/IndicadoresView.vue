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
              <h1>Indicadores Comuns</h1>
              <p>Acompanhamento detalhado do reporte semestral dos 14 indicadores de reporte obrigatório do Plano de Recuperação e Resiliência (PRR) em Portugal.</p>
            </div>
          </div>

          <!-- FILTROS -->
          <div class="filtros-row">
            <div class="filtro-group">
              <label>PAÍS</label>
              <div class="select-wrapper">
                <select v-model="paisSelecionado">
                  <option value="pt">Portugal</option>
                  <option value="es">Espanha</option>
                  <option value="fr">França</option>
                  <option value="it">Itália</option>
                  <option value="al">Alemanha</option>
                  <option value="gr">Grécia</option>
                  <option value="cr">Croácia</option>
                  <option value="rmn">Roménia</option>
                </select>
              </div>
            </div>
            <div class="filtro-group">
              <label>PERÍODO DE REPORTE</label>
              <div class="select-wrapper">
                <select v-model="periodoSelecionado">
                  <option value="s2-2025">2º Semestre 2025</option>
                  <option value="s1-2025">1º Semestre 2025</option>
                  <option value="s2-2024">2º Semestre 2024</option>
                  <option value="s1-2024">1º Semestre 2024</option>
                  <option value="s2-2023">2º Semestre 2023</option>
                  <option value="s1-2023">1º Semestre 2023</option>
                </select>
              </div>
            </div>
          </div>

          <!-- SECÇÃO INDICADORES -->
          <div class="section-header">
            <div class="section-bar"></div>
            <h2>Indicadores de Performance</h2>
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
                <span class="prog-label">PROGRESSO META</span>
                <span class="prog-pct">{{ ind.progresso }}%</span>
              </div>
              <div class="barra-bg">
                <div class="barra-fill" :style="{ width: ind.progresso + '%', background: corBarraCard(ind.progresso) }"></div>
              </div>
              <button class="btn-saber" @click="abrirSaberMais(ind.id)">Saber Mais →</button>
            </div>
          </div>

          <!-- OUTROS INDICADORES -->
          <div class="section-header" style="margin-top: 70px;">
            <div class="section-bar"></div>
            <h2>Outros Indicadores Obrigatórios</h2>
          </div>

          <div class="outros-lista">
            <div class="outro-item" v-for="outro in outrosIndicadores" :key="outro.id">
              <div class="outro-esq">
                <span class="outro-icone">{{ outro.icone }}</span>
                <span class="outro-nome">{{ outro.nome }}</span>
              </div>
              <span class="outro-valor">{{ outro.valor }}</span>
              <button class="btn-exportar-outro" @click="exportarOutroIndividual(outro)">Exportar</button>
            </div>
          </div>

        </div>

        <!-- COLUNA DIREITA (painel fixo) -->
        <div class="col-direita">

          <button class="btn-guia" @click="abrirMetodologia">
            <span class="icon-circle">?</span> Guia de Metodologia
          </button>

          <div class="exportar-box">
            <div class="exportar-header">
              <span class="icon-download">📥</span>
              <div>
                <h3>Exportar Dados</h3>
                <p>Obtenha os dados consolidados de todos os 14 indicadores para análise externa.</p>
              </div>
            </div>

            <button class="btn-action csv" @click="exportar('csv')">
              <span class="btn-icon">📄</span> Descarregar CSV
            </button>

            <button class="btn-action pdf" @click="exportar('pdf')">
              <span class="btn-icon">📑</span> Relatório PDF
            </button>

            <hr class="inner-divider">

            <div class="sync-status">
              <p class="sync-label">ESTADO DE SINCRONIZAÇÃO</p>
              <div class="sync-time">
                <span class="check-circle">✔</span>
                <span>Atualizado hoje, 09:42</span>
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
          <h2>Guia de Metodologia</h2>
          <p>Como os indicadores são calculados e reportados</p>
        </div>
        <div class="metodologia-content">
          <h3>📊 Fontes de Dados</h3>
          <p>Os dados são recolhidos junto das entidades gestoras do PRR, com validação pela Comissão Europeia e Auditoria Interna.</p>
          
          <h3>🔄 Periodicidade</h3>
          <p>Reporte semestral (Janeiro e Julho) com atualização dos marcos e metas alcançados.</p>
          
          <h3>⚙️ Metodologia de Cálculo</h3>
          <p>O progresso de cada indicador é calculado com base no rácio entre o valor realizado e a meta estabelecida no plano original, expresso em percentagem.</p>
          
          <h3>✅ Níveis de Progresso</h3>
          <ul>
            <li><span style="color:#d4af37;">0% – 39%</span>: Atraso significativo</li>
            <li><span style="color:#d4af37;">40% – 74%</span>: Progresso moderado</li>
            <li><span style="color:#931b18;">75% – 100%</span>: Próximo ou atingido</li>
          </ul>
          
          <h3>🔍 Transparência</h3>
          <p>Todos os dados são públicos e podem ser exportados nos formatos CSV, JSON e PDF através do painel lateral.</p>
        </div>
        <div class="export-options" style="margin-top: 20px;">
          <button class="export-item" @click="showMetodologiaModal = false">Fechar</button>
        </div>
      </div>
    </div>

    <!-- MODAL DADOS ABERTOS -->
    <div v-if="showDadosAbertosModal" class="modal-overlay" @click.self="showDadosAbertosModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showDadosAbertosModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📂</span>
          <h2>Dados Abertos</h2>
          <p>Acesso a conjuntos de dados públicos do PRR</p>
        </div>
        <div style="text-align:left; margin:20px 0;">
          <p>Os dados utilizados neste portal são públicos e podem ser acedidos através de:</p>
          <ul style="margin-top:10px; padding-left:20px;">
            <li><a href="https://recuperarportugal.gov.pt/" target="_blank" style="color:#FFD700;">Portal do PRR Portugal</a></li>
            <li><a href="https://ec.europa.eu/eurostat" target="_blank" style="color:#FFD700;">Eurostat</a></li>
            <li><a href="https://data.europa.eu/" target="_blank" style="color:#FFD700;">Data Europa</a></li>
          </ul>
          <p style="margin-top:15px;">Os ficheiros exportados (CSV, JSON, PDF) podem ser reutilizados livremente para fins académicos e de investigação.</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="showDadosAbertosModal = false">Fechar</button>
        </div>
      </div>
    </div>

    <!-- MODAL FAQ -->
    <div v-if="showFAQModal" class="modal-overlay" @click.self="showFAQModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showFAQModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">❓</span>
          <h2>Perguntas Frequentes</h2>
          <p>FAQ – Plano de Recuperação e Resiliência</p>
        </div>
        <div style="text-align:left; margin:20px 0;">
          <p><strong>1. O que é o PRR?</strong><br>É o Plano de Recuperação e Resiliência de Portugal, financiado pela UE.</p>
          <p><strong>2. Como são atualizados os indicadores?</strong><br>Reporte semestral oficial.</p>
          <p><strong>3. Posso exportar os dados?</strong><br>Sim, através dos botões de exportação (CSV, JSON, PDF).</p>
          <p><strong>4. Onde posso obter mais informações?</strong><br>No site oficial recuperarportugal.gov.pt.</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="showFAQModal = false">Fechar</button>
        </div>
      </div>
    </div>

    <!-- MODAL CONTACTOS -->
    <div v-if="showContactosModal" class="modal-overlay" @click.self="showContactosModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showContactosModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📞</span>
          <h2>Contactos</h2>
          <p>Fale connosco</p>
        </div>
        <div style="text-align:left; margin:20px 0;">
          <p><strong>Email:</strong> <a href="mailto:info@prr-europa.eu" style="color:#FFD700;">info@prr-europa.eu</a></p>
          <p><strong>Telefone:</strong> +351 XXX XXX XXX</p>
          <p><strong>Morada:</strong> União Europeia</p>
          <p><strong>Horário:</strong> Segunda a Sexta, 9h00 – 18h00</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="showContactosModal = false">Fechar</button>
        </div>
      </div>
    </div>

    <!-- MODAL PRIVACIDADE -->
    <div v-if="showPrivacidadeModal" class="modal-overlay" @click.self="showPrivacidadeModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showPrivacidadeModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">🔒</span>
          <h2>Política de Privacidade</h2>
          <p>Como os seus dados são protegidos</p>
        </div>
        <div style="text-align:left; margin:20px 0;">
          <p>Este site não recolhe dados pessoais sem consentimento. Os dados de navegação são anónimos. Para mais informações, contacte o nosso Encarregado de Proteção de Dados.</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="showPrivacidadeModal = false">Fechar</button>
        </div>
      </div>
    </div>

    <!-- MODAL TERMOS E CONDIÇÕES -->
    <div v-if="showTermosModal" class="modal-overlay" @click.self="showTermosModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showTermosModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">⚖️</span>
          <h2>Termos e Condições</h2>
          <p>Utilização do portal</p>
        </div>
        <div style="text-align:left; margin:20px 0;">
          <p>Todo o conteúdo é disponibilizado para fins académicos e informativos. É permitida a reprodução parcial desde que citada a fonte.</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="showTermosModal = false">Fechar</button>
        </div>
      </div>
    </div>

    <!-- MODAL COOKIES -->
    <div v-if="showCookiesModal" class="modal-overlay" @click.self="showCookiesModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showCookiesModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">🍪</span>
          <h2>Política de Cookies</h2>
          <p>Como utilizamos cookies</p>
        </div>
        <div style="text-align:left; margin:20px 0;">
          <p>Este site utiliza cookies apenas para funcionalidades essenciais (não rastreia utilizadores). Não são utilizados cookies de terceiros.</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="showCookiesModal = false">Fechar</button>
        </div>
      </div>
    </div>

    <!-- MODAL SABER MAIS (detalhes do indicador) -->
    <div v-if="showSaberMaisModal" class="modal-overlay" @click.self="showSaberMaisModal = false">
      <div class="export-card saber-mais-card">
        <button class="close-btn" @click="showSaberMaisModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">{{ indicadorAtual?.icone }}</span>
          <h2>{{ indicadorAtual?.nome }}</h2>
          <p>{{ indicadorAtual?.categoria }}</p>
        </div>
        <div class="saber-mais-content">
          <p><strong>Valor atual:</strong> {{ indicadorAtual?.valor }}</p>
          <p><strong>Progresso:</strong> {{ indicadorAtual?.progresso }}%</p>
          <div class="barra-bg-saber">
            <div class="barra-fill-saber" :style="{ width: indicadorAtual?.progresso + '%', background: corBarraModal(indicadorAtual?.progresso) }"></div>
          </div>
          <!-- País e período selecionados -->
          <div style="background: rgba(255,255,255,0.15); border-radius: 8px; padding: 8px 12px; margin: 10px 0; text-align: center;">
            📍 {{ nomePaisAtual }} | 📅 {{ nomePeriodoAtual }}
          </div>
          <hr>
          <h3>🔍 Sobre este indicador</h3>
          <p><strong>Descrição:</strong> 
            <span v-if="indicadorAtual?.id === 1">Número de participantes que concluíram ações de formação financiadas pelo PRR nas áreas de qualificação e requalificação profissional.</span>
            <span v-else-if="indicadorAtual?.id === 2">Capacidade instalada de energias renováveis (MW) com apoio do PRR.</span>
            <span v-else-if="indicadorAtual?.id === 3">Número de serviços públicos digitais disponibilizados à população.</span>
            <span v-else-if="indicadorAtual?.id === 4">Habitações renovadas ou construídas ao abrigo do programa de habitação social.</span>
            <span v-else-if="indicadorAtual?.id === 5">Número de pequenas e médias empresas apoiadas para inovação e digitalização.</span>
            <span v-else-if="indicadorAtual?.id === 6">Incremento de camas ou equipamentos no Serviço Nacional de Saúde.</span>
          </p>
          <p><strong>Meta nacional:</strong> 
            <span v-if="indicadorAtual?.id === 1">650.000 participantes</span>
            <span v-else-if="indicadorAtual?.id === 2">2.500 MW</span>
            <span v-else-if="indicadorAtual?.id === 3">1.500 serviços</span>
            <span v-else-if="indicadorAtual?.id === 4">25.000 habitações</span>
            <span v-else-if="indicadorAtual?.id === 5">8.000 PME</span>
            <span v-else-if="indicadorAtual?.id === 6">1.200 camas</span>
          </p>
          <p><strong>Fonte:</strong> Comissão Europeia / PRR Relatório Semestral</p>
          <p><strong>Última atualização:</strong> {{ new Date().toLocaleDateString('pt-PT') }}</p>
        </div>
        <div class="export-options" style="margin-top: 20px;">
          <button class="export-item" @click="showSaberMaisModal = false">Fechar</button>
        </div>
      </div>
    </div>

    <!-- MODAL EXPORTAÇÃO OUTROS INDICADORES (individual) -->
    <div v-if="showExportOutroModal" class="modal-overlay" @click.self="showExportOutroModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showExportOutroModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📤</span>
          <h2>Exportar Indicador</h2>
          <p>{{ outroSelecionado?.nome }}</p>
        </div>
        <div class="outro-detalhes-modal">
          <p><strong>Valor atual:</strong> {{ outroSelecionado?.valor }}</p>
          <p><strong>País:</strong> {{ nomePaisAtual }}</p>
          <p><strong>Período:</strong> {{ nomePeriodoAtual }}</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="exportarOutroIndividualAcao('csv')">
            <span>Exportar como CSV</span>
            <span class="ext">.csv</span>
          </button>
          <button class="export-item" @click="exportarOutroIndividualAcao('json')">
            <span>Feed de Dados (JSON)</span>
            <span class="ext">.json</span>
          </button>
          <button class="export-item" @click="exportarOutroIndividualAcao('pdf')">
            <span>Sumário em PDF</span>
            <span class="ext">.pdf</span>
          </button>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="ind-footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="footer-logo">🏛️ Portal de Transparência PRR</span>
          <p>Monitorização oficial dos Indicadores Comuns do Plano de Recuperação e Resiliência em Portugal. Garantindo total transparência e rigor.</p>
          <div class="footer-icons">
            <button type="button" class="icon-btn" @click="copiarLinkSimples">
              <span>🔗</span>
            </button>
            <button type="button" class="icon-btn" @click="abrirEmailSimples">
              <span>✉️</span>
            </button>
          </div>
        </div>
        <div class="footer-col">
          <p class="footer-col-titulo">ACESSO RÁPIDO</p>
          <ul>
            <li><a @click="abrirMetodologia" style="cursor: pointer;">Metodologia</a></li>
            <li><a @click="abrirDadosAbertos" style="cursor: pointer;">Dados Abertos</a></li>
            <li><a @click="abrirFAQ" style="cursor: pointer;">FAQ</a></li>
            <li><a @click="abrirContactos" style="cursor: pointer;">Contactos</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <p class="footer-col-titulo">INFORMAÇÃO LEGAL</p>
          <ul>
            <li><a @click="abrirPrivacidade" style="cursor: pointer;">Privacidade</a></li>
            <li><a @click="abrirTermos" style="cursor: pointer;">Termos e Condições</a></li>
            <li><a @click="abrirCookies" style="cursor: pointer;">Cookies</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 Plano de Recuperação e Resiliência. Todos os direitos reservados.</span>
        <span class="footer-status"><span class="sync-dot"></span> Portugal | Reporte Semestral</span>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const paisSelecionado = ref('pt')
const periodoSelecionado = ref('s1-2025')

// ============================================================
// BASE DE DADOS COMPLETA (Portugal e Espanha)
// ============================================================
const dadosPortugal = {
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

// Dados de Espanha completos para todos os semestres
const dadosEspanha = {
  's1-2023': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCAÇÃO', nome: 'Participantes em formação', valor: '1.020.000', progresso: 52 },
      { id: 2, icone: '⚡', categoria: 'ENERGIA', nome: 'Capacidade renovável', valor: '2.450 MW', progresso: 28 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Serviços públicos digitais', valor: '1.800', progresso: 60 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Habitação social renovada', valor: '18.500', progresso: 35 },
      { id: 5, icone: '📊', categoria: 'ECONOMIA', nome: 'Apoio a PME e Inovação', valor: '5.620', progresso: 24 },
      { id: 6, icone: '🏥', categoria: 'SAÚDE', nome: 'Capacidade hospitalar', valor: '1.450', progresso: 50 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'Redução de emissões de CO2', valor: '10% Redução' },
      { id: 2, icone: '🚌', nome: 'Mobilidade sustentável urbana', valor: '180 novas rotas' },
      { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€980M' }
    ]
  },
  's2-2023': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCAÇÃO', nome: 'Participantes em formação', valor: '1.078.000', progresso: 55 },
      { id: 2, icone: '⚡', categoria: 'ENERGIA', nome: 'Capacidade renovável', valor: '2.680 MW', progresso: 31 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Serviços públicos digitais', valor: '1.950', progresso: 65 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Habitação social renovada', valor: '20.200', progresso: 38 },
      { id: 5, icone: '📊', categoria: 'ECONOMIA', nome: 'Apoio a PME e Inovação', valor: '6.100', progresso: 26 },
      { id: 6, icone: '🏥', categoria: 'SAÚDE', nome: 'Capacidade hospitalar', valor: '1.580', progresso: 55 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'Redução de emissões de CO2', valor: '12% Redução' },
      { id: 2, icone: '🚌', nome: 'Mobilidade sustentável urbana', valor: '205 novas rotas' },
      { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€1.050M' }
    ]
  },
  's1-2024': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCAÇÃO', nome: 'Participantes em formação', valor: '1.142.000', progresso: 58 },
      { id: 2, icone: '⚡', categoria: 'ENERGIA', nome: 'Capacidade renovável', valor: '2.920 MW', progresso: 34 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Serviços públicos digitais', valor: '2.120', progresso: 70 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Habitação social renovada', valor: '22.100', progresso: 42 },
      { id: 5, icone: '📊', categoria: 'ECONOMIA', nome: 'Apoio a PME e Inovação', valor: '6.650', progresso: 28 },
      { id: 6, icone: '🏥', categoria: 'SAÚDE', nome: 'Capacidade hospitalar', valor: '1.720', progresso: 60 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'Redução de emissões de CO2', valor: '14% Redução' },
      { id: 2, icone: '🚌', nome: 'Mobilidade sustentável urbana', valor: '232 novas rotas' },
      { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€1.130M' }
    ]
  },
  's2-2024': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCAÇÃO', nome: 'Participantes em formação', valor: '1.210.000', progresso: 62 },
      { id: 2, icone: '⚡', categoria: 'ENERGIA', nome: 'Capacidade renovável', valor: '3.180 MW', progresso: 37 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Serviços públicos digitais', valor: '2.310', progresso: 77 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Habitação social renovada', valor: '24.200', progresso: 46 },
      { id: 5, icone: '📊', categoria: 'ECONOMIA', nome: 'Apoio a PME e Inovação', valor: '7.250', progresso: 31 },
      { id: 6, icone: '🏥', categoria: 'SAÚDE', nome: 'Capacidade hospitalar', valor: '1.880', progresso: 66 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'Redução de emissões de CO2', valor: '16% Redução' },
      { id: 2, icone: '🚌', nome: 'Mobilidade sustentável urbana', valor: '260 novas rotas' },
      { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€1.220M' }
    ]
  },
  's1-2025': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCAÇÃO', nome: 'Participantes em formação', valor: '1.283.000', progresso: 66 },
      { id: 2, icone: '⚡', categoria: 'ENERGIA', nome: 'Capacidade renovável', valor: '3.460 MW', progresso: 40 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Serviços públicos digitais', valor: '2.520', progresso: 84 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Habitação social renovada', valor: '26.500', progresso: 50 },
      { id: 5, icone: '📊', categoria: 'ECONOMIA', nome: 'Apoio a PME e Inovação', valor: '7.890', progresso: 34 },
      { id: 6, icone: '🏥', categoria: 'SAÚDE', nome: 'Capacidade hospitalar', valor: '2.050', progresso: 72 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'Redução de emissões de CO2', valor: '18% Redução' },
      { id: 2, icone: '🚌', nome: 'Mobilidade sustentável urbana', valor: '290 novas rotas' },
      { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€1.320M' }
    ]
  },
  's2-2025': {
    principais: [
      { id: 1, icone: '🎓', categoria: 'EDUCAÇÃO', nome: 'Participantes em formação', valor: '1.360.000', progresso: 70 },
      { id: 2, icone: '⚡', categoria: 'ENERGIA', nome: 'Capacidade renovável', valor: '3.780 MW', progresso: 44 },
      { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Serviços públicos digitais', valor: '2.750', progresso: 92 },
      { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Habitação social renovada', valor: '29.000', progresso: 55 },
      { id: 5, icone: '📊', categoria: 'ECONOMIA', nome: 'Apoio a PME e Inovação', valor: '8.600', progresso: 37 },
      { id: 6, icone: '🏥', categoria: 'SAÚDE', nome: 'Capacidade hospitalar', valor: '2.240', progresso: 79 }
    ],
    outros: [
      { id: 1, icone: '🌿', nome: 'Redução de emissões de CO2', valor: '20% Redução' },
      { id: 2, icone: '🚌', nome: 'Mobilidade sustentável urbana', valor: '325 novas rotas' },
      { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€1.430M' }
    ]
  }
}

// Multiplicadores para países dinâmicos
const multiplicadoresPais = {
  fr: { escala: 1.3, nome: 'França' },
  it: { escala: 1.2, nome: 'Itália' },
  al: { escala: 1.5, nome: 'Alemanha' },
  gr: { escala: 0.7, nome: 'Grécia' },
  cr: { escala: 0.5, nome: 'Croácia' },
  rmn: { escala: 0.6, nome: 'Roménia' }
}

function gerarDadosDinamicos(pais, periodo) {
  const mult = multiplicadoresPais[pais]?.escala || 1.0
  const dadosBase = dadosPortugal[periodo]
  if (!dadosBase) return null
  
  const novosPrincipais = dadosBase.principais.map(ind => {
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
  
  const novosOutros = dadosBase.outros.map(out => {
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
  
  return { principais: novosPrincipais, outros: novosOutros }
}

function obterDadosPorPaisPeriodo(pais, periodo) {
  if (pais === 'pt') return dadosPortugal[periodo] || dadosPortugal['s2-2025']
  if (pais === 'es') return dadosEspanha[periodo] || dadosEspanha['s2-2025']
  const gerado = gerarDadosDinamicos(pais, periodo)
  return gerado || dadosPortugal[periodo] || dadosPortugal['s2-2025']
}

// Propriedades computadas
const indicadores = computed(() => {
  const dados = obterDadosPorPaisPeriodo(paisSelecionado.value, periodoSelecionado.value)
  return dados.principais
})

const outrosIndicadores = computed(() => {
  const dados = obterDadosPorPaisPeriodo(paisSelecionado.value, periodoSelecionado.value)
  return dados.outros
})

// Nomes legíveis
const nomePaisAtual = computed(() => {
  const map = { pt: 'Portugal', es: 'Espanha', fr: 'França', it: 'Itália', al: 'Alemanha', gr: 'Grécia', cr: 'Croácia', rmn: 'Roménia' }
  return map[paisSelecionado.value] || paisSelecionado.value.toUpperCase()
})

const nomePeriodoAtual = computed(() => {
  const map = {
    's1-2023': '1º Semestre 2023', 's2-2023': '2º Semestre 2023',
    's1-2024': '1º Semestre 2024', 's2-2024': '2º Semestre 2024',
    's1-2025': '1º Semestre 2025', 's2-2025': '2º Semestre 2025'
  }
  return map[periodoSelecionado.value] || periodoSelecionado.value
})

// Estados dos modais (incluindo novos)
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

// Computed que busca o indicador atualizado na lista reativa
const indicadorAtual = computed(() => {
  if (!indicadorIdSelecionado.value) return null
  return indicadores.value.find(ind => ind.id === indicadorIdSelecionado.value)
})

// Funções para abrir modais (acesso rápido e info legal)
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

// Fechar o modal Saber Mais se os filtros mudarem (evita dados inconsistentes)
watch([paisSelecionado, periodoSelecionado], () => {
  if (showSaberMaisModal.value) {
    showSaberMaisModal.value = false
  }
})

function exportarOutroIndividualAcao(formato) {
  const outro = outroSelecionado.value
  if (!outro) return
  const dataGeracao = new Date().toLocaleDateString('pt-PT')
  const nomeLimpo = outro.nome.replace(/\s+/g, '_').toLowerCase()
  const pais = nomePaisAtual.value
  const periodo = nomePeriodoAtual.value
  const codigoPais = paisSelecionado.value
  const codigoPeriodo = periodoSelecionado.value

  if (formato === 'csv') {
    const csv = `Indicador;${outro.nome}\nValor;${outro.valor}\nPaís;${pais}\nPeríodo;${periodo}\nData de exportação;${dataGeracao}`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${nomeLimpo}_${codigoPais}_${codigoPeriodo}.csv`
    a.click()
    URL.revokeObjectURL(url)
  } 
  else if (formato === 'json') {
    const dados = {
      indicador: outro.nome,
      valor: outro.valor,
      pais: pais,
      periodo: periodo,
      dataExportacao: dataGeracao,
      codigoPais: codigoPais,
      codigoPeriodo: codigoPeriodo
    }
    const json = JSON.stringify(dados, null, 2)
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
    win.document.write(`
      <html>
        <head><title>${outro.nome} - PRR</title></head>
        <body style="font-family:sans-serif; padding:40px;">
          <h1 style="color:#931b18;">${outro.nome}</h1>
          <p><strong>Valor:</strong> ${outro.valor}</p>
          <p><strong>País:</strong> ${pais}</p>
          <p><strong>Período:</strong> ${periodo}</p>
          <p><strong>Data de exportação:</strong> ${dataGeracao}</p>
        </body>
      </html>
    `)
    win.document.close()
    win.print()
  }
  showExportOutroModal.value = false
}

// Cores das barras: cards principais (fundo branco) vs modal (fundo vermelho)
function corBarraCard(pct) {
  if (pct >= 75) return '#931b18'   // vermelho escuro (contrasta com branco)
  return '#d4af37'
}
function corBarraModal(pct) {
  if (pct >= 75) return '#ff6b6b'   // vermelho claro (visível no fundo vermelho escuro)
  return '#d4af37'
}

// Exportação global (todos os indicadores)
function exportar(tipo) {
  // Busca os valores mais recentes das computed properties
  const inds = [...indicadores.value]      // cópia atual dos 6 indicadores
  const outros = [...outrosIndicadores.value]  // cópia atual dos 3 outros
  const pais = nomePaisAtual.value
  const periodo = nomePeriodoAtual.value
  const dataGeracao = new Date().toLocaleDateString('pt-PT')
  const codigoPais = paisSelecionado.value
  const codigoPeriodo = periodoSelecionado.value

  if (tipo === 'csv') {
    let csv = `Relatório de Indicadores PRR\n`
    csv += `País;${pais}\n`
    csv += `Período;${periodo}\n`
    csv += `Data de geração;${dataGeracao}\n\n`
    csv += `INDICADORES DE PERFORMANCE\n`
    csv += `Indicador;Valor;Progresso (%)\n`
    inds.forEach(ind => {
      csv += `${ind.nome};${ind.valor};${ind.progresso}\n`
    })
    csv += `\nOUTROS INDICADORES OBRIGATÓRIOS\n`
    csv += `Indicador;Valor\n`
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
  else if (tipo === 'pdf') {
    let html = `
      <html>
        <head><title>Indicadores PRR - ${pais} (${periodo})</title></head>
        <body style="font-family:sans-serif; padding:40px;">
          <h1 style="color:#931b18;">Indicadores Comuns do PRR</h1>
          <p><strong>País:</strong> ${pais}</p>
          <p><strong>Período:</strong> ${periodo}</p>
          <p><strong>Data:</strong> ${dataGeracao}</p>
          <h2>Indicadores de Performance</h2>
          <table border="1" cellpadding="8" style="border-collapse:collapse; width:100%">
            <tr style="background:#931b18; color:white;"><th>Indicador</th><th>Valor</th><th>Progresso (%)</th></tr>
            ${inds.map(ind => `<tr><td>${ind.nome}</td><td>${ind.valor}</td><td>${ind.progresso}</td></tr>`).join('')}
          </table>
          <h2>Outros Indicadores Obrigatórios</h2>
          <table border="1" cellpadding="8" style="border-collapse:collapse; width:100%">
            <tr style="background:#931b18; color:white;"><th>Indicador</th><th>Valor</th></tr>
            ${outros.map(out => `<tr><td>${out.nome}</td><td>${out.valor}</td></tr>`).join('')}
          </table>
        </body>
      </html>
    `
    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
    win.print()
  }
}

// Funções do footer
function copiarLinkSimples() {
  const url = window.location.href;
  const input = document.createElement('input');
  input.value = url;
  document.body.appendChild(input);
  input.select();
  try { document.execCommand('copy'); alert('✅ Link copiado: ' + url); } catch(e) { alert('❌ Não foi possível copiar.'); }
  document.body.removeChild(input);
}

function abrirEmailSimples() {
  window.location.href = 'mailto:info@prr-europa.eu';
  setTimeout(() => { alert('Se o email não abriu, envie para info@prr-europa.eu'); }, 500);
}
</script>

<style scoped>
/* ========== TODO O SEU CSS ORIGINAL (MANTENHA) ========== */
* { box-sizing: border-box; }

/* Animações para notificações */
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

.card-icon { 
  font-size: 1.3rem; 
  color: #931b18; 
}

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

.btn-saber:hover { 
  background: #7a1614; 
}

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

.outro-icone { 
  font-size: 1.1rem; 
}

.outro-nome { 
  font-size: 0.88rem; 
  color: #333; 
}

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

.btn-exportar-outro:hover { 
  background: #7a1614; 
}

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

.btn-action.csv:hover { 
  background: #7a1614; 
}

.btn-action.pdf {
  background: white;
  color: #931b18;
  border: 2px solid #931b18;
}

.btn-action.pdf:hover { 
  background: #fdf2f2; 
}

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
  font-size: 3rem; 
  display: block; 
  margin-bottom: 10px; 
}

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

.export-item:hover { 
  background: rgba(255,255,255,0.2); 
}

.export-item .ext { 
  opacity: 0.6; 
  font-family: monospace; 
}

/* Modal Metodologia */
.metodologia-card { 
  max-width: 600px; 
  text-align: left; 
}

.metodologia-content { 
  margin: 20px 0; 
}

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

.metodologia-content ul { 
  padding-left: 20px; 
}

.metodologia-content li { 
  margin: 5px 0; 
}

/* Modal Saber Mais */
.saber-mais-card { 
  max-width: 600px; 
  text-align: left; 
}

.saber-mais-content { 
  margin: 20px 0; 
}

.saber-mais-content h3 {
  color: #FFD700;
  margin: 15px 0 8px;
  font-size: 1.1rem;
}

.saber-mais-content p { 
  font-size: 0.9rem; 
  line-height: 1.5; 
  margin: 8px 0; 
}

.barra-bg-saber {
  height: 8px;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 10px 0;
}

.barra-fill-saber { 
  height: 100%; 
  border-radius: 4px; 
}

/* Outros detalhes modais */
.outro-detalhes-modal {
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 15px;
  margin: 20px 0;
  text-align: left;
  font-size: 0.9rem;
}

.outro-detalhes-modal p { 
  margin: 8px 0; 
}

/* FOOTER */
.ind-footer {
  color: white;
  width: 100%;
  background: linear-gradient(to bottom, #d4af37 7px, #931b18 7px);
  box-shadow: 0 400px 0 400px #931b18;
  margin-top: 100px;
  padding: 80px 8% 15px;
  padding-bottom: 10px !important;
  position: relative;
  overflow-x: hidden;
}

.ind-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 7px;
  background-color: #d4af37;
  pointer-events: none;
  transform: translateX(-50%);
  margin-left: 50%;
}

.footer-grid, .footer-bottom {
  position: relative;
  z-index: 1;
}

.footer-grid {
  display: flex;
  justify-content: space-between;
  max-width: 95%;
  width: 95%;
  margin: 0 auto 30px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 500px;
}

.footer-logo {
  font-size: 1.7rem;
  font-weight: 800;
  color: #d4af37;
  white-space: nowrap;
  margin-bottom: 30px;
}

.footer-brand p {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 50px;
  max-width: 420px;
}

.footer-icons {
  display: flex;
  gap: 20px;
  margin-bottom: 80px;
}

.icon-btn {
  background: rgba(255,255,255,0.2);
  width: 55px;
  height: 55px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
}

.icon-btn span { 
  font-size: 1.4rem; 
}

.icon-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-3px);
}

.footer-col-titulo {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 1px;
  margin-bottom: 25px;
  color: #d4af37;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col ul li {
  font-size: 0.82rem;
  opacity: 0.85;
  cursor: pointer;
}

.footer-col ul li a {
  color: white;
  text-decoration: none;
  font-size: 0.88rem;
  transition: opacity 0.2s;
}

.footer-col ul li:hover { 
  opacity: 1; 
  transform: translateX(3px); 
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255,255,255,0.2);
}

.footer-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sync-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #d4af37;
  border-radius: 50%;
}

@media (max-width: 1100px) {
  .main-layout { grid-template-columns: 1fr; }
  .col-direita { width: 100%; }
}
</style>