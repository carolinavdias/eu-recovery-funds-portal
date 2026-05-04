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
                <div class="barra-fill" :style="{ width: ind.progresso + '%', background: corBarra(ind.progresso) }"></div>
              </div>
              <button class="btn-saber">Saber Mais →</button>
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
              <button class="btn-exportar-outro" @click="exportar('csv')">Exportar</button>
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

    <!-- MODAL METODOLOGIA (NOVO) -->
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
            <li><span style="color:#d4af37;">75% – 100%</span>: Próximo ou atingido</li>
          </ul>
          
          <h3>🔍 Transparência</h3>
          <p>Todos os dados são públicos e podem ser exportados nos formatos CSV, JSON e PDF através do painel lateral.</p>
        </div>
        <div class="export-options" style="margin-top: 20px;">
          <button class="export-item" @click="showMetodologiaModal = false">
            <span>Fechar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- FOOTER: fora do indicadores-container -->
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
            <li>Metodologia</li>
            <li>Dados Abertos</li>
            <li>FAQ</li>
            <li>Contactos</li>
          </ul>
        </div>
        <div class="footer-col">
          <p class="footer-col-titulo">INFORMAÇÃO LEGAL</p>
          <ul>
            <li>Privacidade</li>
            <li>Termos e Condições</li>
            <li>Cookies</li>
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
import { ref } from 'vue'

const paisSelecionado = ref('pt')
const periodoSelecionado = ref('s1-2025')

const indicadores = ref([
  { id: 1, icone: '🎓', categoria: 'EDUCAÇÃO', nome: 'Participantes em formação', valor: '452.890', progresso: 68 },
  { id: 2, icone: '⚡', categoria: 'ENERGIA', nome: 'Capacidade renovável', valor: '1.250 MW', progresso: 42 },
  { id: 3, icone: '💻', categoria: 'DIGITAL', nome: 'Serviços públicos digitais', valor: '1.000', progresso: 91 },
  { id: 4, icone: '🏠', categoria: 'SOCIAL', nome: 'Habitação social renovada', valor: '12.450', progresso: 55 },
  { id: 5, icone: '📊', categoria: 'ECONOMIA', nome: 'Apoio a PME e Inovação', valor: '3.120', progresso: 30 },
  { id: 6, icone: '🏥', categoria: 'SAÚDE', nome: 'Capacidade hospitalar', valor: '850', progresso: 78 },
])

const outrosIndicadores = ref([
  { id: 1, icone: '🌿', nome: 'Redução de emissões de CO2', valor: '18% Redução' },
  { id: 2, icone: '🚌', nome: 'Mobilidade sustentável urbana', valor: '120 novas rotas' },
  { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€540M' },
])

// Estado do modal metodologia
const showMetodologiaModal = ref(false)

function abrirMetodologia() {
  showMetodologiaModal.value = true
}

function corBarra(pct) {
  if (pct >= 75) return '#931b18'
  if (pct >= 40) return '#d4af37'
  return '#d4af37'
}

function exportar(tipo) {
  const dados = tipo === 'csv'
    ? 'indicador,valor,progresso\nParticipantes em formação,452890,68\nCapacidade renovável,1250MW,42'
    : 'Relatório PRR - Indicadores Comuns - Simulação'
  const blob = new Blob([dados], { type: tipo === 'csv' ? 'text/csv' : 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `indicadores-prr.${tipo}`
  a.click()
  URL.revokeObjectURL(url)
}

// --- Funções corrigidas para o footer ---
function copiarLinkSimples() {
  const url = window.location.href;
  // Método mais universal
  const input = document.createElement('input');
  input.value = url;
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, 99999); // para mobile
  try {
    document.execCommand('copy');
    alert('✅ Link copiado: ' + url);
  } catch (err) {
    alert('❌ Não foi possível copiar. Copie manualmente: ' + url);
  }
  document.body.removeChild(input);
}

function abrirEmailSimples() {
  console.log('Botão clicado!');
  window.location.href = 'mailto:info@prr-europa.eu';
  // Fallback caso não abra
  setTimeout(() => {
    alert('Se o email não abriu, envie manualmente para info@prr-europa.eu');
  }, 500);
}

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      mostrarNotificacao("🔗 Link copiado (fallback)");
    } else {
      mostrarNotificacao("❌ Erro ao copiar. Copie manualmente: " + text);
    }
  } catch (err) {
    console.error('Fallback error:', err);
    mostrarNotificacao("❌ Erro ao copiar link.");
  }
  document.body.removeChild(textArea);
}

function abrirEmail() {
  window.location.href = "mailto:info@prr-europa.eu";
}

function mostrarNotificacao(mensagem) {
  // Remove notificação existente se houver
  const existing = document.querySelector('.custom-notification');
  if (existing) existing.remove();

  const notificacao = document.createElement('div');
  notificacao.className = 'custom-notification';
  notificacao.textContent = mensagem;
  notificacao.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #931b18;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 9999;
    font-family: system-ui, -apple-system, sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: notificacaoEntrada 0.3s ease;
  `;
  document.body.appendChild(notificacao);
  setTimeout(() => {
    notificacao.style.animation = 'notificacaoSaida 0.3s ease';
    setTimeout(() => notificacao.remove(), 300);
  }, 3000);
}
// -----------------------------------------
</script>

<style scoped>
* { box-sizing: border-box; }

/* Animações para notificações */
@keyframes notificacaoEntrada {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes notificacaoSaida {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.indicadores-container {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden !important;
}

/* LAYOUT PRINCIPAL */
.main-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 30px;
  padding: 30px 4% 0 4%;
  width: 100%;
}

/* COLUNA ESQUERDA */
.col-esquerda {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}

/* HEADER */
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

.btn-metodologia {
  background: #931b18;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  transition: background 0.2s, transform 0.3s ease;
}

.btn-metodologia:hover { 
  background: #7a1614; 
  transform: translateY(-3px);
}

/* FILTROS */
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

/* SECTION HEADER */
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
  text-transform: none;
}

/* CARDS */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  background: transparent;
  border: none;
  padding: 10px 0;
}

.indicador-card {
  background: white;
  padding: 24px;
  display: flex;
  border-radius: 16px;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f0f0f0;
}

.indicador-card:hover {
  transform: translateY(-5px); 
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12); 
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
  align-items: center;
  margin-bottom: 4px;
}

.prog-label {
  font-size: 0.62rem;
  color: #aaa;
  font-weight: 700;
  letter-spacing: 0.5px;
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

/* OUTROS INDICADORES */
.outros-lista {
  display: flex;
  flex-direction: column;
  gap: 16px; 
  background: transparent;
  border: none;
}

.outro-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.outro-item:hover {
  transform: translateX(8px); 
  border-color: #d4af37;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
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
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-exportar-outro:hover {
  background: #7a1614;
}

/* COLUNA DIREITA */
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
  background-color: #7a1614;   
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2); 
}

.exportar-box {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.exportar-header h3 {
  color: #931b18 !important;
  margin: 0 0 5px 0;
  font-size: 1.2rem;
}

.exportar-header p {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
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
  transition: 0.3s;
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
  color: #931b18 !important;
  border: 2px solid #931b18;
}

.btn-action.pdf:hover {
  background: #fdf2f2; 
  border-color: #7a1614; 
}


/* Sincronização */
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
  color: #931b18 !important;;
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

.export-icone { 
  font-size: 1.4rem; 
  color: #931b18; 
}

.exportar-titulo {
  font-weight: 700;
  color: #931b18;
  font-size: 1rem;
  margin-bottom: 4px;
}

.exportar-desc {
  font-size: 0.78rem;
  color: #666;
  line-height: 1.5;
}

.btn-export {
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: opacity 0.2s, transform 0.3s ease;
}

.btn-export:hover { 
  opacity: 0.85; 
  transform: translateY(-3px); 
}

.btn-export.csv {
  background: #931b18;
  color: white;
  border: none;
}

.btn-export.pdf {
  background: white;
  color: #931b18;
  border: 2px solid #931b18;
}

.btn-export-icon { 
  font-size: 1rem; 
  }

.sync-box {
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.sync-label {
  font-size: 0.62rem;
  font-weight: 700;
  color: #aaa;
  letter-spacing: 1px;
  margin-bottom: 6px;
}

.sync-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: #333;
}

.sync-check { 
  font-size: 1rem; 
}

/* ========== ESTILOS EXCLUSIVOS DO MODAL METODOLOGIA ========== */
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
  color: #FFD700; /* Título principal amarelo */
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
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
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
  background: rgba(255, 255, 255, 0.2); 
}
.export-item .ext { 
  opacity: 0.6; 
  font-family: monospace; 
}

/* Conteúdo do modal metodologia */
.metodologia-card {
  max-width: 600px;
  text-align: left;
}

.metodologia-content {
  margin: 20px 0;
}

.metodologia-content h3 {
  color: white;          /* títulos das secções a branco */
  font-weight: bold;
  margin: 15px 0 8px;
  font-size: 1.2rem;
}

.metodologia-content p, 
.metodologia-content ul {
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
/* ========== FIM ESTILOS METODOLOGIA ========== */

/* FOOTER */
.ind-footer {
  color: white;
  width: 100%;
  background: linear-gradient(to bottom, #d4af37 7px, #931b18 7px);
  box-shadow: 0 400px 0 400px #931b18;
  margin-top: 100px;
  padding: 80px 8% 15px;
  padding-bottom: 10px !important;
}

.footer-grid {
  display: flex !important;
  justify-content: space-between !important;
  max-width: 95% !important; 
  width: 95% !important;
  margin: 0 auto 30px !important;
  padding: 0 !important;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: auto !important; 
  min-width: 500px; 
}

.footer-brand .footer-logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: #d4af37;        
  margin-bottom: 30px;  
  display: block;       
}

.footer-logo {
  white-space: nowrap;
  font-size: 1.7rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-brand p {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.8;
  margin-bottom: 50px !important;
  max-width: 420px;
}

.footer-icons {
  display: flex;
  gap: 20px;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 80px;
  z-index: 999;
}

.footer-icons span {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.3s ease; 
}

.footer-icons span:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px); 
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  opacity: 1;
}

.icon-btn {
  cursor: pointer !important;
  pointer-events: auto !important; 
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-right: 5px;
  background: rgba(255, 255, 255, 0.2); 
  width: 55px;
  height: 55px;
  border-radius: 10px;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.2); /* Brilha um pouco ao passar o rato */
  transform: translateY(-2px);
}

.icon-btn span {
  font-size: 1.2rem;
  line-height: 1;
}

.footer-col-titulo {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 1px;
  opacity: 0.6;
  margin-bottom: 25px;
  color: #d4af37; 
  opacity: 1;
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
  transition: opacity 0.2s;
}

.footer-col ul li:hover { 
  opacity: 1; 
  transform: translateX(3px);
}

.footer-bottom {
  display: flex !important;
  justify-content: space-between !important;
  margin-top: 20px !important;
  padding-top: 15px !important;
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
  border-top: 1px solid rgba(255, 255, 255, 0.2) !important;
}

@media (max-width: 1100px) {
  .main-layout {
    grid-template-columns: 1fr; 
  }
  .col-direita {
    width: 100%;
  }
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
</style>