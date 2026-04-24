<template>
  <div class="portal-container">

    <div v-if="showExportModal" class="modal-overlay" @click.self="showExportModal = false">
      <div class="export-card">
        <button class="close-btn" @click="showExportModal = false">✕</button>
        <div class="export-header">
          <span class="main-download-icon">📥</span>
          <h2>Exportação Rápida</h2>
          <p>Descarregue o conjunto de dados da vista atual para análise offline</p>
        </div>
        <div class="export-options">
          <button class="export-item" @click="simularDownload('csv')">
            <span>Exportar como CSV</span>
            <span class="ext">.csv</span>
          </button>
          <button class="export-item" @click="simularDownload('json')">
            <span>Feed de Dados (JSON)</span>
            <span class="ext">.json</span>
          </button>
          <button class="export-item" @click="simularDownload('pdf')">
            <span>Sumário em PDF</span>
            <span class="ext">.pdf</span>
          </button>
        </div>
      </div>
    </div>

    <section class="hero-ue">
      <div class="overlay">
        <h1>Mecanismo de Recuperação e Resiliência da EU</h1>
        <p>Monitorize o impacto real dos fundos europeus na sua região e quotidiano.</p>
        
        <div class="button-group-main">
          <button class="btn-outline">Explorar por País</button>
          <button class="btn-yellow">Saber Mais</button>
          <button class="btn-outline">Ver Pilares</button>
        </div>

        <div class="search-bar-container">
          <div class="search-input">
            <span>🔍</span>
            <input type="text" placeholder="Pesquisar setor, meta ou indicador">
          </div>
          <select class="country-select">
            <option>País: Portugal ▾</option>
          </select>
          <button class="btn-compare">Comparar Países</button>
        </div>
      </div>
    </section>

    <section class="intro">
      <h2>O que é o PRR?</h2>
      <p class="intro-text">
        O PRR - Plano de Recuperação e Resiliência é o programa nacional financiado pelo 
        Mecanismo de Recuperação e Resiliência da União Europeia, destinado a apoiar a 
        recuperação económica e a construção de um país mais resiliente.
      </p>
      
      <div class="cards-grid">
        <div class="info-card">
          <div class="card-header">
            <div class="icon-circle">€</div>
            <div class="download-container" @click="showExportModal = true">
              <span class="download-icon">📥</span>
              <span class="download-text">CSV | JSON</span>
            </div>
          </div>
          <h3>Investimento</h3>
          <p>Gestão e execução de pagamentos e desembolsos efetuados pela EU a Portugal.</p>
          <p class="card-highlight">Montante Total: <span>€16,6 Bilhões</span></p>
        </div>

        <div class="info-card">
          <div class="card-header">
            <div class="icon-circle">🎯</div>
            <div class="download-container" @click="showExportModal = true">
              <span class="download-icon">📥</span>
              <span class="download-text">CSV | JSON</span>
            </div>
          </div>
          <h3>Objetivos</h3>
          <p>Acompanhamento de Marcos e Metas: objetivos específicos com prazos e estados de execução detalhados.</p>
          <p class="card-highlight">Marcos Totais: <span>341 objetivos</span></p>
        </div>

        <div class="info-card">
          <div class="card-header">
            <div class="icon-circle">📈</div>
            <div class="download-container" @click="showExportModal = true">
              <span class="download-icon">📥</span>
              <span class="download-text">CSV | JSON</span>
            </div>
          </div>
          <h3>Crescimento</h3>
          <p>Indicadores Comuns: Monitorização semestral de 14 indicadores de reporte obrigatório.</p>
          <p class="card-highlight">Prazo Final: <span>2026</span></p>
        </div>
      </div>
    </section>

    <section class="impacto">
      <div class="impacto-imagens">
        <div class="img-card img-topo">
          <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400" alt="Educação Digital" />
          <span class="img-label">Educação Digital</span>
        </div>
        <div class="img-card img-baixo">
          <img src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400" alt="Saúde Moderna" />
          <span class="img-label">Saúde Moderna</span>
        </div>
      </div>

      <div class="impacto-conteudo">
        <h2>Resultados e Impacto no Quotidiano</h2>
        <div class="impacto-item">
          <div class="impacto-icone">🎓</div>
          <div>
            <p class="impacto-titulo">Educação:</p>
            <p class="impacto-desc">Modernização digital de escolas e entrega de equipamentos;</p>
          </div>
        </div>
        <div class="impacto-item">
          <div class="impacto-icone">🏠</div>
          <div>
            <p class="impacto-titulo">Habitação:</p>
            <p class="impacto-desc">Renovação de infraestruturas e eficiência energética;</p>
          </div>
        </div>
        <div class="impacto-item">
          <div class="impacto-icone">🤍</div>
          <div>
            <p class="impacto-titulo">Saúde:</p>
            <p class="impacto-desc">Reforço do Serviço Nacional de Saúde e novos centros digitais.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="pilares">
      <div class="pilares-header">
        <h2>Pilares do PRR</h2>
        <p>Consulte o investimento, acompanhe as metas e veja o impacto direto destes 6 pilares no seu quotidiano.</p>
      </div>

      <div class="pilares-grid">
        <div class="pilar-card">
          <div class="pilar-image">
            <img src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600" alt="Clima">
            <div class="pilar-icon-float">🌿</div>
          </div>
          <div class="pilar-info">
            <div class="pilar-top">
              <h3>Transição Climática</h3>
              <div class="pilar-download" @click="showExportModal = true">
                <span class="dl-icon">📥</span>
                <span class="dl-text">CSV | JSON</span>
              </div>
            </div>
            <div class="pilar-details">
              <p><strong>Meta:</strong> Descarbonização e Eficiência;</p>
              <p><strong>Investimento:</strong> €16,6 Bilhões;</p>
              <p><strong>Impacto:</strong> 250 mil edifícios renovados.</p>
            </div>
          </div>
        </div>

        <div class="pilar-card">
          <div class="pilar-image">
            <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600" alt="Digital">
            <div class="pilar-icon-float">💻</div>
          </div>
          <div class="pilar-info">
            <div class="pilar-top">
              <h3>Transição Digital</h3>
              <div class="pilar-download" @click="showExportModal = true">
                <span class="dl-icon">📥</span>
                <span class="dl-text">CSV | JSON</span>
              </div>
            </div>
            <div class="pilar-details">
              <p><strong>Meta:</strong> Digitalização da Economia;</p>
              <p><strong>Investimento:</strong> €5,2 Bilhões;</p>
              <p><strong>Impacto:</strong> 100% dos serviços públicos online.</p>
            </div>
          </div>
        </div>

        <div class="pilar-card">
          <div class="pilar-image">
            <img src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=600" alt="Infra">
            <div class="pilar-icon-float">🏢</div>
          </div>
          <div class="pilar-info">
            <div class="pilar-top">
              <h3>Infraestruturas</h3>
              <div class="pilar-download" @click="showExportModal = true">
                <span class="dl-icon">📥</span>
                <span class="dl-text">CSV | JSON</span>
              </div>
            </div>
            <div class="pilar-details">
              <p><strong>Meta:</strong> Modernização Ferroviária e Logística;</p>
              <p><strong>Investimento:</strong> €4,8 Bilhões alocados;</p>
              <p><strong>Impacto:</strong> Transportes 20% mais rápidos.</p>
            </div>
          </div>
        </div>

        <div class="pilar-card">
          <div class="pilar-image">
            <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600" alt="Educação">
            <div class="pilar-icon-float">🎓</div>
          </div>
          <div class="pilar-info">
            <div class="pilar-top">
              <h3>Educação e Formação</h3>
              <div class="pilar-download" @click="showExportModal = true">
                <span class="dl-icon">📥</span>
                <span class="dl-text">CSV | JSON</span>
              </div>
            </div>
            <div class="pilar-details">
              <p><strong>Meta:</strong> Qualificação Geracional;</p>
              <p><strong>Investimento:</strong> €1,2 Bilhões;</p>
              <p><strong>Impacto:</strong> 600 mil portáteis entregues a alunos.</p>
            </div>
          </div>
        </div>

        <div class="pilar-card">
          <div class="pilar-image">
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600" alt="Coesão">
            <div class="pilar-icon-float">👥</div>
          </div>
          <div class="pilar-info">
            <div class="pilar-top">
              <h3>Coesão Social</h3>
              <div class="pilar-download" @click="showExportModal = true">
                <span class="dl-icon">📥</span>
                <span class="dl-text">CSV | JSON</span>
              </div>
            </div>
            <div class="pilar-details">
              <p><strong>Meta:</strong> Habitação Pública e Inclusão;</p>
              <p><strong>Investimento:</strong> €2,5 Milhões aplicados;</p>
              <p><strong>Impacto:</strong> 15.000 novas casas acessíveis.</p>
            </div>
          </div>
        </div>

        <div class="pilar-card">
          <div class="pilar-image">
            <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600" alt="Saúde">
            <div class="pilar-icon-float">❤️</div>
          </div>
          <div class="pilar-info">
            <div class="pilar-top">
              <h3>Saúde</h3>
              <div class="pilar-download" @click="showExportModal = true">
                <span class="dl-icon">📥</span>
                <span class="dl-text">CSV | JSON</span>
              </div>
            </div>
            <div class="pilar-details">
              <p><strong>Meta:</strong> Digitalização e Reforço do SNS;</p>
              <p><strong>Investimento:</strong> €1,4 Milhões em tecnologia;</p>
              <p><strong>Impacto:</strong> 100 Centros de Saúde renovados.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'
const showExportModal = ref(false)

function simularDownload(tipo) {
  const conteudos = {
    csv: 'id,nome,valor\n1,Investimento,16600000000\n2,Objetivos,341\n3,Crescimento,2026',
    json: JSON.stringify([
      { id: 1, nome: 'Investimento', valor: 16600000000 },
      { id: 2, nome: 'Objetivos', valor: 341 },
      { id: 3, nome: 'Crescimento', prazo: 2026 }
    ], null, 2),
    pdf: 'Sumário PRR - Simulação de exportação PDF'
  }

  const mimeTypes = {
    csv: 'text/csv',
    json: 'application/json',
    pdf: 'text/plain' // simulação simples
  }

  const blob = new Blob([conteudos[tipo]], { type: mimeTypes[tipo] })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `prr-export.${tipo}`
  a.click()
  URL.revokeObjectURL(url)

  showExportModal.value = false
}
</script>

<style scoped>
.portal-container {
  margin: -2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.hero-ue {
  background-image: url('https://european-union.europa.eu/sites/default/files/styles/embed_large/public/2021-05/flags_ue.jpg');
  background-size: cover;
  background-position: center;
  min-height: 85vh;
  position: relative;
}

.overlay {
  background-color: rgba(147, 27, 24, 0.88);
  min-height: 85vh;
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
  margin-bottom: 10px;
  color: white !important;
}

.overlay p {
  font-size: 1.2rem;
  margin-bottom: 40px;
}

.button-group-main {
  margin-bottom: 100px;
}

.btn-yellow, .btn-primary {
  background-color: #FFD700 !important;
  color: rgba(147, 27, 24, 0.88) !important;
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
  color: rgba(122, 22, 20, 1) !important;
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
  transition: background-color 0.3s ease;
}

.btn-outline:hover, .btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.3) !important;
}

.search-bar-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 50px auto 0;
  padding: 0 5%;
  box-sizing: border-box;
}

.search-input {
  background: #1a1a1a;
  border: 1px solid #333;
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  width: 300px;
}

.search-input input {
  background: transparent;
  border: none;
  color: #888;
  margin-left: 10px;
  outline: none;
  width: 100%;
  caret-color: transparent;
  position: relative;
}

.search-input input:focus {
  animation: piscar-cursor 0.5s step-end infinite;
  caret-color: white;
}

@keyframes piscar-cursor {
  0%, 100% { caret-color: white; }
  50% { caret-color: transparent; }
}

.country-select {
  background: #1a1a1a;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.btn-compare {
  background-color: #d49600 !important;
  color: white !important;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
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
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
  top: 15px;
  right: 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.6rem;
  cursor: pointer;
  opacity: 0.8;
}

.close-btn:hover { opacity: 1; }

.main-download-icon { font-size: 3.5rem; display: block; margin-bottom: 10px; }
.export-header h2 { font-size: 1.8rem; margin-bottom: 8px; }
.export-header p { font-size: 0.95rem; margin-bottom: 30px; opacity: 0.9; }

.export-options { display: flex; flex-direction: column; gap: 12px; }

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

.export-item:hover { background: rgba(255, 255, 255, 0.2); }
.export-item .ext { opacity: 0.5; font-family: monospace; font-size: 0.85rem; }

.impacto {
  background-color: #fff;
  padding: 80px 5%;
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
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.img-topo {
  width: 55%;
  height: 190px;
  top: 0;
  left: 0;
  z-index: 2;
}

.img-baixo {
  width: 62%;
  height: 210px;
  bottom: 0;
  right: 0;
  z-index: 1;
}

.img-label {
  position: absolute;
  bottom: 10px;
  left: 12px;
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
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.impacto-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: #fdf2f2;
  border-radius: 10px;
  padding: 25px 16px;
  margin-bottom: 10px;
}

.impacto-icone {
  font-size: 1.2rem;
  background: white;
  border-radius: 50%;
  width: 38px;
  height: 38px;
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
  background-color: #f9f9f9;
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
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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
  bottom: -20px;
  left: 20px;
  background: #931b18;
  width: 45px;
  height: 45px;
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

.pilar-download span {
  font-size: 2rem;
}

.pilar-download small {
  font-size: 0.6rem;
  font-weight: 800;
  margin-top: -5px;
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
</style>