<template>
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
          <button class="btn-metodologia">
            <span>❓</span> Guia de Metodologia
          </button>
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
              </select>
            </div>
          </div>
          <div class="filtro-group">
            <label>PERÍODO DE REPORTE</label>
            <div class="select-wrapper">
              <select v-model="periodoSelecionado">
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
        <div class="section-header" style="margin-top: 30px;">
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

        <div class="exportar-box">
          <div class="exportar-header">
            <span class="export-icone">📥</span>
            <div>
              <p class="exportar-titulo">Exportar Dados</p>
              <p class="exportar-desc">Obtenha os dados consolidados de todos os 14 indicadores para análise externa.</p>
            </div>
          </div>

          <button class="btn-export csv" @click="exportar('csv')">
            <span class="btn-export-icon">📄</span>
            <span>Descarregar CSV</span>
          </button>
          <button class="btn-export pdf" @click="exportar('pdf')">
            <span class="btn-export-icon">📑</span>
            <span>Relatório PDF</span>
          </button>

          <div class="sync-box">
            <p class="sync-label">ESTADO DE SINCRONIZAÇÃO</p>
            <div class="sync-info">
              <span class="sync-check">✅</span>
              <span>Atualizado hoje, 09:42</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- FOOTER -->
    <footer class="ind-footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">🏛️ Portal de Transparência PRR</div>
          <p>Monitorização oficial dos Indicadores Comuns do Plano de Recuperação e Resiliência em Portugal. Garantindo total transparência e rigor.</p>
          <div class="footer-icons">
            <span>🔗</span>
            <span>✉️</span>
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
const periodoSelecionado = ref('s1-2024')

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
  { id: 3, icone: '🔬', nome: 'Investimento em I&D', valor: '€840M' },
])

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
</script>

<style scoped>
* { box-sizing: border-box; }

.indicadores-container {
  margin: -2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f5;
  min-height: 100vh;
}

/* LAYOUT PRINCIPAL */
.main-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 30px;
  padding: 30px 4%;
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
  margin-bottom: 8px;
}

.header-left p {
  font-size: 0.88rem;
  color: #666;
  max-width: 520px;
  line-height: 1.6;
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
  transition: background 0.2s;
}

.btn-metodologia:hover { background: #7a1614; }

/* FILTROS */
.filtros-row {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
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
  min-width: 200px;
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
  margin-bottom: 20px;
}

.section-bar {
  width: 4px;
  height: 22px;
  background: #d4af37;
  border-radius: 2px;
  flex-shrink: 0;
}

.section-header h2 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #931b18;
  margin: 0;
}

/* CARDS */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #e8e8e8;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.indicador-card {
  background: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  background: #931b18;
  color: white;
  border: none;
  padding: 9px 0;
  border-radius: 5px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  text-align: center;
  transition: background 0.2s;
}

.btn-saber:hover { background: #7a1614; }

/* OUTROS INDICADORES */
.outros-lista {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.outro-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: white;
}

.outro-item:last-child { border-bottom: none; }

.outro-esq {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.outro-icone { font-size: 1.1rem; }

.outro-nome {
  font-size: 0.88rem;
  color: #333;
}

.outro-valor {
  font-size: 0.88rem;
  font-weight: 700;
  color: #d4af37;
  min-width: 140px;
  text-align: center;
}

.btn-exportar-outro {
  background: transparent;
  border: 1px solid #931b18;
  color: #931b18;
  padding: 6px 14px;
  border-radius: 5px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-exportar-outro:hover {
  background: #931b18;
  color: white;
}

/* COLUNA DIREITA */
.col-direita {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.exportar-box {
  background: white;
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 20px;
}

.exportar-header {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.export-icone { font-size: 1.4rem; color: #931b18; }

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
  transition: opacity 0.2s;
}

.btn-export:hover { opacity: 0.85; }

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

.btn-export-icon { font-size: 1rem; }

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

.sync-check { font-size: 1rem; }

/* FOOTER */
.ind-footer {
  background: #931b18;
  color: white;
  padding: 40px 5% 20px;
  margin-top: 20px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 30px;
}

.footer-logo {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.footer-brand p {
  font-size: 0.82rem;
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 15px;
}

.footer-icons {
  display: flex;
  gap: 12px;
  font-size: 1.2rem;
  cursor: pointer;
}

.footer-col-titulo {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  opacity: 0.6;
  margin-bottom: 12px;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-col ul li {
  font-size: 0.82rem;
  opacity: 0.85;
  cursor: pointer;
  transition: opacity 0.2s;
}

.footer-col ul li:hover { opacity: 1; }

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.2);
  font-size: 0.75rem;
  opacity: 0.7;
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