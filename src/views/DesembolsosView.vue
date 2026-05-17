<template>
  <div class="desembolsos-container">

    <!-- ==================== MODAL DE EXPORTAÇÃO ==================== -->
    <div v-if="showExportModal" class="modal-overlay" @click.self="showExportModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showExportModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">💶</span>
          <h2>{{ appStore.t.desembolsos_modal_export_titulo }}</h2>
          <p>{{ appStore.t.desembolsos_modal_export_desc }}</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="exportarDesembolsos('csv')"><span>{{ appStore.t.desembolsos_modal_export_csv }}</span><span class="ext">.csv</span></button>
          <button class="export-item" @click="exportarDesembolsos('json')"><span>{{ appStore.t.desembolsos_modal_export_json }}</span><span class="ext">.json</span></button>
          <button class="export-item" @click="exportarDesembolsos('pdf')"><span>{{ appStore.t.desembolsos_modal_export_pdf }}</span><span class="ext">.pdf</span></button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL DE EXPORTAÇÃO TOP 100 ==================== -->
    <div v-if="showTop100ExportModal" class="modal-overlay" @click.self="showTop100ExportModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showTop100ExportModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">🏆</span>
          <h2>{{ appStore.t.desembolsos_modal_top100_titulo }}</h2>
          <p>{{ textoTop100Desc() }}</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="exportarTopBeneficiarios('csv')"><span>{{ appStore.t.desembolsos_modal_export_csv }}</span><span class="ext">.csv</span></button>
          <button class="export-item" @click="exportarTopBeneficiarios('json')"><span>{{ appStore.t.desembolsos_modal_export_json }}</span><span class="ext">.json</span></button>
          <button class="export-item" @click="exportarTopBeneficiarios('pdf')"><span>{{ appStore.t.desembolsos_modal_export_pdf }}</span><span class="ext">.pdf</span></button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL DE EXPORTAÇÃO INDIVIDUAL (CARD) ==================== -->
    <div v-if="showCardExportModal" class="modal-overlay" @click.self="showCardExportModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showCardExportModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📥</span>
          <h2>{{ appStore.t.desembolsos_modal_card_titulo }}</h2>
          <p>{{ textoCardExportDesc() }}</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="exportarTrancheIndividual('csv')"><span>{{ appStore.t.desembolsos_modal_export_csv }}</span><span class="ext">.csv</span></button>
          <button class="export-item" @click="exportarTrancheIndividual('json')"><span>{{ appStore.t.desembolsos_modal_export_json }}</span><span class="ext">.json</span></button>
          <button class="export-item" @click="exportarTrancheIndividual('pdf')"><span>{{ appStore.t.desembolsos_modal_export_pdf }}</span><span class="ext">.pdf</span></button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL DETALHE TRANCHE ==================== -->
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
          
          <div class="detalhe-tranche-campos">
            <div class="campo-item campo-valor">
              <div class="campo-titulo">{{ appStore.t.desembolsos_modal_detalhe_valor }}</div>
              <div class="campo-valor-num">{{ formatMoney(trancheDetalhe.montante || trancheDetalhe.valorNum) }}</div>
            </div>
            <div class="campo-item campo-data">
              <div class="campo-titulo">{{ appStore.t.desembolsos_modal_detalhe_data }}</div>
              <div class="campo-valor-num">{{ trancheDetalhe.data || formatDate(trancheDetalhe.dataObj) }}</div>
            </div>
            <div class="campo-item campo-beneficiario-full">
              <div class="campo-titulo">{{ appStore.t.desembolsos_modal_detalhe_beneficiario }}</div>
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
              <span>{{ textoPesoModal() }}</span>   
              <strong>{{ percentagemTranche }}%</strong>
            </div>
            <div class="progresso-bg">
              <div class="progresso-fill" :style="{ width: percentagemTranche + '%', background: '#931b18' }"></div>
            </div>
          </div>
          <div class="detalhe-tranche-actions">
            <button class="btn-export-detalhe" @click="abrirExportCard(trancheDetalhe); trancheDetalhe = null">{{ appStore.t.desembolsos_modal_detalhe_exportar }}</button>
            <button class="btn-fechar-detalhe" @click="trancheDetalhe = null">{{ appStore.t.desembolsos_modal_detalhe_fechar }}</button>
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
          <h2>{{ appStore.t.desembolsos_guia_titulo }}</h2>
          <p>{{ appStore.t.desembolsos_guia_desc }}</p>
        </div>
        <div class="metodologia-content">
          <h3>💰 {{ appStore.idioma === 'pt' ? 'Subvenções vs Empréstimos' : 'Grants vs Loans' }}</h3>
          <p>{{ appStore.idioma === 'pt' ? 'O Mecanismo de Recuperação e Resiliência é composto por <strong>Subvenções</strong> (fundos perdidos que não requerem devolução), <strong>Empréstimos</strong> (crédito em condições muito favoráveis) e financiamentos <strong>Mistos</strong> (ambos).' : 'The Recovery and Resilience Mechanism consists of <strong>Grants</strong> (non-repayable funds), <strong>Loans</strong> (credit on very favourable terms) and <strong>Mixed</strong> financing (both).' }}</p>
          <h3>✅ {{ appStore.idioma === 'pt' ? 'Baseado no Desempenho' : 'Performance‑Based' }}</h3>
          <p>{{ appStore.idioma === 'pt' ? 'Ao contrário dos fundos estruturais tradicionais, os pagamentos do PRR não são baseados em faturas, mas sim no cumprimento comprovado de <strong>Marcos e Metas</strong> (Milestones and Targets).' : 'Unlike traditional structural funds, RRP payments are not based on invoices, but on the proven fulfilment of <strong>Milestones and Targets</strong>.' }}</p>
          <h3>🔄 {{ appStore.idioma === 'pt' ? 'Processo de Desembolso' : 'Disbursement Process' }}</h3>
          <ol>
            <li>{{ appStore.idioma === 'pt' ? 'O Estado-Membro cumpre um conjunto de marcos.' : 'The Member State fulfills a set of milestones.' }}</li>
            <li>{{ appStore.idioma === 'pt' ? 'Submete um "Pedido de Pagamento" à Comissão Europeia.' : 'Submits a "Payment Request" to the European Commission.' }}</li>
            <li>{{ appStore.idioma === 'pt' ? 'A Comissão tem 2 meses para avaliar (fase \'Em Avaliação\').' : 'The Commission has 2 months to evaluate (phase \'Under Evaluation\').' }}</li>
            <li>{{ appStore.idioma === 'pt' ? 'O Comité Económico e Financeiro aprova e o dinheiro é transferido.' : 'The Economic and Financial Committee approves and the money is transferred.' }}</li>
          </ol>
          <h3>🏦 {{ appStore.idioma === 'pt' ? 'Pré-financiamento' : 'Pre‑financing' }}</h3>
          <p>{{ appStore.idioma === 'pt' ? 'Em 2021, os países receberam um adiantamento de 13% do montante total para iniciar os projetos imediatamente.' : 'In 2021, countries received an advance of 13% of the total amount to start projects immediately.' }}</p>
        </div>
        <div class="export-options" style="margin-top: 20px;">
          <button class="export-item btn-fechar" @click="showGuiaModal = false">{{ appStore.t.desembolsos_guia_fechar }}</button>
        </div>
      </div>
    </div>

    <!-- ==================== MINI BAR STICKY ==================== -->
    <div class="sticky-mini-bar" :class="{ visible: showStickyBar }">
      <div class="mini-item"><span class="mini-label">{{ appStore.t.desembolsos_total_alocado }}</span><span class="mini-value">{{ formatMoneyReduzido(totalAlocadoReal) }}</span></div>
      <div class="mini-divider"></div>
      <div class="mini-item"><span class="mini-label">{{ appStore.t.desembolsos_total_desembolsado }}</span><span class="mini-value">{{ formatMoneyReduzido(totalDesembolsadoReal) }}</span></div>
      <div class="mini-divider"></div>
      <div class="mini-item"><span class="mini-label">{{ appStore.t.desembolsos_taxa_execucao }}</span><span class="mini-value highlight">{{ taxaExecucaoReal }}%</span></div>
      <div class="mini-divider"></div>
      <div class="mini-item"><span class="mini-label">{{ appStore.t.desembolsos_proxima_tranche }}</span><span class="mini-value">{{ proximaTrancheData }}</span></div>
    </div>

    <!-- ==================== HERO SECTION ==================== -->
    <section class="hero">
      <div class="hero-overlay">
        <div class="hero-left" :class="{ 'animate-in': heroVisible }">
          <div class="hero-badge">{{ appStore.t.desembolsos_badge }}</div>
          <h1>{{ appStore.t.desembolsos_titulo }}<br><span class="hero-accent">{{ appStore.t.desembolsos_accent }}</span></h1>
          <p>{{ appStore.t.desembolsos_sub }}</p>
          <div class="hero-actions">
            <button class="btn-hero-primary" @click="showExportModal = true">{{ appStore.t.desembolsos_btn_export }}</button>
            <button class="btn-hero-outline" @click="scrollSmooth('lista-beneficiarios')">{{ appStore.t.desembolsos_btn_top100 }}</button>
            <button class="btn-hero-outline" @click="showGuiaModal = true">{{ appStore.t.desembolsos_btn_guia }}</button>
          </div>
        </div>
        <div class="hero-stats" :class="{ 'animate-in': heroVisible }">
          <div class="hsc"><div class="hsc-icon-wrap">💶</div><span class="hsc-val">{{ formatMoneyReduzido(totalAlocadoReal) }}</span><span class="hsc-label">{{ appStore.t.desembolsos_total_alocado }}</span></div>
          <div class="hsc verde"><div class="hsc-icon-wrap">✅</div><span class="hsc-val">{{ formatMoneyReduzido(totalDesembolsadoReal) }}</span><span class="hsc-label">{{ appStore.t.desembolsos_total_desembolsado }}</span></div>
          <div class="hsc amarelo"><div class="hsc-icon-wrap">📊</div><span class="hsc-val">{{ taxaExecucaoReal }}%</span><span class="hsc-label">{{ appStore.t.desembolsos_taxa_execucao }}</span></div>
          <div class="hsc"><div class="hsc-icon-wrap">🗓️</div><span class="hsc-val">{{ proximaTrancheData }}</span><span class="hsc-label">{{ appStore.t.desembolsos_proxima_tranche }}</span></div>
        </div>
      </div>
    </section>

    <!-- ==================== FILTROS ==================== -->
    <section class="filtros-section" id="filtros">
      <div class="filtros-inner">
        <div class="filtros-left">
          <span class="filtros-titulo">🔍 {{ appStore.idioma === 'pt' ? 'Filtrar' : 'Filter' }}</span>
          <div v-if="filtrosActivos > 0" class="filtros-activos-badge">
            {{ filtrosActivos }} {{ appStore.idioma === 'pt' ? (filtrosActivos > 1 ? 'filtros ativos' : 'filtro ativo') : (filtrosActivos > 1 ? 'active filters' : 'active filter') }}
            · {{ historicoTranches.length }} {{ appStore.idioma === 'pt' ? (historicoTranches.length !== 1 ? 'resultados' : 'resultado') : (historicoTranches.length !== 1 ? 'results' : 'result') }}
          </div>
        </div>
        <div class="filtros-grid">
          <div class="filtro-item" :class="{ 'filtro-activo': filtroPais !== 'todos' }">
            <label>{{ appStore.t.desembolsos_filtro_pais }}</label>
            <select v-model="filtroPais">
              <option value="todos">{{ appStore.t.todos_paises }}</option>
              <option v-for="p in paisesLocal" :key="p.code" :value="p.code">{{ getNomePais(p.code) }}</option>
            </select>
          </div>
          <div class="filtro-item" :class="{ 'filtro-activo': anoSelecionado !== 'todos' }">
            <label>{{ appStore.t.desembolsos_filtro_ano }}</label>
            <select v-model="anoSelecionado">
              <option value="todos">{{ appStore.idioma === 'pt' ? 'Todos os anos' : 'All years' }}</option>
              <option v-for="ano in anosDisponiveis" :key="ano" :value="ano">{{ ano }}</option>
            </select>
          </div>
          <div class="filtro-item" :class="{ 'filtro-activo': estadoSelecionado !== 'todos' }">
            <label>{{ appStore.t.desembolsos_filtro_estado }}</label>
            <select v-model="estadoSelecionado">
              <option value="todos">{{ appStore.t.todos_estados }}</option>
              <option value="Pago">{{ appStore.t.desembolso_estado_pago }}</option>
              <option value="Em Avaliação">{{ appStore.t.desembolso_estado_avaliacao }}</option>
              <option value="Planeado">{{ appStore.t.desembolso_estado_planeado }}</option>
            </select>
          </div>
          <button class="btn-limpar" :class="{ 'btn-limpar-activo': filtrosActivos > 0 }" @click="limparFiltros">{{ appStore.t.desembolsos_filtro_limpar }}</button>
        </div>
      </div>
    </section>

    <!-- ==================== GRÁFICOS ==================== -->
    <section class="graficos-section" id="graficos">
      <div class="graficos-titulo-area">
        <h2>{{ appStore.t.marcos_titulo_grafico }} <span class="pais-indicador-tabela">{{ bandeiraPais }} {{ nomePaisAtual }}</span></h2>
        <p>{{ appStore.t.desembolsos_grafico_sub }}</p>
      </div>
      <div class="graficos-grid">
        <div class="grafico-card grande">
          <div class="grafico-header">
            <div>
              <h3>{{ appStore.t.desembolsos_grafico_barras_titulo }}</h3>
              <p class="grafico-sub">{{ appStore.t.desembolsos_grafico_barras_sub }}</p>
            </div>
            <button class="btn-export-grafico" @click="exportarGrafico('graficoBarras')">📥 PNG</button>
          </div>
          <div class="grafico-canvas-wrap"><canvas id="graficoBarras"></canvas></div>
          <p class="grafico-legenda-texto">{{ appStore.t.desembolsos_grafico_barras_legenda }}</p>
        </div>
        <div class="grafico-card">
          <div class="grafico-header">
            <div>
              <h3>{{ modoCircular === 'financiamento' ? appStore.t.desembolsos_grafico_donut_financiamento_titulo : appStore.t.desembolsos_grafico_donut_setores_titulo }}</h3>
              <p class="grafico-sub">
                {{ modoCircular === 'financiamento' ? appStore.t.desembolsos_grafico_donut_financiamento_sub : appStore.t.desembolsos_grafico_donut_setores_sub }}
              </p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-export-grafico" @click="modoCircular = modoCircular === 'financiamento' ? 'setores' : 'financiamento'"> 
                {{ textoBotaoAlternancia() }}
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
                    <span>{{ item.tipo === 'Subvenção' ? appStore.t.tipo_subvencao : (item.tipo === 'Empréstimo' ? appStore.t.tipo_emprestimo : appStore.t.tipo_misto) }}</span>
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
              <div class="leg-total"><span>{{ appStore.idioma === 'pt' ? 'Total' : 'Total' }}</span><strong>{{ formatMoneyReduzido(totalRealDesembolsado) }}</strong></div>
            </div>
            <p class="grafico-legenda-texto">{{ textoLegendaDonut() }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== DESEMBOLSOS EM DESTAQUE ==================== -->
    <section class="lista-section" id="lista-destaque">
      <div class="lista-header">
        <div>
          <h2>{{ appStore.t.desembolsos_destaque_titulo }} <span class="pais-indicador-tabela">{{ bandeiraPais }} {{ nomePaisAtual }}</span></h2>
          <p class="lista-sub">{{ appStore.t.desembolsos_destaque_sub }}</p>
        </div>
        <div class="lista-header-actions">
          <button class="btn-scroll-tabela" @click="scrollSmooth('lista-beneficiarios')">{{ appStore.t.desembolsos_destaque_btn_top100 }}</button>
          <button class="btn-scroll-tabela" @click="scrollSmooth('lista-tranches')">{{ appStore.t.desembolsos_destaque_btn_historico }}</button>
          <button class="btn-scroll-tabela" @click="scrollSmooth('tabela-tranches')">{{ appStore.t.desembolsos_destaque_btn_tabela }}</button>
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
              <button class="btn-detalhe" @click="mostrarDetalheTranche(tranche)">{{ appStore.t.desembolsos_card_ver_detalhes }}</button>
              <div class="marco-dl" @click="abrirExportCard(tranche)" title="Exportar dados">
                <span class="dl-icon">📥</span>
                <small>{{ appStore.t.desembolsos_card_exportar }}</small>
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
          <h2>{{ appStore.t.desembolsos_top100_titulo }} <span class="pais-indicador-tabela">{{ bandeiraPais }} {{ nomePaisAtual }}</span></h2>
          <p class="lista-sub">{{ appStore.t.desembolsos_top100_sub }}</p>
        </div>
        <div class="lista-header-actions">
          <button class="btn-export-lista" @click="showTop100ExportModal = true">{{ appStore.t.desembolsos_top100_btn_export }}</button>
        </div>
      </div>

      <div class="beneficiarios-scroll">
        <table class="beneficiarios-tabela">
          <thead>
            <tr>
              <th class="ben-col-pos">{{ appStore.t.desembolsos_top100_col_pos }}</th>
              <th class="ben-col-pais">{{ appStore.t.desembolsos_top100_col_pais }}</th>
              <th class="ben-col-nome">{{ appStore.t.desembolsos_top100_col_beneficiario }}</th>
              <th class="ben-col-prog th-sort" @click="ordenarBenefPorValor()">
                {{ appStore.t.desembolsos_top100_col_valor }} <span class="sort-icon">{{ sortBenefDir === 'asc' ? '↑' : (sortBenefDir === 'desc' ? '↓' : '↕') }}</span>
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
          <h2>{{ appStore.t.desembolsos_historico_titulo }} <span class="pais-indicador-tabela">{{ bandeiraPais }} {{ nomePaisAtual }}</span></h2>
          <p class="lista-sub">{{ textoHistoricoSub() }}</p>
        </div>
        <div class="lista-header-actions">
          <button class="btn-scroll-tabela" @click="ordemAscendente = !ordemAscendente">
            {{ textoBotaoOrdem() }}
          </button>
          <button class="btn-export-lista" @click="showExportModal = true">{{ appStore.t.desembolsos_historico_btn_export }}</button>
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
          <h2>{{ appStore.t.desembolsos_tabela_titulo }} <span class="pais-indicador-tabela"> {{ bandeiraPais }} {{ nomePaisAtual }} </span></h2>
          <p class="tabela-sub">{{ appStore.t.desembolsos_tabela_sub }}</p>
        </div>
        <div class="tabela-btns">
          <button class="btn-export-lista" @click="showExportModal = true">{{ appStore.t.desembolsos_tabela_btn_export }}</button>
        </div>
      </div>
      <div class="tabela-wrap">
        <table class="tabela">
          <thead>
            <tr>
              <th @click="ordenarPor('id')" class="th-sort">
                {{ appStore.t.desembolsos_tabela_col_id }} <span class="sort-icon">{{ sortCol === 'id' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </th>
              <th @click="ordenarPor('nome')" class="th-sort">
                {{ appStore.t.desembolsos_tabela_col_designacao }} <span class="sort-icon">{{ sortCol === 'nome' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </th>
              <th @click="ordenarPor('tipo')" class="th-sort">
                {{ appStore.t.desembolsos_tabela_col_tipo }} <span class="sort-icon">{{ sortCol === 'tipo' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </th>
              <th @click="ordenarPor('pais')" class="th-sort">
                {{ appStore.t.desembolsos_tabela_col_pais }} <span class="sort-icon">{{ sortCol === 'pais' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </th>
              <th @click="ordenarPor('valorNum')" class="th-sort">
                {{ appStore.t.desembolsos_tabela_col_montante }} <span class="sort-icon">{{ sortCol === 'valorNum' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </th>
              <th @click="ordenarPor('dataObj')" class="th-sort">
                {{ appStore.t.desembolsos_tabela_col_data }} <span class="sort-icon">{{ sortCol === 'dataObj' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
              </th>
              <th @click="ordenarPor('estadoOrd')" class="th-sort">
                {{ appStore.t.desembolsos_tabela_col_estado }} <span class="sort-icon">{{ sortCol === 'estadoOrd' ? (sortDir === 'asc' ? '↑' : '↓') : '↕' }}</span>
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
            {{ textoVerMais() }}
          </button>
          <button
            class="btn-ver-mais"
            v-if="linhasVisiveis > 10"
            @click="linhasVisiveis = 10"
          >
            {{ appStore.t.desembolsos_tabela_ocultar }}
          </button>
        </div>
        <p class="tabela-nota">{{ textoNotaTabela() }}</p>
      </div>
    </section>

    <!-- ==================== NOTA DE RODAPÉ ==================== -->
    <div class="data-source-note">
      <span class="source-icon">📋</span>
      <p>{{ textoNotaRodape() }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useAppStore } from '@/stores/app'
import { getDesembolsos, getDesembolsosByPais, getPaises } from '@/services/api.js'

Chart.register(...registerables)
const appStore = useAppStore()

// -------------------- ESTADOS --------------------
const paisesLocal = ref([])
const showTop100ExportModal = ref(false)
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
const sortBenefDir = ref('desc')
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
    console.error('Erro ao carregar desembolsos:', e)
    erro.value = appStore.idioma === 'pt' 
      ? 'Falha ao carregar os desembolsos. Verifique a ligação ao servidor.'
      : 'Failed to load disbursements. Check server connection.'
    desembolsosAPI.value = []
  } finally {
    loading.value = false
  }
}

async function carregarTodosDesembolsos() {
  try {
    todosDesembolsos.value = await getDesembolsos()
  } catch (e) {
    console.error('Erro ao carregar todos desembolsos:', e)
    todosDesembolsos.value = []
  }
}

function getNomePais(paisCode) {
  if (!paisCode || paisCode === 'todos') return appStore.t.todos_paises
  const isPt = appStore.idioma === 'pt'
  const pais = paisesLocal.value.find(p => p.code === paisCode)
  if (!pais) return paisCode
  return isPt ? pais.nome_pt : pais.nome_en
}

function textoBotaoAlternancia() {
  const isPt = appStore.idioma === 'pt'
  if (modoCircular.value === 'financiamento') {
    return isPt ? '📊 Setores' : '📊 Sectors'
  } else {
    return isPt ? '💰 Financiamento' : '💰 Financing'
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
      const isPt = appStore.idioma === 'pt'
      const tipo = t.tipologia
      const valorFormatado = formatMoney(t.montante)
      const dataObj = new Date(t.data)
      const setorOriginal = t.setor || ''
      const mesOriginal = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][dataObj.getMonth()]
      const dataFormatada = `${traduzirMes(mesOriginal)} ${dataObj.getFullYear()}`

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

      const paisTraduzido = getNomePaisTraduzido(t.paisCode)

      let setorTraduzido = t.setor
      if (appStore.idioma === 'en') {
        const setoresMap = {
          'Saúde': 'Health', 'Digital': 'Digital', 'Clima': 'Climate',
          'Transversal': 'Cross-cutting', 'Coesão': 'Cohesion',
          'Infraestrutura': 'Infrastructure', 'Educação': 'Education'
        }
        setorTraduzido = setoresMap[t.setor] || t.setor
      }

      const titulo = isPt ? (t.titulo_pt || t.titulo) : (t.titulo_en || t.titulo)
      const descCurta = isPt ? (t.descricaoCurta_pt || t.descricaoCurta || t.descricao || 'Sem descrição')
                           : (t.descricaoCurta_en || t.descricaoCurta || t.descricao || 'No description')

      const beneficiario = isPt ? (t.beneficiario_pt || t.beneficiario || 'Não especificado')
                               : (t.beneficiario_en || t.beneficiario || 'Not specified')

      let tipoTraduzido = tipo
      if (appStore.idioma === 'en') {
        if (tipo === 'Subvenção') tipoTraduzido = 'Grant'
        else if (tipo === 'Empréstimo') tipoTraduzido = 'Loan'
        else if (tipo === 'Misto') tipoTraduzido = 'Mixed'
      }

      let statusClass = ''
      if (estado === 'Pago') statusClass = 'status-pago'
      else if (estado === 'Em Avaliação') statusClass = 'status-avaliacao'
      else statusClass = 'status-planeado'

      return {
        id: t.id,
        nome: titulo,
        tipo: tipoTraduzido,
        valor: valorFormatado,
        data: dataFormatada,
        estado,
        estadoClass,
        estadoOrd,
        statusClass,
        valorNum: t.montante,
        dataObj,
        marcos: 'N/A',
        pais: paisTraduzido,
        paisCode: t.paisCode,
        descCurta,
        setor: setorTraduzido,
        setorOriginal: setorOriginal,
        raw: t,
        beneficiario: beneficiario
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
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  
  const futuras = historicoTranches.value
    .filter(t => {
      if (t.estado !== 'Em Avaliação' && t.estado !== 'Planeado') return false
      return t.dataObj.getTime() > hoje.getTime()
    })
    .sort((a, b) => a.dataObj.getTime() - b.dataObj.getTime())
  
  if (futuras.length === 0) return '—'
  const d = futuras[0].dataObj
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  const mesOriginal = meses[d.getMonth()]
  return `${traduzirMes(mesOriginal)} ${d.getFullYear()}`
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
  desembolsosAPI.value.forEach(t => {
    const dataObj = new Date(t.data)
    anos.add(dataObj.getFullYear())
  })
  return [...anos].sort((a, b) => a - b)
})

const totaisPorSetor = computed(() => {
  const mapa = {}
  historicoTranches.value.forEach(t => {
    const setor = t.setorOriginal || t.setor || ''
    mapa[setor] = (mapa[setor] || 0) + t.valorNum
  })
  return Object.entries(mapa).map(([setor, total]) => {
    let nomeExibicao = setor
    if (appStore.idioma === 'en') {
      const mapEn = {
        'Saúde': 'Health', 'Digital': 'Digital', 'Clima': 'Climate',
        'Transversal': 'Cross-cutting', 'Coesão': 'Cohesion',
        'Infraestrutura': 'Infrastructure', 'Educação': 'Education'
      }
      nomeExibicao = mapEn[setor] || setor
    }
    return { setor: nomeExibicao, total }
  })
})

const totaisPorFinanciamento = computed(() => {
  const mapa = {}
  historicoTranches.value.forEach(t => {
    const tipoOriginal = t.raw.tipologia
    mapa[tipoOriginal] = (mapa[tipoOriginal] || 0) + t.valorNum
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
const topBeneficiarios = computed(() => {
  const mapa = {}
  historicoTranches.value.forEach(t => {
    const beneficiario = t.beneficiario
    const chave = `${beneficiario}||${t.paisCode}||${t.pais}`
    if (!mapa[chave]) {
      mapa[chave] = { nome: beneficiario, paisCode: t.paisCode, pais: t.pais, total: 0 }
    }
    mapa[chave].total += t.valorNum
  })
  let lista = Object.values(mapa)
  lista.sort((a, b) => b.total - a.total)
  lista = lista.map((item, idx) => ({ ...item, rank: idx + 1 }))
  return lista
})

const topBeneficiariosOrdenados = computed(() => {
  const lista = [...topBeneficiarios.value]
  lista.sort((a, b) => {
    return sortBenefDir.value === 'desc' ? b.total - a.total : a.total - b.total
  })
  return lista.slice(0, 100)
})

function ordenarBenefPorValor() {
  sortBenefDir.value = sortBenefDir.value === 'desc' ? 'asc' : 'desc'
}

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

function getBeneficiarioRank(beneficiarioNome, paisCode) {
  const idx = topBeneficiariosOrdenados.value.findIndex(b => b.nome === beneficiarioNome && b.paisCode === paisCode)
  return idx !== -1 ? idx + 1 : null
}

function textoPesoModal() {
  return appStore.t.desembolsos_modal_detalhe_peso.replace('{{pais}}', nomePaisAtual.value)
}

function getMedalIcon(rank) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return ''
}

// -------------------- EXPORT CARD (INDIVIDUAL) --------------------
function abrirExportCard(tranche) {
  cardExportTranche.value = tranche
  showCardExportModal.value = true
}

function exportarTrancheIndividual(formato) {
  const t = cardExportTranche.value
  if (!t) return
  const raw = t.raw
  const isPt = appStore.idioma === 'pt'
  
  if (formato === 'csv') {
    let csv = `ID;País;Código País;Data;Montante;Tipologia;Título;Estado;Descrição Curta;Descrição Longa;Setor;Imagem;Beneficiário\n`
    csv += `${raw.id};${raw.pais};${raw.paisCode};${raw.data};${raw.montante};${raw.tipologia};"${(isPt ? (raw.titulo_pt || raw.titulo) : (raw.titulo_en || raw.titulo)).replace(/"/g, '""')}";${raw.estado || t.estado};"${(isPt ? (raw.descricaoCurta_pt || raw.descricaoCurta || '') : (raw.descricaoCurta_en || raw.descricaoCurta || '')).replace(/"/g, '""')}";"${(raw.descricaoLonga || '').replace(/"/g, '""')}";${raw.setor};${raw.imagem};"${(isPt ? (raw.beneficiario_pt || raw.beneficiario || '') : (raw.beneficiario_en || raw.beneficiario || '')).replace(/"/g, '""')}"\n`
    downloadBlob(csv, 'text/csv', `tranche_${raw.id}.csv`)
    showCardExportModal.value = false
    cardExportTranche.value = null
    return
  } 
  else if (formato === 'json') {
    const json = JSON.stringify(raw, null, 2)
    downloadBlob(json, 'application/json', `tranche_${raw.id}.json`)
    showCardExportModal.value = false
    cardExportTranche.value = null
    return
  } 
  else if (formato === 'pdf') {
    const win = window.open('', '_blank')
    if (!win || win.closed || typeof win.closed === 'undefined') {
      const msg = appStore.idioma === 'pt' 
        ? '❌ O navegador bloqueou a janela de impressão. Permita pop-ups para este site.'
        : '❌ The browser blocked the print window. Please allow pop-ups for this site.'
      alert(msg)
      showCardExportModal.value = false
      cardExportTranche.value = null
      return
    }
    
    const titulo = isPt ? (raw.titulo_pt || raw.titulo) : (raw.titulo_en || raw.titulo)
    const descCurta = isPt ? (raw.descricaoCurta_pt || raw.descricaoCurta || '') : (raw.descricaoCurta_en || raw.descricaoCurta || '')
    const descLonga = isPt ? (raw.descricaoLonga_pt || raw.descricaoLonga || '') : (raw.descricaoLonga_en || raw.descricaoLonga || '')
    const beneficiario = isPt ? (raw.beneficiario_pt || raw.beneficiario || 'Não especificado') : (raw.beneficiario_en || raw.beneficiario || 'Not specified')
    const estado = raw.estado || t.estado
    const estadoLabel = estadoLabelTranche(estado)
    
    win.document.write(`
      <html>
        <head>
          <title>${appStore.t.desembolsos_modal_card_titulo} - ${titulo}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; }
            h1 { color: #931b18; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
            .info { margin-top: 20px; }
            .row { margin-bottom: 12px; }
            .label { font-weight: bold; width: 180px; display: inline-block; color: #931b18; }
            .value { display: inline-block; }
            .desc-box { margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
            .desc-box h3 { margin-top: 0; color: #931b18; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <h1>📥 ${appStore.t.desembolsos_modal_card_titulo}</h1>
          <div class="info">
            <div class="row"><span class="label">${appStore.t.marco_pdf_pais}:</span> <span class="value">${getNomePaisTraduzido(raw.paisCode)}</span></div>
            <div class="row"><span class="label">${appStore.t.desembolsos_tabela_col_id}:</span> <span class="value">T${raw.id}</span></div>
            <div class="row"><span class="label">${appStore.t.desembolsos_tabela_col_designacao}:</span> <span class="value">${titulo}</span></div>
            <div class="row"><span class="label">${appStore.t.desembolsos_tabela_col_estado}:</span> <span class="value">${estadoLabel}</span></div>
            <div class="row"><span class="label">${appStore.t.desembolsos_tabela_col_montante}:</span> <span class="value">${formatMoney(raw.montante)}</span></div>
            <div class="row"><span class="label">${appStore.t.desembolsos_tabela_col_data}:</span> <span class="value">${raw.data}</span></div>
            <div class="row"><span class="label">${appStore.t.desembolsos_tabela_col_tipo}:</span> <span class="value">${raw.tipologia === 'Subvenção' ? appStore.t.tipo_subvencao : (raw.tipologia === 'Empréstimo' ? appStore.t.tipo_emprestimo : appStore.t.tipo_misto)}</span></div>
            <div class="row"><span class="label">${appStore.t.setor_label}:</span> <span class="value">${raw.setor}</span></div>
            <div class="row"><span class="label">${appStore.t.desembolsos_modal_detalhe_beneficiario}:</span> <span class="value">${beneficiario}</span></div>
          </div>
          <div class="desc-box">
            <h3>📝 ${appStore.t.marco_pdf_descricao}</h3>
            <p><strong>${appStore.idioma === 'pt' ? 'Descrição curta:' : 'Short description:'}</strong> ${descCurta}</p>
            <p><strong>${appStore.idioma === 'pt' ? 'Descrição longa:' : 'Long description:'}</strong> ${descLonga.replace(/\n/g, '<br>')}</p>
          </div>
          <div class="footer">${appStore.t.marco_pdf_gerado_em} ${new Date().toLocaleString(appStore.idioma === 'pt' ? 'pt-PT' : 'en-GB')}</div>
        </body>
      </html>
    `)
    win.document.close()
    win.print()
    showCardExportModal.value = false
    cardExportTranche.value = null
    return
  }
}

// -------------------- AUXILIARES --------------------
const nomePaisAtual = computed(() => {
  const pais = appStore.paises.find(p => p.code === filtroPais.value)
  return pais ? pais.nome : 'Todos os países'
})

const bandeiraPais = computed(() => {
  if (filtroPais.value === 'todos') return '🌍'
  const pais = paisesLocal.value.find(p => p.code === filtroPais.value)
  return pais?.bandeira || '🌍'
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
  if (!paisCode) return '🌍'
  const pais = paisesLocal.value.find(p => p.code === paisCode)
  return pais?.bandeira || '🌍'
}

function traduzirMes(mesAbreviado) {
  if (appStore.idioma !== 'en') return mesAbreviado
  const meses = {
    'Jan': 'Jan', 'Fev': 'Feb', 'Mar': 'Mar', 'Abr': 'Apr',
    'Mai': 'May', 'Jun': 'Jun', 'Jul': 'Jul', 'Ago': 'Aug',
    'Set': 'Sep', 'Out': 'Oct', 'Nov': 'Nov', 'Dez': 'Dec'
  }
  return meses[mesAbreviado] || mesAbreviado
}

function getNomePaisTraduzido(paisCode) {
  if (!paisCode || paisCode === 'todos') return appStore.t.todos_paises
  const pais = paisesLocal.value.find(p => p.code === paisCode)
  if (!pais) return paisCode
  const isPt = appStore.idioma === 'pt'
  return isPt ? pais.nome_pt : pais.nome_en
}

function overlayGradienteDesembolsos(setor) {
  const cores = {
    'Saúde': 'linear-gradient(to top, rgba(123,28,28,0.85) 0%, rgba(123,28,28,0.1) 60%)',
    'Health': 'linear-gradient(to top, rgba(123,28,28,0.85) 0%, rgba(123,28,28,0.1) 60%)',
    'Digital': 'linear-gradient(to top, rgba(26,58,107,0.85) 0%, rgba(26,58,107,0.1) 60%)',
    'Clima': 'linear-gradient(to top, rgba(26,92,46,0.85) 0%, rgba(26,92,46,0.1) 60%)',
    'Climate': 'linear-gradient(to top, rgba(26,92,46,0.85) 0%, rgba(26,92,46,0.1) 60%)',
    'Transversal': 'linear-gradient(to top, rgba(147,27,24,0.85) 0%, rgba(147,27,24,0.1) 60%)',
    'Cross-cutting': 'linear-gradient(to top, rgba(147,27,24,0.85) 0%, rgba(147,27,24,0.1) 60%)',
    'Coesão': 'linear-gradient(to top, rgba(58,26,107,0.85) 0%, rgba(58,26,107,0.1) 60%)',
    'Cohesion': 'linear-gradient(to top, rgba(58,26,107,0.85) 0%, rgba(58,26,107,0.1) 60%)',
    'Infraestrutura': 'linear-gradient(to top, rgba(42,42,42,0.85) 0%, rgba(42,42,42,0.1) 60%)',
    'Infrastructure': 'linear-gradient(to top, rgba(42,42,42,0.85) 0%, rgba(42,42,42,0.1) 60%)',
    'Educação': 'linear-gradient(to top, rgba(107,58,26,0.85) 0%, rgba(107,58,26,0.1) 60%)',
    'Education': 'linear-gradient(to top, rgba(107,58,26,0.85) 0%, rgba(107,58,26,0.1) 60%)'
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

function scrollSmooth(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function estadoLabelTranche(estado) {
  if (estado === 'Pago') return appStore.t.desembolso_estado_pago
  if (estado === 'Em Avaliação') return appStore.t.desembolso_estado_avaliacao
  return appStore.t.desembolso_estado_planeado
}

function textoTop100Desc() {
  return appStore.t.desembolsos_modal_top100_desc
    .replace('{{pais}}', nomePaisAtual.value)
    .replace('{{total}}', topBeneficiariosOrdenados.value.length)
}

function textoCardExportDesc() {
  const nome = cardExportTranche.value?.nome || 'Tranche selecionada'
  return appStore.t.desembolsos_modal_card_desc.replace('{{nome}}', nome)
}

function textoLegendaDonut() {
  return appStore.t.desembolsos_grafico_donut_legenda.replace('{{total}}', historicoTranches.value.length)
}

function textoNotaRodape() {
  return appStore.t.desembolsos_nota_fonte.replace('{{hora}}', horaAtual.value)
}

function iconeSetor(setor) {
  const mapa = {
    'Saúde': '❤️',
    'Health': '❤️',
    'Digital': '💻',
    'Clima': '🌿',
    'Climate': '🌿',
    'Coesão': '👥',
    'Cohesion': '👥',
    'Educação': '🎓',
    'Education': '🎓',
    'Infraestrutura': '🏢',
    'Infrastructure': '🏢'
  }
  return mapa[setor] || '📌'
}

const coresSetores = {
  'Saúde': '#e74c3c',
  'Health': '#e74c3c',
  'Digital': '#3498db',
  'Clima': '#2ecc71',
  'Climate': '#2ecc71',
  'Coesão': '#9b59b6',
  'Cohesion': '#9b59b6',
  'Infraestrutura': '#f39c12',
  'Infrastructure': '#f39c12',
  'Educação': '#f39c12',
  'Education': '#f39c12'
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
          label: appStore.idioma === 'pt' ? 'Desembolsos por ano' : 'Disbursements by year',
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
            if (anoSelecionado.value !== 'todos') {
              anoSelecionado.value = 'todos'
            } else {
              anoSelecionado.value = anoClicado
            }
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
      backgroundColor = dadosSetor.map(d => {
        let setorOriginal = d.setor
        if (appStore.idioma === 'en') {
          const mapPt = {
            'Health': 'Saúde', 'Digital': 'Digital', 'Climate': 'Clima',
            'Cross-cutting': 'Transversal', 'Cohesion': 'Coesão',
            'Infrastructure': 'Infraestrutura', 'Education': 'Educação'
          }
          setorOriginal = mapPt[d.setor] || d.setor
        }
        return coresSetores[setorOriginal] || coresSetores[d.setor] || '#999'
      })
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
                  extra = ` (${contagem} ${appStore.idioma === 'pt' ? (contagem !== 1 ? 'desembolsos' : 'desembolso') : (contagem !== 1 ? 'disbursements' : 'disbursement')})`
                } else {
                  const setor = labels[ctx.dataIndex]
                  const contagem = contagemPorSetor.value.find(c => c.setor === setor)?.count || 0
                  extra = ` (${contagem} ${appStore.idioma === 'pt' ? (contagem !== 1 ? 'desembolsos' : 'desembolso') : (contagem !== 1 ? 'disbursements' : 'disbursement')})`
                }
                const nomeLabel = appStore.idioma === 'pt' ? labels[ctx.dataIndex] : (labels[ctx.dataIndex] === 'Subvenção' ? 'Grant' : (labels[ctx.dataIndex] === 'Empréstimo' ? 'Loan' : 'Mixed'))
                return ` ${nomeLabel}: ${valor.toLocaleString('pt-PT')} €${extra}`
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

// -------------------- EXPORTAÇÃO GERAL --------------------
function exportarDesembolsos(tipo) {
  const isPt = appStore.idioma === 'pt'
  const pais = nomePaisAtual.value  // já deve estar traduzido
  const dataGeracao = new Date().toLocaleDateString(isPt ? 'pt-PT' : 'en-GB')
  const codigoPais = filtroPais.value
  const prefixo = isPt ? 'desembolsos_prr' : 'prr_disbursements'

  // Dados filtrados (tranches)
  const tranches = historicoTranches.value
  const totais = {
    alocado: totalAlocadoReal.value,
    desembolsado: totalDesembolsadoReal.value,
    taxaExecucao: taxaExecucaoReal.value,
    proximaTranche: proximaTrancheData.value
  }

  if (tipo === 'csv') {
    let csv = `${isPt ? 'Relatório Financeiro PRR' : 'PRR Financial Report'}\n`
    csv += `${isPt ? 'País' : 'Country'};${pais}\n\n`
    csv += `${isPt ? 'Indicador;Valor' : 'Indicator;Value'}\n`
    csv += `${appStore.t.desembolsos_total_alocado};${formatMoney(totais.alocado)}\n`
    csv += `${appStore.t.desembolsos_total_desembolsado};${formatMoney(totais.desembolsado)}\n`
    csv += `${appStore.t.desembolsos_taxa_execucao};${totais.taxaExecucao}%\n`
    csv += `${appStore.t.desembolsos_proxima_tranche};${totais.proximaTranche}\n\n`
    csv += `${isPt ? 'Tranches (detalhe completo)' : 'Tranches (full details)'}\n`
    csv += `${isPt ? 'ID;País;Código;Data;Montante;Tipologia;Título;Estado;Descrição;Setor;Beneficiário' : 'ID;Country;Code;Date;Amount;Type;Title;Status;Description;Sector;Beneficiary'}\n`
    tranches.forEach(t => {
      const raw = t.raw
      const titulo = isPt ? (raw.titulo_pt || raw.titulo) : (raw.titulo_en || raw.titulo)
      const desc = isPt ? (raw.descricaoCurta_pt || raw.descricaoCurta || '') : (raw.descricaoCurta_en || raw.descricaoCurta || '')
      const beneficiario = isPt ? (raw.beneficiario_pt || raw.beneficiario || '') : (raw.beneficiario_en || raw.beneficiario || '')
      const tipoTraduzido = traduzirTipologia(raw.tipologia) // já deve usar idioma
      csv += `${raw.id};${raw.pais};${raw.paisCode};${raw.data};${raw.montante};${tipoTraduzido};"${titulo.replace(/"/g, '""')}";${estadoLabelTranche(raw.estado || t.estado)};"${desc.replace(/"/g, '""')}";${raw.setor};"${beneficiario.replace(/"/g, '""')}"\n`
    })
    downloadBlob(csv, 'text/csv', `${prefixo}_${codigoPais}.csv`)
  } 
  else if (tipo === 'json') {
    const jsonData = {
      pais,
      indicadores: totais,
      tranches: tranches.map(t => t.raw)
    }
    const json = JSON.stringify(jsonData, null, 2)
    downloadBlob(json, 'application/json', `${prefixo}_${codigoPais}.json`)
  } 
  else if (tipo === 'pdf') {
    const win = window.open('', '_blank')
    if (!win || win.closed || typeof win.closed === 'undefined') {
      alert(isPt ? '❌ O navegador bloqueou a janela de impressão. Permita pop-ups para este site.' : '❌ The browser blocked the print window. Please allow pop-ups for this site.')
      return
    }
    win.document.write(`
      <html>
        <head>
          <title>${isPt ? 'Relatório Financeiro PRR' : 'PRR Financial Report'} - ${pais}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #931b18; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
            th { background-color: #931b18; color: white; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <h1>${isPt ? 'Relatório Financeiro PRR' : 'PRR Financial Report'} - ${pais}</h1>
          <h2>${isPt ? 'Indicadores' : 'Indicators'}</h2>
          <table>
            <tr><th>${isPt ? 'Indicador' : 'Indicator'}</th><th>${isPt ? 'Valor' : 'Value'}</th></tr>
            <tr><td>${appStore.t.desembolsos_total_alocado}</td><td>${formatMoney(totais.alocado)}</td></tr>
            <tr><td>${appStore.t.desembolsos_total_desembolsado}</td><td>${formatMoney(totais.desembolsado)}</td></tr>
            <tr><td>${appStore.t.desembolsos_taxa_execucao}</td><td>${totais.taxaExecucao}%</td></tr>
            <tr><td>${appStore.t.desembolsos_proxima_tranche}</td><td>${totais.proximaTranche}</td></tr>
          </table>
          <h2>${isPt ? 'Tranches (detalhe completo)' : 'Tranches (full details)'}</h2>
          <table>
            <thead>
              <tr>
                <th>${appStore.t.desembolsos_tabela_col_id}</th>
                <th>${appStore.t.desembolsos_tabela_col_pais}</th>
                <th>${isPt ? 'Código' : 'Code'}</th>
                <th>${appStore.t.desembolsos_tabela_col_data}</th>
                <th>${appStore.t.desembolsos_tabela_col_montante}</th>
                <th>${appStore.t.desembolsos_tabela_col_tipo}</th>
                <th>${appStore.t.desembolsos_tabela_col_designacao}</th>
                <th>${appStore.t.desembolsos_tabela_col_estado}</th>
                <th>${isPt ? 'Descrição' : 'Description'}</th>
                <th>${appStore.t.setor_label}</th>
                <th>${appStore.t.desembolsos_modal_detalhe_beneficiario}</th>
              </tr>
            </thead>
            <tbody>
              ${tranches.map(t => {
                const raw = t.raw
                const titulo = isPt ? (raw.titulo_pt || raw.titulo) : (raw.titulo_en || raw.titulo)
                const desc = isPt ? (raw.descricaoCurta_pt || raw.descricaoCurta || '') : (raw.descricaoCurta_en || raw.descricaoCurta || '')
                const beneficiario = isPt ? (raw.beneficiario_pt || raw.beneficiario || '') : (raw.beneficiario_en || raw.beneficiario || '')
                const tipoTraduzido = traduzirTipologia(raw.tipologia)
                return `
                  <tr>
                    <td>${raw.id}</td>
                    <td>${raw.pais}</td>
                    <td>${raw.paisCode}</td>
                    <td>${raw.data}</td>
                    <td>${formatMoney(raw.montante)}</td>
                    <td>${tipoTraduzido}</td>
                    <td>${titulo}</td>
                    <td>${estadoLabelTranche(raw.estado || t.estado)}</td>
                    <td>${desc}</td>
                    <td>${raw.setor}</td>
                    <td>${beneficiario}</td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
          <div class="footer">${isPt ? 'Gerado em' : 'Generated on'} ${new Date().toLocaleString(isPt ? 'pt-PT' : 'en-GB')}</div>
        </body>
      </html>
    `)
    win.document.close()
    win.print()
  }
  showExportModal.value = false
}

// -------------------- EXPORTAÇÃO TOP 100 BENEFICIÁRIOS --------------------
function exportarTopBeneficiarios(tipo) {
  const dados = topBeneficiariosOrdenados.value
  const pais = nomePaisAtual.value

  if (tipo === 'csv') {
    let csv = `${appStore.t.desembolsos_top100_titulo} - ${pais}\n`
    csv += `${appStore.t.desembolsos_top100_col_pos};${appStore.t.desembolsos_top100_col_pais};${appStore.t.desembolsos_top100_col_beneficiario};${appStore.t.desembolsos_top100_col_valor}\n`
    dados.forEach(b => {
      csv += `${b.rank};${b.pais};${b.nome};${formatMoneyReduzido(b.total)}\n`
    })
    downloadBlob(csv, 'text/csv', `top100_beneficiarios_${filtroPais.value}.csv`)
  } 
  else if (tipo === 'json') {
    const json = JSON.stringify(dados, null, 2)
    downloadBlob(json, 'application/json', `top100_beneficiarios_${filtroPais.value}.json`)
  } 
  else if (tipo === 'pdf') {
    const win = window.open('', '_blank')
    if (!win || win.closed || typeof win.closed === 'undefined') {
      const msg = appStore.idioma === 'pt' 
        ? '❌ O navegador bloqueou a janela de impressão. Permita pop-ups para este site.'
        : '❌ The browser blocked the print window. Please allow pop-ups for this site.'
      alert(msg)
      showTop100ExportModal.value = false
      return
    }
    win.document.write(`
      <html>
        <head>
          <title>${appStore.t.desembolsos_top100_titulo} - ${pais}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #931b18; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
            th { background-color: #931b18; color: white; }
            .footer { margin-top: 30px; font-size: 10px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <h1>🏆 ${appStore.t.desembolsos_top100_titulo} - ${pais}</h1>
          <p>${appStore.idioma === 'pt' ? 'Lista dos maiores beneficiários por valor aprovado.' : 'List of the largest beneficiaries by approved amount.'}</p>
          <table>
            <thead>
              <tr>
                <th>${appStore.t.desembolsos_top100_col_pos}</th>
                <th>${appStore.t.desembolsos_top100_col_pais}</th>
                <th>${appStore.t.desembolsos_top100_col_beneficiario}</th>
                <th>${appStore.t.desembolsos_top100_col_valor}</th>
              </tr>
            </thead>
            <tbody>
              ${dados.map(b => `
                <tr>
                  <td>${b.rank}</td>
                  <td>${b.pais}</td>
                  <td>${b.nome}</td>
                  <td>${formatMoneyReduzido(b.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">${appStore.t.marco_pdf_gerado_em} ${new Date().toLocaleString(appStore.idioma === 'pt' ? 'pt-PT' : 'en-GB')}</div>
        </body>
      </html>
    `)
    win.document.close()
    win.print()
  }
  showTop100ExportModal.value = false
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

// -------------------- MÉTODOS PARA TEXTOS DINÂMICOS --------------------
function textoHistoricoSub() {
  const ordem = ordemAscendente.value 
    ? (appStore.idioma === 'pt' ? 'mais antigos primeiro' : 'oldest first')
    : (appStore.idioma === 'pt' ? 'mais recentes primeiro' : 'most recent first')
  return `${historicoTranches.value.length} ${appStore.idioma === 'pt' ? (historicoTranches.value.length !== 1 ? 'tranches' : 'tranche') : (historicoTranches.value.length !== 1 ? 'tranches' : 'tranche')} · ${ordem}`
}

function textoBotaoOrdem() {
  return ordemAscendente.value 
    ? (appStore.idioma === 'pt' ? '↓ Mais recentes' : '↓ Most recent')
    : (appStore.idioma === 'pt' ? '↑ Mais antigos' : '↑ Oldest')
}

function textoVerMais() {
  const count = Math.min(10, tranchesOrdenadas.value.length - linhasVisiveis.value)
  return appStore.t.desembolsos_tabela_ver_mais.replace('{{count}}', count)
}

function textoNotaTabela() {
  return appStore.t.desembolsos_tabela_nota
    .replace('{{visible}}', tranchesPaginadas.value.length)
    .replace('{{total}}', historicoTranches.value.length)
}

// -------------------- STICKY BAR SCROLL --------------------
function handleScroll() {
  const hero = document.querySelector('.hero')
  if (hero) {
    const heroBottom = hero.getBoundingClientRect().bottom
    showStickyBar.value = heroBottom < 0
  }
}

const handleResize = () => {
  criarGraficos()
}

// -------------------- CICLO DE VIDA --------------------
onMounted(async () => {
  try {
    if (paisesLocal.value.length === 0) {
      paisesLocal.value = await getPaises()
      if (!appStore.paises || appStore.paises.length === 0) {
        appStore.paises = paisesLocal.value
      }
    }
    await carregarTodosDesembolsos()
    await carregarDesembolsos()
    atualizarHora()
    intervalo = setInterval(atualizarHora, 60000)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    const appContent = document.querySelector('.app-content')
    if (appContent) {
      let timeoutId = null
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            if (timeoutId) clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
              criarGraficos()
            }, 250)
          }
        })
      })
      mutationObserver.observe(appContent, { attributes: true })
      window._mutationObserver = mutationObserver
    }

    setTimeout(() => {
      heroVisible.value = true
      criarGraficos()
    }, 100)
  } catch (err) {
    console.error('Erro na inicialização dos desembolsos:', err)
    erro.value = appStore.idioma === 'pt' 
      ? 'Não foi possível carregar os dados. Verifique a ligação ao servidor.'
      : 'Could not load data. Check server connection.'
    loading.value = false
  }
})

onUnmounted(() => {
  if (intervalo) clearInterval(intervalo)
  if (window._mutationObserver) {
    window._mutationObserver.disconnect()
    delete window._mutationObserver
  }
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})

watch(filtroPais, () => {
  carregarDesembolsos()
  criarGraficos()
})

watch([anoSelecionado, estadoSelecionado, totaisPorAno, totaisPorSetor, modoCircular], () => {
  criarGraficos()
})

watch(() => appStore.idioma, () => {
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
.hero { background-image: url('https://images.unsplash.com/photo-1701434001217-16428abc6309?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size: cover; background-position: center; background-attachment: fixed; min-height: 70vh; }
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
.hsc { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 16px 12px; text-align: center; backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 100px; transition: transform 0.3s, border-color 0.3s; cursor: default; }
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
.graficos-titulo-area h2 { font-size: 2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 8px; justify-content: center; text-align: center; }
.graficos-titulo-area p { font-size: 0.92rem; color: #aaa; max-width: 600px; margin: 0 auto; }
.graficos-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 25px; align-items: start; }
.grafico-legenda-texto { font-size: 0.72rem; color: #bbb; margin-top: 12px; line-height: 1.5; font-style: italic; }
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

/* Aumentar largura da coluna País na tabela Top 100 */
.beneficiarios-tabela .ben-col-pais {
  width: 140px;
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

/* Hero alinhado à esquerda em ecrãs médios/pequenos */
@media (max-width: 992px) {
  .hero-overlay {
    flex-direction: column;
    text-align: left;
    justify-content: flex-start;
    
  }
  .hero-left h1 {
    font-size: 3rem;
  }
  .hero-stats {
    grid-template-columns: 1fr 1fr;
    width: 100%;
    justify-content: flex-start;
  }
  .graficos-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .filtros-grid { flex-direction: column; }
  .marcos-grid { grid-template-columns: 1fr; }
  .detalhe-tranche-campos { grid-template-columns: 1fr; gap: 12px; }
  .campo-beneficiario-full { grid-column: span 1; }
  .graficos-section { padding: 40px 5%;}
  .grafico-canvas-wrap,.donut-canvas-wrap {overflow-x: auto;}
  .grafico-canvas-wrap canvas,.donut-canvas-wrap canvas { max-width: 300px;}
  .graficos-titulo-area h2 {
    flex-direction: column;
    align-items: flex-start;
  }
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

/* Garante que o indicador de país nunca seja cortado e possa quebrar linha */
.lista-header h2,
.tabela-header h2,
.graficos-titulo-area h2 {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
  word-break: break-word;
  white-space: normal;
}

.pais-indicador-tabela {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem;
  white-space: normal;
  word-break: keep-all; /* evita quebrar a bandeira do nome */
  background: #f5f5f5;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 600;
  border: 1px solid #ddd;
  font-size: 0.7em;
  line-height: 1.4;
}

/* Para ecrãs muito pequenos, permite que o indicador ocupe largura total */
@media (max-width: 640px) {
  .lista-header h2,
  .tabela-header h2,
  .graficos-titulo-area h2 {
    flex-direction: column;
    align-items: flex-start;
  }
  .pais-indicador-tabela {
    margin-left: 0;
    margin-top: 0.25rem;
  }
}

.grafico-canvas-wrap canvas,
.donut-canvas-wrap canvas {
  max-width: 100%;
  height: auto !important;
}

/* Empilhar botões verticalmente em ecrãs pequenos ou quando a sidebar está expandida */
@media (max-width: 768px) {
  .lista-header-actions,
  .hero-actions,
  .tabela-btns,
  .detalhe-tranche-actions {
    flex-direction: column !important;
    align-items: stretch !important;
    width: 100%;
  }
  .btn-scroll-tabela,
  .btn-export-lista,
  .btn-hero-primary,
  .btn-hero-outline,
  .btn-export-detalhe,
  .btn-fechar-detalhe {
    width: 100% !important;
    text-align: center !important;
    box-sizing: border-box;
  }
}
</style>