<template>
  <div class="desembolsos-container">

    <!-- ==================== MODAL DE EXPORTAÇÃO ==================== -->
    <div v-if="showExportModal" class="modal-overlay" @click.self="showExportModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showExportModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">💶</span>
          <h2>Exportar Dados Financeiros</h2>
          <p>Descarregue o balanço financeiro e o histórico de tranches</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="exportarDesembolsos('csv')"><span>Exportar como CSV (Excel)</span><span class="ext">.csv</span></button>
          <button class="export-item" @click="exportarDesembolsos('json')"><span>Feed de Dados (JSON)</span><span class="ext">.json</span></button>
          <button class="export-item" @click="exportarDesembolsos('pdf')"><span>Relatório Financeiro PDF</span><span class="ext">.pdf</span></button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL DE EXPORTAÇÃO INDIVIDUAL (CARD) ==================== -->
    <div v-if="showCardExportModal" class="modal-overlay" @click.self="showCardExportModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showCardExportModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📥</span>
          <h2>Exportar Desembolso</h2>
          <p>{{ cardExportTranche?.nome || 'Tranche selecionada' }}</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="exportarTrancheIndividual('csv')"><span>Exportar como CSV</span><span class="ext">.csv</span></button>
          <button class="export-item" @click="exportarTrancheIndividual('json')"><span>Feed de Dados (JSON)</span><span class="ext">.json</span></button>
          <button class="export-item" @click="exportarTrancheIndividual('pdf')"><span>Comprovativo PDF</span><span class="ext">.pdf</span></button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL DETALHE TRANCHE (novo design) ==================== -->
    <div v-if="trancheDetalhe" class="modal-overlay" @click.self="trancheDetalhe = null">
      <div class="detalhe-tranche-card">
        <div class="detalhe-tranche-img-wrap">
          <img :src="trancheDetalhe.raw?.imagem || trancheDetalhe.imagem || ''" :alt="trancheDetalhe.titulo || trancheDetalhe.nome" class="detalhe-tranche-img" />
          <div class="detalhe-tranche-overlay" :style="{ background: overlayGradienteDesembolsos(trancheDetalhe.setor || 'Transversal') }"></div>
          <div class="detalhe-tranche-img-content">
            <span class="marco-setor-pill">{{ iconeSetor(trancheDetalhe.setor || 'Transversal') }} {{ trancheDetalhe.setor || 'Transversal' }}</span>
            <span :class="['estado-pill', trancheDetalhe.estadoClass || 'planeado']">{{ estadoLabelTranche(trancheDetalhe.estado || 'Planeado') }}</span>
          </div>
          <div class="marco-pais-badge">{{ bandeiraPaisObj(trancheDetalhe.paisCode || trancheDetalhe.raw?.paisCode) }} {{ trancheDetalhe.pais || trancheDetalhe.raw?.pais }}</div>
        </div>
        <div class="detalhe-tranche-body">
          <h2 class="detalhe-tranche-titulo">{{ trancheDetalhe.titulo || trancheDetalhe.nome }}</h2>
          <p class="detalhe-tranche-desc">{{ trancheDetalhe.descricaoCurta || trancheDetalhe.descCurta || trancheDetalhe.raw?.descricaoCurta || 'Sem descrição detalhada.' }}</p>
          
          <!-- Campos fixos com título em cima e valor em baixo -->
          <div class="detalhe-tranche-campos">
            <div class="campo-item campo-valor">
              <div class="campo-titulo">💰 Valor</div>
              <div class="campo-valor-num">{{ formatMoney(trancheDetalhe.montante || trancheDetalhe.valorNum) }}</div>
            </div>
            <div class="campo-item campo-data">
              <div class="campo-titulo">📅 Data</div>
              <div class="campo-valor-num">{{ trancheDetalhe.data || formatDate(trancheDetalhe.dataObj) }}</div>
            </div>
            <div class="campo-item campo-beneficiario-full">
              <div class="campo-titulo">👥 Beneficiário</div>
              <div class="campo-valor-num">
                {{ trancheDetalhe.beneficiario || trancheDetalhe.raw?.beneficiario || 'Não especificado' }}
                <span v-if="getMedalIcon(getBeneficiarioRank(trancheDetalhe.beneficiario || trancheDetalhe.raw?.beneficiario, trancheDetalhe.paisCode || trancheDetalhe.raw?.paisCode))" style="margin-left: 8px;">
                  {{ getMedalIcon(getBeneficiarioRank(trancheDetalhe.beneficiario || trancheDetalhe.raw?.beneficiario, trancheDetalhe.paisCode || trancheDetalhe.raw?.paisCode)) }}
                </span>
              </div>
            </div>
          </div>

          <div class="progresso-wrapper">
            <div class="progresso-header">
              <span>Peso no total do país ({{ nomePaisAtual }})</span>
              <strong>{{ percentagemTranche }}%</strong>
            </div>
            <div class="progresso-bg">
              <div class="progresso-fill" :style="{ width: percentagemTranche + '%', background: '#931b18' }"></div>
            </div>
          </div>
          <div class="detalhe-tranche-actions">
            <button class="btn-export-detalhe" @click="exportarTranchePDF(trancheDetalhe)">📄 Comprovativo PDF</button>
            <button class="btn-export-detalhe" @click="showExportModal = true; trancheDetalhe = null">📥 Exportar dados</button>
            <button class="btn-fechar-detalhe" @click="trancheDetalhe = null">Fechar</button>
          </div>
        </div>
        <button class="close-btn-detalhe" @click="trancheDetalhe = null">✕</button>
      </div>
    </div>

    <!-- ==================== MODAL GUIA DE DESEMBOLSOS ==================== -->
    <div v-if="showGuiaModal" class="modal-overlay" @click.self="showGuiaModal = false">
      <div class="export-card metodologia-card">
        <button class="close-btn" @click="showGuiaModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">💶</span>
          <h2>Guia de Desembolsos</h2>
          <p>Como funcionam os fluxos financeiros do PRR</p>
        </div>
        <div class="metodologia-content">
          <h3>💰 Subvenções vs Empréstimos</h3>
          <p>O Mecanismo de Recuperação e Resiliência é composto por <strong>Subvenções</strong> (fundos perdidos que não requerem devolução), <strong>Empréstimos</strong> (crédito em condições muito favoráveis) e financiamentos <strong>Mistos</strong> (ambos).</p>
          <h3>✅ Baseado no Desempenho</h3>
          <p>Ao contrário dos fundos estruturais tradicionais, os pagamentos do PRR não são baseados em faturas, mas sim no cumprimento comprovado de <strong>Marcos e Metas</strong> (Milestones and Targets).</p>
          <h3>🔄 Processo de Desembolso</h3>
          <ol>
            <li>O Estado-Membro cumpre um conjunto de marcos.</li>
            <li>Submete um "Pedido de Pagamento" à Comissão Europeia.</li>
            <li>A Comissão tem 2 meses para avaliar (fase 'Em Avaliação').</li>
            <li>O Comité Económico e Financeiro aprova e o dinheiro é transferido.</li>
          </ol>
          <h3>🏦 Pré-financiamento</h3>
          <p>Em 2021, os países receberam um adiantamento de 13% do montante total para iniciar os projetos imediatamente.</p>
        </div>
        <div class="export-options" style="margin-top: 20px;">
          <button class="export-item btn-fechar" @click="showGuiaModal = false">Fechar Guia</button>
        </div>
      </div>
    </div>

    <!-- ==================== MINI BAR STICKY ==================== -->
    <div class="sticky-mini-bar" :class="{ visible: showStickyBar }">
      <div class="mini-item"><span class="mini-label">Total Alocado</span><span class="mini-value">{{ formatMoneyReduzido(totalAlocadoReal) }}</span></div>
      <div class="mini-divider"></div>
      <div class="mini-item"><span class="mini-label">Desembolsado</span><span class="mini-value">{{ formatMoneyReduzido(totalDesembolsadoReal) }}</span></div>
      <div class="mini-divider"></div>
      <div class="mini-item"><span class="mini-label">Execução</span><span class="mini-value highlight">{{ taxaExecucaoReal }}%</span></div>
      <div class="mini-divider"></div>
      <div class="mini-item"><span class="mini-label">Próx. Tranche</span><span class="mini-value">{{ proximaTrancheData }}</span></div>
    </div>

    <!-- ==================== HERO SECTION ==================== -->
    <section class="hero">
      <div class="hero-overlay">
        <div class="hero-left" :class="{ 'animate-in': heroVisible }">
          <div class="hero-badge">💶 Monitorização em Tempo Real</div>
          <h1>Desembolsos<br><span class="hero-accent">e Execução</span></h1>
          <p>Acompanhe a execução financeira do PRR: transferências, alocações por pilar e estado dos pedidos de pagamento.</p>
          <div class="hero-actions">
            <button class="btn-hero-primary" @click="showExportModal = true">📥 Exportar Dados</button>
            <button class="btn-hero-outline" @click="scrollSmooth('lista-beneficiarios')">Ver Top 100 Beneficiários</button>
            <button class="btn-hero-outline" @click="showGuiaModal = true">Guia de Desembolsos</button>
          </div>
        </div>
        <div class="hero-stats" :class="{ 'animate-in': heroVisible }">
          <div class="hsc"><div class="hsc-icon-wrap">💶</div><span class="hsc-val">{{ formatMoneyReduzido(totalAlocadoReal) }}</span><span class="hsc-label">Total Alocado</span></div>
          <div class="hsc verde"><div class="hsc-icon-wrap">✅</div><span class="hsc-val">{{ formatMoneyReduzido(totalDesembolsadoReal) }}</span><span class="hsc-label">Total Desembolsado</span></div>
          <div class="hsc amarelo"><div class="hsc-icon-wrap">📊</div><span class="hsc-val">{{ percentagemPais }}%</span><span class="hsc-label">Cobertura de Desembolsos</span></div>
          <div class="hsc"><div class="hsc-icon-wrap">🗓️</div><span class="hsc-val">{{ proximaTrancheData }}</span><span class="hsc-label">Próxima Tranche</span></div>
        </div>
      </div>
    </section>

    <!-- ==================== FILTROS ==================== -->
    <section class="filtros-section" id="filtros">
      <div class="filtros-inner">
        <div class="filtros-left">
          <span class="filtros-titulo">🔍 Filtrar</span>
          <div v-if="filtrosActivos > 0" class="filtros-activos-badge">
            {{ filtrosActivos }} filtro{{ filtrosActivos > 1 ? 's' : '' }} ativo{{ filtrosActivos > 1 ? 's' : '' }}
            · {{ historicoTranches.length }} resultado{{ historicoTranches.length !== 1 ? 's' : '' }}
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
          <div class="filtro-item" :class="{ 'filtro-activo': anoSelecionado !== 'todos' }">
            <label>Ano</label>
            <select v-model="anoSelecionado">
              <option value="todos">Todos os anos</option>
              <option v-for="ano in anosDisponiveis" :key="ano" :value="ano">{{ ano }}</option>
            </select>
          </div>
          <div class="filtro-item" :class="{ 'filtro-activo': estadoSelecionado !== 'todos' }">
            <label>Estado</label>
            <select v-model="estadoSelecionado">
              <option value="todos">Todos os estados</option>
              <option value="Pago">✅ Pago</option>
              <option value="Em Avaliação">⏳ Em Avaliação</option>
              <option value="Planeado">📝 Planeado</option>
            </select>
          </div>
          <button class="btn-limpar" :class="{ 'btn-limpar-activo': filtrosActivos > 0 }" @click="limparFiltros">✕ Limpar</button>
        </div>
      </div>
    </section>

    <!-- ==================== GRÁFICOS ==================== -->
    <section class="graficos-section" id="graficos">
      <div class="graficos-titulo-area">
        <h2>Análise Financeira <span class="pais-indicador-tabela">{{ bandeiraPais }} {{ nomePaisAtual }}</span></h2>
        <p>Desembolsos por ano e distribuição do financiamento — atualização automática com os filtros</p>
      </div>
      <div class="graficos-grid">
        <div class="grafico-card grande">
          <div class="grafico-header">
            <div>
              <h3>📊 Desembolsos por Ano</h3>
              <p class="grafico-sub">Montante total de desembolsos agrupado por ano de pagamento</p>
            </div>
            <button class="btn-export-grafico" @click="exportarGrafico('graficoBarras')">📥 PNG</button>
          </div>
          <div class="grafico-canvas-wrap"><canvas id="graficoBarras"></canvas></div>
          <p class="grafico-legenda-texto">Barras representam o valor total de desembolsos por ano (em EUR)</p>
        </div>
        <div class="grafico-card">
          <div class="grafico-header">
            <div>
              <h3>🍩 {{ modoCircular === 'financiamento' ? 'Composição do Financiamento' : 'Distribuição por Setores' }}</h3>
              <p class="grafico-sub">
                {{ modoCircular === 'financiamento' ? 'Proporção entre Subvenções (fundo perdido) e Empréstimos' : 'Montante de desembolsos por setor de intervenção' }}
              </p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-export-grafico" @click="modoCircular = modoCircular === 'financiamento' ? 'setores' : 'financiamento'"> {{ modoCircular === 'financiamento' ? '📊 Setores' : '💰 Financiamento' }}
              </button>
              <button class="btn-export-grafico" @click="exportarGrafico('graficoDonut')">📥 PNG</button>
            </div>
          </div>
          <div class="donut-wrap">
            <div class="donut-canvas-wrap"><canvas id="graficoDonut"></canvas></div>
            <div class="donut-legenda">
              <template v-if="modoCircular === 'financiamento'">
                <div class="leg-item" v-for="item in totaisPorFinanciamento" :key="item.tipo">
                  <span class="leg-cor" :style="{ background: item.tipo === 'Subvenção' ? '#1a7a4a' : item.tipo === 'Empréstimo' ? '#0077b6' : '#e6a817' }"></span>
                  <div class="leg-info">
                    <span>{{ item.tipo }}</span>
                    <strong>{{ formatMoneyReduzido(item.total) }}</strong>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="leg-item" v-for="item in totaisPorSetor" :key="item.setor">
                  <span class="leg-cor" :style="{ background: coresSetores[item.setor] || '#999' }"></span>
                  <div class="leg-info">
                    <span>{{ item.setor }}</span>
                    <strong>{{ formatMoneyReduzido(item.total) }}</strong>
                  </div>
                </div>
              </template>
              <div class="leg-total"><span>Total</span><strong>{{ formatMoneyReduzido(totalRealDesembolsado) }}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== DESEMBOLSOS EM DESTAQUE ==================== -->
    <section class="lista-section" id="lista-destaque">
      <div class="lista-header">
        <div>
          <h2>Desembolsos em Destaque <span class="pais-indicador-tabela">{{ bandeiraPais }} {{ nomePaisAtual }}</span></h2>
          <p class="lista-sub">Os 3 desembolsos mais recentes</p>
        </div>
        <div class="lista-header-actions">
          <button class="btn-scroll-tabela" @click="scrollSmooth('lista-beneficiarios')">🏆 Ver Top 100</button>
          <button class="btn-scroll-tabela" @click="scrollSmooth('lista-tranches')">📜 Ver histórico</button>
          <button class="btn-scroll-tabela" @click="scrollSmooth('tabela-tranches')">📋 Ver tabela</button>
        </div>
      </div>

      <div class="marcos-grid">
        <div v-for="tranche in desembolsosDestaque" :key="tranche.id" class="marco-card" :class="tranche.statusClass">
          <div class="marco-img-wrap">
            <img :src="tranche.raw.imagem" :alt="tranche.nome" class="marco-img" />
            <div class="marco-img-overlay" :style="{ background: overlayGradienteDesembolsos(tranche.setor) }"></div>
            <div class="marco-img-content">
              <span class="marco-setor-pill">{{ iconeSetor(tranche.setor) }} {{ tranche.setor }}</span>
            </div>
            <div class="marco-pais-badge">{{ bandeiraPaisObj(tranche.paisCode) }} {{ tranche.pais }}</div>
          </div>
          <div class="marco-body">
            <h3 class="marco-titulo">{{ tranche.nome }}</h3>
            <p class="marco-desc">{{ tranche.descCurta }}</p>
            <div class="marco-estado-wrap">
              <span :class="['tabela-badge', tranche.estadoClass, 'destaque-badge']">
                {{ estadoLabelTranche(tranche.estado) }}
              </span>
            </div>
            <div class="marco-meta">
              <span class="meta-item">📅 <strong>{{ tranche.data }}</strong></span>
              <span class="meta-item meta-divider">|</span>
              <span class="meta-item">💰 <strong>{{ formatarValorCurto(tranche.valorNum) }}</strong></span>
            </div>
            <div class="marco-footer">
              <button class="btn-detalhe" @click="mostrarDetalheTranche(tranche)">Ver detalhes →</button>
              <div class="marco-dl" @click="abrirExportCard(tranche)" title="Exportar dados">
                <span class="dl-icon">📥</span>
                <small>CSV | JSON | PDF</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== TOP 100 BENEFICIÁRIOS ==================== -->
    <section class="lista-section" id="lista-beneficiarios">
      <div class="lista-header">
        <div>
          <h2>Top 100 Beneficiários <span class="pais-indicador-tabela">{{ bandeiraPais }} {{ nomePaisAtual }}</span></h2>
          <p class="lista-sub">Maiores beneficiários por valor aprovado · use o scroll para ver todos · ordenável por valor aprovado</p>
        </div>
        <div class="lista-header-actions">
          <button class="btn-export-lista" @click="showExportModal = true">📥 Exportar Tabela</button>
        </div>
      </div>

      <div class="beneficiarios-scroll">
        <table class="beneficiarios-tabela">
          <thead>
            <tr>
              <th class="ben-col-pos">#</th>
              <th class="ben-col-pais">País</th>
              <th class="ben-col-nome">Beneficiário</th>
              <th class="ben-col-prog th-sort" @click="ordenarBenefPorValor()">
                Valor Aprovado <span class="sort-icon">{{ sortBenefDir === 'asc' ? '↑' : (sortBenefDir === 'desc' ? '↓' : '↕') }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ben, index) in topBeneficiariosOrdenados" :key="ben.nome">
             <td class="ben-pos">{{ ben.rank }}</td>
              <td>{{ bandeiraPaisObj(ben.paisCode) }} {{ ben.pais }}</td>
              <td class="ben-nome">{{ ben.nome }}</td>
              <td>
                <div class="ben-prog-wrapper">
                  <div class="ben-prog-bg">
                    <div class="ben-prog-fill" :style="{ width: (ben.total / maxTotalBeneficiarios * 100) + '%' }"></div>
                  </div>
                  <span class="ben-prog-valor">{{ formatMoneyReduzido(ben.total) }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ==================== HISTÓRICO DE TRANCHES (COM SCROLL) ==================== -->
    <section class="lista-section" id="lista-tranches">
      <div class="lista-header">
        <div>
          <h2>Histórico de Desembolsos <span class="pais-indicador-tabela">{{ bandeiraPais }} {{ nomePaisAtual }}</span></h2>
          <p class="lista-sub">{{ historicoTranches.length }} tranches · {{ ordemAscendente ? 'mais antigos primeiro' : 'mais recentes primeiro' }}</p>
        </div>
        <div class="lista-header-actions">
          <button class="btn-scroll-tabela" @click="ordemAscendente = !ordemAscendente">
            {{ ordemAscendente ? '↓ Mais recentes' : '↑ Mais antigos' }}
          </button>
          <button class="btn-export-lista" @click="showExportModal = true">📥 Exportar Histórico</button>
        </div>
      </div>

      <div class="historico-scroll">
        <div
          v-for="tranche in historicoRecente"
          :key="tranche.id"
          class="historico-item"
          :class="tranche.statusClass"
          @click="mostrarDetalheTranche(tranche)"
        >
          <div class="hist-icon" :class="{ pulse: tranche.estado === 'Em Avaliação' }">
            <span v-if="tranche.estado === 'Pago'">✅</span>
            <span v-else-if="tranche.estado === 'Em Avaliação'">⏳</span>
            <span v-else>📝</span>
          </div>

          <div class="hist-content">
            <div class="hist-titulo">
              <strong>{{ tranche.nome }}</strong>: {{ tranche.descCurta }}
            </div>
            <div class="hist-meta">
              <span class="hist-valor">{{ formatarValorCurto(tranche.valorNum) }}</span>
              <span class="hist-data">{{ tranche.data }}</span>
              <span class="hist-setor">{{ iconeSetor(tranche.setor) }} {{ tranche.setor }}</span>
              <span class="hist-pais">{{ bandeiraPaisObj(tranche.paisCode) }} {{ tranche.pais }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== TABELA DE TRANCHES ==================== -->
    <section class="tabela-section" id="tabela-tranches">
      <div class="tabela-header">
        <div>
          <h2> Detalhe das Tranches <span class="pais-indicador-tabela"> {{ bandeiraPais }} {{ nomePaisAtual }} </span>
          </h2>
          <p class="tabela-sub">Listagem oficial · clique numa linha para ver detalhes · cabeçalhos ordenáveis</p>
        </div>
        <div class="tabela-btns">
          <button class="btn-csv" @click="exportarDesembolsos('csv')">⬇ CSV</button>
          <button class="btn-json" @click="exportarDesembolsos('json')">⬇ JSON</button>
        </div>
      </div>
      <div class="tabela-wrap">
        <table class="tabela">
          <thead>
            <tr>
              <th @click="ordenarPor('id')" class="th-sort">
                ID <span class="sort-icon">{{ sortCol === 'id' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </th>
              <th @click="ordenarPor('nome')" class="th-sort">
                Designação <span class="sort-icon">{{ sortCol === 'nome' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </th>
              <th @click="ordenarPor('tipo')" class="th-sort">
                Tipo de Fundo <span class="sort-icon">{{ sortCol === 'tipo' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </th>
              <th @click="ordenarPor('pais')" class="th-sort">
                País <span class="sort-icon">{{ sortCol === 'pais' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </th>
              <th @click="ordenarPor('valorNum')" class="th-sort">
                Montante <span class="sort-icon">{{ sortCol === 'valorNum' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </th>
              <th @click="ordenarPor('dataObj')" class="th-sort">
                Data <span class="sort-icon">{{ sortCol === 'dataObj' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </th>
              <th @click="ordenarPor('estadoOrd')" class="th-sort">
                Estado <span class="sort-icon">{{ sortCol === 'estadoOrd' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tranche in tranchesPaginadas"
              :key="tranche.id"
              @click="mostrarDetalheTranche(tranche)"
              class="tabela-row-clicavel"
            >
              <td class="td-id">T{{ tranche.id }}</td>
              <td class="td-titulo">{{ tranche.nome }}</td>
              <td>{{ tranche.tipo }}</td>
              <td>{{ bandeiraPaisObj(tranche.paisCode) }} {{ tranche.pais }}</td>
              <td><strong>{{ tranche.valor }}</strong></td>
              <td>{{ tranche.data }}</td>
              <td>
                <span :class="['tabela-badge', tranche.estadoClass]">
                  {{ estadoLabelTranche(tranche.estado) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="tabela-footer" v-if="tranchesOrdenadas.length > 10">
          <button
            class="btn-ver-mais"
            v-if="linhasVisiveis < tranchesOrdenadas.length"
            @click="linhasVisiveis = Math.min(linhasVisiveis + 10, tranchesOrdenadas.length)"
          >
            Ver mais (+{{ Math.min(10, tranchesOrdenadas.length - linhasVisiveis) }})
          </button>
          <button
            class="btn-ver-mais"
            v-if="linhasVisiveis > 10"
            @click="linhasVisiveis = 10"
          >
            Ocultar
          </button>
        </div>
        <p class="tabela-nota">A mostrar {{ tranchesPaginadas.length }} de {{ historicoTranches.length }} tranches</p>
      </div>
    </section>

    <!-- ==================== NOTA DE RODAPÉ ==================== -->
    <div class="data-source-note">
      <span class="source-icon">📋</span>
      <p>Dados síncronos com <strong>Recuperar Portugal</strong> e <strong>Comissão Europeia</strong>. Última atualização: {{ horaAtual }}.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useAppStore } from '@/stores/app'
import { getDesembolsos, getDesembolsosByPais } from '@/services/api.js'

Chart.register(...registerables)
const appStore = useAppStore()

// -------------------- ESTADOS --------------------
const anoSelecionado = ref('todos')
const estadoSelecionado = ref('todos')
const heroVisible = ref(false)
const showExportModal = ref(false)
const showCardExportModal = ref(false)
const cardExportTranche = ref(null)
const trancheDetalhe = ref(null)
const showGuiaModal = ref(false)
const loading = ref(true)
const erro = ref(null)
const ordemAscendente = ref(false)
const modoCircular = ref('financiamento')
const linhasVisiveis = ref(10)

// -------------------- ORDENAÇÃO BENEFICIÁRIOS --------------------
const sortBenefDir = ref('desc')

// -------------------- STICKY BAR --------------------
const showStickyBar = ref(false)

// -------------------- DADOS DA API --------------------
const desembolsosAPI = ref([])
const todosDesembolsos = ref([])

async function carregarDesembolsos() {
  loading.value = true
  erro.value = null
  try {
    const pais = filtroPais.value
    if (pais === 'todos') {
      desembolsosAPI.value = await getDesembolsos()
    } else {
      desembolsosAPI.value = await getDesembolsosByPais(pais)
    }
  } catch (e) {
    erro.value = 'Falha ao carregar os desembolsos. Verifique a ligação ao servidor.'
    desembolsosAPI.value = []
  } finally {
    loading.value = false
  }
}

async function carregarTodosDesembolsos() {
  try {
    todosDesembolsos.value = await getDesembolsos()
  } catch (e) {
    todosDesembolsos.value = []
  }
}

// -------------------- FILTROS --------------------
const filtroPais = computed({
  get: () => appStore.paisSelecionado,
  set: (val) => appStore.setPais(val)
})

const filtrosActivos = computed(() => {
  let n = 0
  if (filtroPais.value !== 'todos') n++
  if (anoSelecionado.value !== 'todos') n++
  if (estadoSelecionado.value !== 'todos') n++
  return n
})

function limparFiltros() {
  appStore.setPais('todos')
  anoSelecionado.value = 'todos'
  estadoSelecionado.value = 'todos'
}

// -------------------- CÁLCULOS REAIS --------------------
const historicoTranches = computed(() => {
  return desembolsosAPI.value
    .filter(t => {
      if (anoSelecionado.value !== 'todos') {
        const dataObj = new Date(t.data)
        if (dataObj.getFullYear() !== anoSelecionado.value) return false
      }
      if (estadoSelecionado.value !== 'todos') {
        const estadoBruto = t.estado || null
        let estado = estadoBruto
        if (!estadoBruto) {
          const dataObj = new Date(t.data)
          const agora = new Date()
          const tresMesesDepois = new Date(agora.getFullYear(), agora.getMonth() + 3, agora.getDate())
          if (dataObj <= agora) estado = 'Pago'
          else if (dataObj <= tresMesesDepois) estado = 'Em Avaliação'
          else estado = 'Planeado'
        }
        if (estado !== estadoSelecionado.value) return false
      }
      return true
    })
    .map(t => {
      const tipo = t.tipologia
      const valorFormatado = formatMoney(t.montante)
      const dataObj = new Date(t.data)
      const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
      const dataFormatada = `${meses[dataObj.getMonth()]} ${dataObj.getFullYear()}`

      const estadoBruto = t.estado || null
      let estado
      if (estadoBruto) {
        estado = estadoBruto
      } else {
        const agora = new Date()
        const tresMesesDepois = new Date(agora.getFullYear(), agora.getMonth() + 3, agora.getDate())
        if (dataObj <= agora) estado = 'Pago'
        else if (dataObj <= tresMesesDepois) estado = 'Em Avaliação'
        else estado = 'Planeado'
      }

      const estadoClass = estado === 'Pago' ? 'concluido' : (estado === 'Em Avaliação' ? 'em_curso' : 'planeado')
      const estadoOrd = estado === 'Pago' ? 1 : (estado === 'Em Avaliação' ? 2 : 3)
      const nomePais = t.pais || ''

      let statusClass = ''
      if (estado === 'Pago') statusClass = 'status-pago'
      else if (estado === 'Em Avaliação') statusClass = 'status-avaliacao'
      else statusClass = 'status-planeado'

      const descCurta = t.descricaoCurta || t.descricao || 'Sem descrição'
      const setor = t.setor || 'Transversal'

      return {
        id: t.id,
        nome: t.titulo || t.tipologia,
        tipo,
        valor: valorFormatado,
        data: dataFormatada,
        estado,
        estadoClass,
        estadoOrd,
        statusClass,
        valorNum: t.montante,
        dataObj,
        marcos: 'N/A',
        pais: nomePais,
        paisCode: t.paisCode,
        descCurta,
        setor,
        raw: t
      }
    })
})

const totalAlocadoReal = computed(() => {
  return historicoTranches.value.reduce((soma, t) => soma + t.valorNum, 0)
})

const totalDesembolsadoReal = computed(() => {
  return historicoTranches.value
    .filter(t => t.estado === 'Pago')
    .reduce((soma, t) => soma + t.valorNum, 0)
})

const taxaExecucaoReal = computed(() => {
  if (totalAlocadoReal.value === 0) return 0
  return ((totalDesembolsadoReal.value / totalAlocadoReal.value) * 100).toFixed(1)
})

const totalRealDesembolsado = computed(() => {
  return historicoTranches.value.reduce((soma, t) => soma + t.valorNum, 0)
})

const percentagemPais = computed(() => {
  if (filtroPais.value === 'todos') return 100
  const totalPais = todosDesembolsos.value
    .filter(t => t.paisCode === filtroPais.value)
    .reduce((soma, t) => soma + t.montante, 0)
  const totalGeral = todosDesembolsos.value.reduce((soma, t) => soma + t.montante, 0)
  if (totalGeral === 0) return 0
  return ((totalPais / totalGeral) * 100).toFixed(1)
})

const proximaTrancheData = computed(() => {
  const avaliacao = historicoTranches.value
    .filter(t => t.estado === 'Em Avaliação')
    .sort((a, b) => b.dataObj.getTime() - a.dataObj.getTime())
  if (avaliacao.length === 0) return '—'
  const d = avaliacao[0].dataObj
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${meses[d.getMonth()]} ${d.getFullYear()}`
})

const totaisPorAno = computed(() => {
  const mapa = {}
  historicoTranches.value.forEach(t => {
    const ano = t.dataObj.getFullYear()
    mapa[ano] = (mapa[ano] || 0) + t.valorNum
  })
  const anos = Object.keys(mapa).sort((a, b) => a - b)
  return anos.map(ano => ({ ano: Number(ano), total: mapa[ano] }))
})

const anosDisponiveis = computed(() => {
  const anos = new Set()
  // usar desembolsosAPI (dados carregados, já filtrados por país, mas sem filtro de ano)
  desembolsosAPI.value.forEach(t => {
    const dataObj = new Date(t.data)
    anos.add(dataObj.getFullYear())
  })
  return [...anos].sort((a, b) => a - b)
})

const totaisPorSetor = computed(() => {
  const mapa = {}
  historicoTranches.value.forEach(t => {
    const setor = t.setor || 'Transversal'
    mapa[setor] = (mapa[setor] || 0) + t.valorNum
  })
  return Object.entries(mapa).map(([setor, total]) => ({ setor, total }))
})

const totaisPorFinanciamento = computed(() => {
  const mapa = {}
  historicoTranches.value.forEach(t => {
    const tipo = t.tipo || 'Subvenção'
    mapa[tipo] = (mapa[tipo] || 0) + t.valorNum
  })
  return [
    { tipo: 'Subvenção', total: mapa['Subvenção'] || 0 },
    { tipo: 'Empréstimo', total: mapa['Empréstimo'] || 0 },
    { tipo: 'Misto', total: mapa['Misto'] || 0 }
  ]
})

const contagemPorFinanciamento = computed(() => {
  const mapa = {}
  historicoTranches.value.forEach(t => {
    const tipo = t.tipo || 'Subvenção'
    mapa[tipo] = (mapa[tipo] || 0) + 1
  })
  return [
    { tipo: 'Subvenção', count: mapa['Subvenção'] || 0 },
    { tipo: 'Empréstimo', count: mapa['Empréstimo'] || 0 },
    { tipo: 'Misto', count: mapa['Misto'] || 0 }
  ]
})

const contagemPorSetor = computed(() => {
  const mapa = {}
  historicoTranches.value.forEach(t => {
    const setor = t.setor || 'Transversal'
    mapa[setor] = (mapa[setor] || 0) + 1
  })
  return Object.entries(mapa).map(([setor, count]) => ({ setor, count }))
})

// -------------------- TOP 100 BENEFICIÁRIOS --------------------
// -------------------- TOP 100 BENEFICIÁRIOS (com rank fixo) --------------------
const topBeneficiarios = computed(() => {
  const mapa = {}
  historicoTranches.value.forEach(t => {
    const raw = t.raw
    const beneficiario = raw?.beneficiario || 'Não especificado'
    const chave = `${beneficiario}||${t.paisCode}||${t.pais}`
    if (!mapa[chave]) {
      mapa[chave] = { nome: beneficiario, paisCode: t.paisCode, pais: t.pais, total: 0 }
    }
    mapa[chave].total += t.valorNum
  })
  // Obter lista não ordenada
  let lista = Object.values(mapa)
  // Ordenar por total descendente para atribuir ranks
  lista.sort((a, b) => b.total - a.total)
  // Atribuir rank (1 = maior total)
  lista = lista.map((item, idx) => ({ ...item, rank: idx + 1 }))
  return lista
})

const topBeneficiariosOrdenados = computed(() => {
  // Criar cópia e ordenar conforme o estado atual (asc/desc)
  const lista = [...topBeneficiarios.value]
  lista.sort((a, b) => {
    return sortBenefDir.value === 'desc' ? b.total - a.total : a.total - b.total
  })
  return lista.slice(0, 100)
})

function ordenarBenefPorValor() {
  sortBenefDir.value = sortBenefDir.value === 'desc' ? 'asc' : 'desc'
}

// Valor máximo absoluto para as barras de progresso (não depende da ordenação)
const maxTotalBeneficiarios = computed(() => {
  if (topBeneficiarios.value.length === 0) return 1
  return Math.max(...topBeneficiarios.value.map(b => b.total))
})

// -------------------- HISTÓRICO ORDENADO E DESTAQUE --------------------
const historicoRecente = computed(() => {
  const lista = [...historicoTranches.value]
  lista.sort((a, b) => b.dataObj.getTime() - a.dataObj.getTime())
  if (ordemAscendente.value) lista.reverse()
  return lista
})

const desembolsosDestaque = computed(() => {
  return [...historicoTranches.value]
    .sort((a, b) => b.dataObj.getTime() - a.dataObj.getTime())
    .slice(0, 3)
})

// -------------------- ORDENAÇÃO DA TABELA --------------------
const sortCol = ref('id')
const sortDir = ref('asc')

const tranchesOrdenadas = computed(() => {
  return [...historicoTranches.value].sort((a, b) => {
    let valA, valB
    switch (sortCol.value) {
      case 'id': valA = a.id; valB = b.id; break
      case 'nome': valA = a.nome.toLowerCase(); valB = b.nome.toLowerCase(); break
      case 'tipo': valA = a.tipo.toLowerCase(); valB = b.tipo.toLowerCase(); break
      case 'pais': valA = (a.pais || '').toLowerCase(); valB = (b.pais || '').toLowerCase(); break
      case 'valorNum': valA = a.valorNum; valB = b.valorNum; break
      case 'dataObj': valA = a.dataObj.getTime(); valB = b.dataObj.getTime(); break
      case 'estadoOrd': valA = a.estadoOrd; valB = b.estadoOrd; break
      default: return 0
    }
    return sortDir.value === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1)
  })
})

const tranchesPaginadas = computed(() => {
  return tranchesOrdenadas.value.slice(0, linhasVisiveis.value)
})

function ordenarPor(col) {
  if (sortCol.value === col) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = col
    sortDir.value = 'asc'
  }
}

function mostrarDetalheTranche(tranche) {
  trancheDetalhe.value = tranche
}

// Retorna o ranking do beneficiário no top 100 (1 = maior valor)
function getBeneficiarioRank(beneficiarioNome, paisCode) {
  const idx = topBeneficiariosOrdenados.value.findIndex(b => b.nome === beneficiarioNome && b.paisCode === paisCode)
  return idx !== -1 ? idx + 1 : null
}

// Retorna o ícone da medalha conforme a posição (1-3)
function getMedalIcon(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return ''
}

// -------------------- EXPORT CARD --------------------
function abrirExportCard(tranche) {
  cardExportTranche.value = tranche
  showCardExportModal.value = true
}

function exportarTrancheIndividual(formato) {
  const t = cardExportTranche.value
  if (!t) return
  if (formato === 'csv') {
    const csv = `ID,Nome,Estado,Valor,Data,Beneficiário\nT${t.id},${t.nome},${t.estado},${t.valor},${t.data},"${t.raw?.beneficiario || ''}"`
    downloadBlob(csv, 'text/csv', `tranche_${t.id}.csv`)
  } else if (formato === 'json') {
    const json = JSON.stringify({ id: t.id, nome: t.nome, estado: t.estado, valor: t.valor, data: t.data, beneficiario: t.raw?.beneficiario || '' }, null, 2)
    downloadBlob(json, 'application/json', `tranche_${t.id}.json`)
  } else if (formato === 'pdf') {
    exportarTranchePDF(t)
  }
  showCardExportModal.value = false
  cardExportTranche.value = null
}

// -------------------- AUXILIARES --------------------
const nomePaisAtual = computed(() => {
  const pais = appStore.paises.find(p => p.code === filtroPais.value)
  return pais ? pais.nome : 'Todos os países'
})

const bandeiraPais = computed(() => {
  const bandeiras = { PT: '🇵🇹', ES: '🇪🇸', FR: '🇫🇷', IT: '🇮🇹', DE: '🇩🇪', GR: '🇬🇷', HR: '🇭🇷', RO: '🇷🇴' }
  return bandeiras[filtroPais.value] || '🌍'
})

const percentagemTranche = computed(() => {
  if (!trancheDetalhe.value) return 0
  const totalPais = historicoTranches.value
    .filter(t => t.paisCode === (trancheDetalhe.value.paisCode || trancheDetalhe.value.raw?.paisCode))
    .reduce((soma, t) => soma + t.valorNum, 0)
  const valorTranche = trancheDetalhe.value.montante || trancheDetalhe.value.valorNum
  if (totalPais === 0) return 0
  return ((valorTranche / totalPais) * 100).toFixed(1)
})

const horaAtual = ref('')
let intervalo = null
function atualizarHora() {
  const now = new Date()
  horaAtual.value = now.toLocaleDateString('pt-PT', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function bandeiraPaisObj(paisCode) {
  const bandeiras = { PT: '🇵🇹', ES: '🇪🇸', FR: '🇫🇷', IT: '🇮🇹', DE: '🇩🇪', GR: '🇬🇷', HR: '🇭🇷', RO: '🇷🇴' }
  return bandeiras[paisCode] || '🌍'
}

function overlayGradienteDesembolsos(setor) {
  const cores = {
    'Saúde': 'linear-gradient(to top, rgba(123,28,28,0.85) 0%, rgba(123,28,28,0.1) 60%)',
    'Digital': 'linear-gradient(to top, rgba(26,58,107,0.85) 0%, rgba(26,58,107,0.1) 60%)',
    'Clima': 'linear-gradient(to top, rgba(26,92,46,0.85) 0%, rgba(26,92,46,0.1) 60%)',
    'Transversal': 'linear-gradient(to top, rgba(147,27,24,0.85) 0%, rgba(147,27,24,0.1) 60%)',
    'Coesão': 'linear-gradient(to top, rgba(58,26,107,0.85) 0%, rgba(58,26,107,0.1) 60%)',
    'Infraestrutura': 'linear-gradient(to top, rgba(42,42,42,0.85) 0%, rgba(42,42,42,0.1) 60%)'
  }
  return cores[setor] || 'linear-gradient(to top, rgba(147,27,24,0.85) 0%, rgba(147,27,24,0.1) 60%)'
}

function formatDate(dateObj) {
  if (!dateObj) return ''
  const d = new Date(dateObj)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function formatMoney(value) {
  if (value >= 1e9) {
    return `€ ${(value / 1e9).toFixed(2).replace('.', ',')} B`
  } else if (value >= 1e6) {
    const milhoes = value / 1e6
    return `€ ${milhoes.toLocaleString('pt-PT', { maximumFractionDigits: 1 })} M`
  } else {
    return `€ ${value.toLocaleString('pt-PT')}`
  }
}

function formatMoneyReduzido(val) {
  if (val >= 1e9) {
    return `€ ${(val / 1e9).toFixed(1).replace('.', ',')} B`
  } else if (val >= 1e6) {
    return `€ ${(val / 1e6).toFixed(1).replace('.', ',')} M`
  } else {
    return `€ ${Math.round(val).toLocaleString('pt-PT')}`
  }
}

function formatarValorCurto(valor) {
  if (valor >= 1e9) {
    return `€ ${(valor / 1e9).toFixed(1).replace('.', ',')} B`
  } else if (valor >= 1e6) {
    return `€ ${(valor / 1e6).toFixed(1).replace('.', ',')} M`
  } else {
    return `€ ${(valor / 1e3).toFixed(0)} mil`
  }
}

function corProgresso(val) {
  if (val >= 80) return '#1a7a4a'
  if (val >= 40) return '#e6a817'
  return '#931b18'
}

function scrollSmooth(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function estadoLabelTranche(estado) {
  const mapa = {
    'Pago': '✅ Pago',
    'Em Avaliação': '⏳ Em Avaliação',
    'Planeado': '📝 Planeado'
  }
  return mapa[estado] || estado
}

function iconeSetor(setor) {
  const mapa = {
    'Saúde': '❤️',
    'Digital': '💻',
    'Clima': '🌿',
    'Transversal': '🔄',
    'Coesão': '👥',
    'Educação': '🎓',
    'Infraestrutura': '🏢'
  }
  return mapa[setor] || '📌'
}

const coresSetores = {
  'Saúde': '#e74c3c',
  'Digital': '#3498db',
  'Clima': '#2ecc71',
  'Transversal': '#95a5a6',
  'Coesão': '#9b59b6',
  'Infraestrutura': '#f39c12'
}

// -------------------- GRÁFICOS --------------------
let chartBarras = null
let chartDonut = null

function criarGraficos() {
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
    const dadosAno = totaisPorAno.value
    chartBarras = new Chart(ctxB, {
      type: 'bar',
      plugins: [whiteBgPlugin],
      data: {
        labels: dadosAno.map(d => d.ano),
        datasets: [{
          label: 'Desembolsos por ano',
          data: dadosAno.map(d => d.total),
          backgroundColor: 'rgba(147, 27, 24, 0.85)',
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index
            const anoClicado = dadosAno[index].ano
            anoSelecionado.value = anoClicado
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.parsed.y.toLocaleString('pt-PT')} €`
            }
          }
        },
        scales: {
          y: { beginAtZero: true, ticks: { callback: v => v.toLocaleString('pt-PT') + ' €' } }
        }
      }
    })
  }

  if (chartDonut) chartDonut.destroy()
  const ctxD = document.getElementById('graficoDonut')
  if (ctxD) {
    let labels, data, backgroundColor

    if (modoCircular.value === 'financiamento') {
      const financiamento = totaisPorFinanciamento.value
      labels = financiamento.map(d => d.tipo)
      data = financiamento.map(d => d.total)
      backgroundColor = ['#e6a817', '#0077b6', '#1a7a4a']
    } else {
      const dadosSetor = totaisPorSetor.value
      labels = dadosSetor.map(d => d.setor)
      data = dadosSetor.map(d => d.total)
      backgroundColor = dadosSetor.map(d => coresSetores[d.setor] || '#999')
    }

    chartDonut = new Chart(ctxD, {
      type: 'doughnut',
      plugins: [whiteBgPlugin],
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor,
          borderWidth: 3,
          borderColor: '#fff',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(ctx) {
                const valor = ctx.parsed
                let extra = ''
                if (modoCircular.value === 'financiamento') {
                  const tipo = labels[ctx.dataIndex]
                  const contagem = contagemPorFinanciamento.value.find(c => c.tipo === tipo)?.count || 0
                  extra = ` (${contagem} desembolso${contagem !== 1 ? 's' : ''})`
                } else {
                  const setor = labels[ctx.dataIndex]
                  const contagem = contagemPorSetor.value.find(c => c.setor === setor)?.count || 0
                  extra = ` (${contagem} desembolso${contagem !== 1 ? 's' : ''})`
                }
                return ` ${labels[ctx.dataIndex]}: ${valor.toLocaleString('pt-PT')} €${extra}`
              }
            }
          }
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

// -------------------- EXPORTAÇÃO --------------------
function exportarDesembolsos(tipo) {
  const pais = nomePaisAtual.value
  const d = {
    alocado: totalAlocadoReal.value,
    desembolsado: totalDesembolsadoReal.value,
    taxaExecucao: taxaExecucaoReal.value
  }

  if (tipo === 'csv') {
    let csv = `Relatório Financeiro PRR\nPaís;${pais}\n\n`
    csv += `Indicador;Valor\n`
    csv += `Total Alocado;${formatMoney(d.alocado)}\n`
    csv += `Total Desembolsado;${formatMoney(d.desembolsado)}\n`
    csv += `Taxa Execução;${d.taxaExecucao}%\n`
    csv += `\nTranches\nID,Nome,Estado,Valor,Data,Marcos\n`
    historicoTranches.value.forEach(t => csv += `T${t.id},${t.nome},${t.estado},${t.valor},${t.data},${t.marcos}\n`)
    downloadBlob(csv, 'text/csv', `financas_prr_${filtroPais.value}.csv`)
  } else if (tipo === 'json') {
    const json = JSON.stringify({ pais, indicadores: { ...d }, tranches: historicoTranches.value }, null, 2)
    downloadBlob(json, 'application/json', `financas_prr_${filtroPais.value}.json`)
  } else if (tipo === 'pdf') {
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>Relatório Financeiro PRR</title>
      <style>body{font-family:Arial;padding:40px} h1{color:#931b18} table{width:100%;border-collapse:collapse} th,td{border:1px solid #ddd;padding:8px} th{background:#931b18;color:white}</style></head>
      <body>
        <h1>Balanço Financeiro PRR</h1>
        <p><strong>País:</strong> ${pais}</p>
        <h2>Indicadores</h2>
        <table>
          <tr><th>Indicador</th><th>Valor</th></tr>
          <tr><td>Total Alocado</td><td>${formatMoney(d.alocado)}</td></tr>
          <tr><td>Total Desembolsado</td><td>${formatMoney(d.desembolsado)}</td></tr>
          <tr><td>Taxa Execução</td><td>${d.taxaExecucao}%</td></tr>
        </table>
        <h2>Tranches</h2>
        <table>
          <tr><th>ID</th><th>Nome</th><th>Estado</th><th>Valor</th><th>Data</th></tr>
          ${historicoTranches.value.map(t => `<tr><td>T${t.id}</td><td>${t.nome}</td><td>${t.estado}</td><td>${t.valor}</td><td>${t.data}</td></tr>`).join('')}
        </table>
      </body></html>`)
    win.document.close()
    win.print()
  }
  showExportModal.value = false
}

function exportarTranchePDF(tranche) {
  const win = window.open('', '_blank')
  win.document.write(`
    <html><head><title>Comprovativo - ${tranche.nome}</title>
    <style>body{font-family:Arial;padding:40px} h1{color:#931b18} .badge{padding:4px 12px;border-radius:20px;font-weight:bold}</style></head>
    <body>
      <h1>📥 Comprovativo de Pagamento</h1>
      <p><strong>Estado-Membro:</strong> ${nomePaisAtual.value}</p>
      <p><strong>Tranche:</strong> ${tranche.nome} | <span class="badge">${tranche.estado}</span></p>
      <p><strong>Valor:</strong> ${tranche.valor} | <strong>Data:</strong> ${tranche.data} | <strong>Marcos:</strong> ${tranche.marcos || 'N/A'}</p>
      <hr><small>Documento gerado pelo Sistema de Monitorização do PRR</small>
    </body></html>`)
  win.document.close()
  win.print()
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

// -------------------- STICKY BAR SCROLL --------------------
function handleScroll() {
  const hero = document.querySelector('.hero')
  if (hero) {
    const heroBottom = hero.getBoundingClientRect().bottom
    showStickyBar.value = heroBottom < 0
  }
}

// -------------------- CICLO DE VIDA --------------------
onMounted(async () => {
  await carregarTodosDesembolsos()
  await carregarDesembolsos()
  atualizarHora()
  intervalo = setInterval(atualizarHora, 60000)
  window.addEventListener('scroll', handleScroll)
  setTimeout(() => {
    heroVisible.value = true
    criarGraficos()
  }, 100)
})

onUnmounted(() => {
  if (intervalo) clearInterval(intervalo)
  window.removeEventListener('scroll', handleScroll)
})

watch(filtroPais, () => {
  carregarDesembolsos()
  criarGraficos()
})

watch([anoSelecionado, estadoSelecionado, totaisPorAno, totaisPorSetor, modoCircular], () => {
  criarGraficos()
})
</script>

<style scoped>
/* ==================== ESTILOS GLOBAIS ==================== */
.desembolsos-container { margin: -2rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow-x: hidden; }

/* Sticky Mini Bar */
.sticky-mini-bar { position: fixed; top: 0; left: 0; width: 100%; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); display: flex; justify-content: center; align-items: center; gap: 30px; padding: 12px 20px; z-index: 1000; transform: translateY(-100%); transition: transform 0.3s ease; }
.sticky-mini-bar.visible { transform: translateY(0); }
.mini-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.mini-label { font-size: 0.6rem; font-weight: 800; color: #888; letter-spacing: 1px; text-transform: uppercase; }
.mini-value { font-size: 1.1rem; font-weight: 800; color: #1a1a1a; }
.mini-value.highlight { color: #931b18; }
.mini-divider { width: 1px; height: 30px; background: #e0e0e0; }

/* Hero */
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

/* Filtros */
.filtros-section { background: white; padding: 16px 10%; box-shadow: 0 4px 20px rgba(0,0,0,0.08); position: sticky; top: 70px; z-index: 50; border-bottom: 1px solid #f0f0f0; }
.filtros-inner { display: flex; flex-direction: column; gap: 10px; }
.filtros-left { display: flex; align-items: center; gap: 12px; }
.filtros-titulo { font-size: 0.78rem; font-weight: 700; color: #931b18; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap; }
.filtros-activos-badge { background: #931b18; color: white; font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 99px; }
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

/* Gráficos */
.graficos-section { padding: 60px 10%; background: #f5f5f7; }
.graficos-titulo-area { text-align: center; margin-bottom: 35px; }
.graficos-titulo-area h2 { font-size: 2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 8px; }
.graficos-titulo-area p { font-size: 0.92rem; color: #aaa; max-width: 600px; margin: 0 auto; }
.graficos-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 25px; align-items: start; }
.grafico-legenda-texto { font-size: 0.77rem; color: #bbb; margin-top: 12px; line-height: 1.5; font-style: italic; }
.grafico-card { background: white; border-radius: 24px; padding: 28px; box-shadow: 0 4px 30px rgba(0,0,0,0.07); }
.grafico-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.grafico-header h3 { font-size: 1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
.grafico-sub { font-size: 0.76rem; color: #aaa; line-height: 1.4; max-width: 300px; }
.btn-export-grafico { background: #f5f5f7; color: #931b18; border: none; padding: 7px 14px; border-radius: 8px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.btn-export-grafico:hover { background: #931b18; color: white; }
.grafico-canvas-wrap { position: relative; height: 260px; }
.donut-wrap { display: flex; flex-direction: column; gap: 20px; }
.donut-canvas-wrap { position: relative; height: 200px; }
.donut-legenda { display: flex; flex-direction: column; gap: 10px; padding: 0 4px; }
.leg-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: #f9f9f9; border-radius: 10px; }
.leg-cor { width: 14px; height: 14px; border-radius: 4px; flex-shrink: 0; }
.leg-info { display: flex; justify-content: space-between; flex: 1; font-size: 0.84rem; }
.leg-info span { color: #666; }
.leg-info strong { color: #1a1a1a; }
.leg-total { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #931b18; border-radius: 10px; color: white; font-size: 0.84rem; font-weight: 600; }
.leg-total strong { font-size: 1rem; }

/* Lista de KPIs */
.lista-section { padding: 50px 10%; background: #f5f5f7; }
.lista-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
.lista-header h2 { font-size: 2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 5px; }
.lista-sub { font-size: 0.88rem; color: #aaa; }
.lista-header-actions { display: flex; gap: 10px; }
.btn-scroll-tabela { background: white; color: #931b18; border: 1.5px solid #e0e0e0; padding: 11px 18px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-scroll-tabela:hover { border-color: #931b18; background: #fdf2f2; }
.btn-export-lista { background: #931b18; color: white; border: none; padding: 11px 22px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-export-lista:hover { background: #6b1210; transform: translateY(-2px); }

.marcos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
.marco-card { background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: transform 0.35s ease, box-shadow 0.35s ease; }
.marco-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.14); }
.marco-img-wrap { position: relative; height: 200px; overflow: hidden; }
.marco-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.marco-img-overlay { position: absolute; inset: 0; z-index: 1; }
.marco-card:hover .marco-img { transform: scale(1.08); }

.marco-img-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 14px; display: flex; justify-content: space-between; align-items: flex-end; z-index: 2; }
.marco-setor-pill { font-size: 0.72rem; font-weight: 700; color: white; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.3); padding: 4px 10px; border-radius: 99px; }
.destaque-badge { font-size: 1rem !important; }
.marco-pais-badge { position: absolute; top: 12px; left: 12px; font-size: 0.7rem; font-weight: 700; color: white; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); padding: 4px 10px; border-radius: 99px; z-index: 2; }

.marco-card.status-pago { border: 3px solid #2e7d32; }
.marco-card.status-avaliacao { border: 3px solid #d4af37; }
.marco-card.status-planeado { border: 3px solid #bbb; }
.marco-body { padding: 20px 22px 22px; }
.marco-titulo { font-size: 1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; line-height: 1.3; height: 1.8em; overflow: hidden; }
.marco-desc { font-size: 0.82rem; color: #888; line-height: 1.5; margin-bottom: 12px; height: 4em; overflow: hidden; }

/* ESTILOS DOS ESTADOS - VERSÃO ORIGINAL (PASTEL) */
.estado-pill { font-size: 0.7rem; font-weight: 700; padding: 5px 11px; border-radius: 99px; }
.estado-pill.concluido { background: #d4edda; color: #155724; }
.estado-pill.em_curso  { background: #fff3cd; color: #856404; }
.estado-pill.planeado  { background: #e9ecef; color: #495057; }

.progresso-wrapper { margin-bottom: 16px; }
.progresso-header { display: flex; justify-content: space-between; font-size: 0.76rem; color: #aaa; margin-bottom: 6px; }
.progresso-bg { height: 8px; background: #f0f0f0; border-radius: 99px; overflow: hidden; }
.progresso-fill { height: 100%; border-radius: 99px; transition: width 0.8s ease; }
.btn-detalhe { background: #f5f5f7; color: #931b18; border: none; padding: 8px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-detalhe:hover { background: #931b18; color: white; }
.marco-dl { display: flex; flex-direction: column; align-items: center; cursor: pointer; color: #931b18; transition: transform 0.2s; }
.marco-dl:hover { transform: translateY(-2px); }
.dl-icon { font-size: 1.4rem; }
.marco-dl small { font-size: 0.6rem; font-weight: 800; }

.marco-estado-wrap { margin: 0 0 50px 0; }
.marco-meta { display: flex; align-items: center; gap: 6px; min-height: 24px; height: 24px; margin-bottom: 16px; }
.marco-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 0; }

.meta-divider { color: #ccc; font-weight: 400; margin: 0 4px; }

/* ==================== BENEFICIÁRIOS ==================== */
.beneficiarios-scroll {
  max-height: 600px;
  overflow-y: auto;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  scrollbar-width: thin;
  scrollbar-color: #d4af37 #f5f5f5;
}
.beneficiarios-scroll::-webkit-scrollbar { width: 6px; }
.beneficiarios-scroll::-webkit-scrollbar-track { background: #f5f5f5; border-radius: 10px; }
.beneficiarios-scroll::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; }

.beneficiarios-tabela {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}
.beneficiarios-tabela thead tr {
  background: linear-gradient(135deg, #931b18, #6b1210);
  position: sticky;
  top: 0;
  z-index: 1;
}
.beneficiarios-tabela th {
  padding: 15px 18px;
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: white;
}
.beneficiarios-tabela td {
  padding: 12px 18px;
  color: #555;
  border-bottom: 1px solid #f5f5f5;
}
.ben-col-pos { width: 50px; text-align: center; }
.ben-col-pais { width: 120px; }
.ben-col-nome { width: auto; }
.ben-col-prog { width: 280px; cursor: pointer; }
.ben-pos { font-weight: 700; color: #931b18; text-align: center; }
.ben-nome { font-weight: 600; color: #333; }

.ben-prog-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ben-prog-bg {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}
.ben-prog-fill {
  height: 100%;
  background: #931b18;
  border-radius: 4px;
  transition: width 0.5s ease;
}
.ben-prog-valor {
  font-weight: 700;
  color: #1a1a1a;
  font-size: 0.85rem;
  white-space: nowrap;
}

/* Tabela */
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

/* BADGES DA TABELA - VERSÃO ORIGINAL (PASTEL) */
.tabela-badge { font-size: 0.72rem; font-weight: 700; padding: 5px 11px; border-radius: 99px; }
.tabela-badge.concluido { background: #d4edda; color: #155724; }
.tabela-badge.planeado { background: #e9ecef; color: #495057; }
.tabela-badge.em_curso { background: #fff3cd; color: #856404; }

.tabela-nota { font-size: 0.78rem; color: #bbb; padding: 12px 18px; }

.tabela-footer { text-align: center; padding: 10px 0 0; }
.btn-ver-mais { background: #f5f5f7; color: #931b18; border: 1px solid #ddd; padding: 10px 24px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-ver-mais:hover { background: #931b18; color: white; }

/* Modais */
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
.metodologia-card { max-width: 650px; text-align: left; }
.metodologia-content h3 { color: white; font-weight: 800; margin: 20px 0 10px; font-size: 1.15rem; }
.metodologia-content p { font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.9); margin-bottom: 15px; }
.metodologia-content ol { padding-left: 20px; color: rgba(255,255,255,0.9); font-size: 0.9rem; line-height: 1.6; }

/* Modal detalhe */
.detalhe-tranche-card {
  background: white;
  width: 90%;
  max-width: 520px;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 60px rgba(0,0,0,0.4);
  animation: fadeInUp 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
}
.detalhe-tranche-img-wrap { position: relative; height: 200px; overflow: hidden; }
.detalhe-tranche-img { width: 100%; height: 100%; object-fit: cover; }
.detalhe-tranche-overlay { position: absolute; inset: 0; z-index: 1; }
.detalhe-tranche-img-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 14px; display: flex; justify-content: space-between; align-items: flex-end; z-index: 2; }
.detalhe-tranche-body { padding: 24px 22px 22px; }
.detalhe-tranche-titulo { font-size: 1.3rem; font-weight: 800; color: #1a1a1a; margin-bottom: 8px; line-height: 1.3; }
.detalhe-tranche-desc { font-size: 0.88rem; color: #777; line-height: 1.6; margin-bottom: 16px; }

/* Layout dos campos no modal - versão atualizada */
.detalhe-tranche-campos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
  margin-bottom: 20px;
}
.campo-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.campo-titulo {
  font-size: 0.7rem;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.campo-valor-num {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  word-break: break-word;
}
.campo-beneficiario-full {
  grid-column: span 2;
}

.detalhe-tranche-actions { display: flex; gap: 10px; margin-top: 20px; }
.detalhe-tranche-card .close-btn-detalhe {
  position: absolute; top: 15px; right: 15px;
  background: rgba(0,0,0,0.4); border: none; color: white;
  width: 32px; height: 32px; border-radius: 50%;
  font-size: 1rem; cursor: pointer; z-index: 10;
  display: flex; align-items: center; justify-content: center;
}
.btn-export-detalhe { flex: 1; background: #931b18; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-export-detalhe:hover { background: #6b1210; }
.btn-fechar-detalhe { background: #f5f5f7; color: #666; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; }

/* Nota de fonte */
.data-source-note { display: flex; align-items: center; gap: 12px; padding: 20px 10%; background: #f9f9f9; border-top: 1px solid #eee; font-size: 0.8rem; color: #666; }
.source-icon { font-size: 1.3rem; }

/* Indicador de país */
.pais-indicador-tabela {
  font-size: 0.7em; color: #333; background: #f5f5f5;
  padding: 3px 10px; border-radius: 20px; margin-left: 10px;
  font-weight: 600; border: 1px solid #ddd;
}

/* Responsivo */
@media (max-width: 992px) {
  .graficos-grid { grid-template-columns: 1fr; }
  .hero-overlay { flex-direction: column; text-align: center; }
  .hero-left h1 { font-size: 3rem; }
  .hero-stats { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .filtros-grid { flex-direction: column; }
  .marcos-grid { grid-template-columns: 1fr; }
  .detalhe-tranche-campos { grid-template-columns: 1fr; gap: 12px; }
  .campo-beneficiario-full { grid-column: span 1; }
}

/* ==================== HISTÓRICO SCROLL ==================== */
.historico-scroll {
  max-height: 420px; overflow-y: auto; border-radius: 16px;
  background: white; padding: 4px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  scrollbar-width: thin; scrollbar-color: #d4af37 #f5f5f5;
}
.historico-scroll::-webkit-scrollbar { width: 6px; }
.historico-scroll::-webkit-scrollbar-track { background: #f5f5f5; border-radius: 10px; }
.historico-scroll::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; }

.historico-item {
  display: flex; align-items: center; gap: 16px;
  padding: 14px 18px; margin: 8px 0; border-radius: 12px;
  background: white; border: 1px solid #eaeaea; cursor: pointer; transition: all 0.2s;
}
.historico-item:hover { background: #fdf2f2; }
.historico-item.status-pago { border-left-color: #2e7d32; }
.historico-item.status-avaliacao { border-left-color: #d4af37; }
.historico-item.status-planeado { border-left-color: #bbb; }

.hist-icon {
  width: 44px; height: 44px; border-radius: 50%; background: #f9f9f9;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; flex-shrink: 0;
}
.hist-icon.pulse { border: 2px solid #e6a817; animation: pulse-icon 1.2s infinite; }
@keyframes pulse-icon {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
}

.hist-content { flex: 1; min-width: 0; }
.hist-titulo { font-size: 0.92rem; color: #1a1a1a; line-height: 1.4; margin-bottom: 10px; }
.hist-titulo strong { color: #1a1a1a; font-weight: 700; }

.hist-meta {
  display: grid; grid-template-columns: 130px 120px 140px 1fr;
  gap: 12px 4px; align-items: baseline; font-size: 0.78rem; color: #666;
}
.hist-valor { font-weight: 700; color: #1a1a1a; }
.hist-data { color: #888; }
.hist-setor { color: #1a1a1a; font-weight: 600; white-space: nowrap; }
.hist-pais { color: #1a1a1a; font-weight: 600; }
</style>