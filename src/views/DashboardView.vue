<template>
  <div class="portal-container">

    <!-- MODAL DE EXPORTAÇÃO -->
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
          <RouterLink to="/paises"><button class="btn-outline">Explorar por País</button></RouterLink>
          <a href="#sobre"><button class="btn-yellow">Saber Mais</button></a>
          <a href="#pilares"><button class="btn-outline">Ver Pilares</button></a>
        </div>
      </div>
    </section>

    <section id="sobre" class="intro">
      <h2>O que é o PRR?</h2>
      <p class="intro-text">
        O PRR - Plano de Recuperação e Resiliência é o programa nacional financiado pelo 
        Mecanismo de Recuperação e Resiliência da União Europeia da União Europeia, destinado a apoiar a 
        recuperação económica e a construção de um país mais resiliente.
      </p>
      
      <div class="cards-grid">
        <div class="info-card">
          <div class="card-header">
            <div class="icon-circle">€</div>
            <div class="download-container" @click="prepararExportacao('Investimento', 'Gestão e execução de pagamentos e desembolsos efetuados pela EU a Portugal.', '€16,6 Bilhões')">
              <span class="download-icon">📥</span>
              <span class="download-text">
                <small @click="exportarConteudo('Investimento', 'Gestão e execução de pagamentos e desembolsos efetuados pela EU a Portugal.', '€16,6 Bilhões', 'csv')">CSV</small> | 
                <small @click="exportarConteudo('Investimento', 'Gestão e execução de pagamentos e desembolsos efetuados pela EU a Portugal.', '€16,6 Bilhões', 'json')">JSON</small> |
                <small @click="exportarConteudo('Investimento', 'Gestão e execução de pagamentos e desembolsos efetuados pela EU a Portugal.', '€16,6 Bilhões', 'pdf')">PDF</small>
              </span>
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
          <img src="https://ctrlplay.com.br/wp-content/uploads/2020/04/ctrlplay_ctrlplay_image_223.jpeg" alt="Educação Digital" />
          <span class="img-label">Educação Digital</span>
        </div>
        <div class="img-card img-baixo">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRexNOIYL7Ap9dVYQbKcrkmDCkP47AoPYYg6g&s" alt="Saúde Moderna" />
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

    <section id="pilares" class="pilares">
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
            <img src="https://cdn1-www.bureauveritas.pt/sites/g/files/zypfnx751/files/styles/teaser_landing_1_desktop/public/2020-02/Infraestru.Transporte.jpg?h=29234840&itok=BU5mUpyM" alt="Infra">
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
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5h3ACvYClsskA2hBgn1uNB03KXjqElVjkLZ7fl6x6buSGyjl6xaWrWUE6df9NZe_XchUw51oL2kx7nN82rAsFGlbVoHP9C05p1DVY6buhXzdIy7vp1lFETthEY6LiWl5jJ9apjkqF7SwI/s1600/043012-national-black-male-teacher.jpg" alt="Educação">
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
            <img src="https://www.betha.com.br/blog/wp-content/uploads/2021/07/blog-25.jpg" alt="Saúde">
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

    <section class="dados">
      <div class="dados-topo">
        <button class="btn-exportar-tudo" @click="showExportModal = true">Exportar Tudo</button>
      </div>

      <h2>Dados e Estatísticas</h2>
      <p class="dados-sub">Explore os dados: do investimento europeu ao impacto direto na sua região.</p>

      <div class="barras-card">
        <h3>Áreas de Investimento Prioritárias</h3>
        <div class="barras-grid">
          <div class="barra-item">
            <div class="barra-label-row">
              <span>Transição Climática</span>
              <span class="barra-valor">37% — €277,5 Mil milhões</span>
            </div>
            <div class="barra-bg"><div class="barra-fill" style="width: 37%"></div><div class="barra-media"></div></div>
          </div>
          <div class="barra-item">
            <div class="barra-label-row">
              <span>Educação e Formação</span>
              <span class="barra-valor">12% — €90 Mil milhões</span>
            </div>
            <div class="barra-bg"><div class="barra-fill" style="width: 12%"></div><div class="barra-media"></div></div>
          </div>
          <div class="barra-item">
            <div class="barra-label-row">
              <span>Transição Digital</span>
              <span class="barra-valor">20% — €150 Mil milhões</span>
            </div>
            <div class="barra-bg"><div class="barra-fill" style="width: 20%"></div><div class="barra-media"></div></div>
          </div>
          <div class="barra-item">
            <div class="barra-label-row">
              <span>Saúde</span>
              <span class="barra-valor">8% — €60 Mil milhões</span>
            </div>
            <div class="barra-bg"><div class="barra-fill" style="width: 8%"></div><div class="barra-media"></div></div>
          </div>
          <div class="barra-item">
            <div class="barra-label-row">
              <span>Infraestruturas</span>
              <span class="barra-valor">18% — €135 Mil milhões</span>
            </div>
            <div class="barra-bg"><div class="barra-fill" style="width: 18%"></div><div class="barra-media"></div></div>
          </div>
          <div class="barra-item">
            <div class="barra-label-row">
              <span>Coesão Social</span>
              <span class="barra-valor">5% — €37,5 Mil milhões</span>
            </div>
            <div class="barra-bg"><div class="barra-fill" style="width: 5%"></div><div class="barra-media"></div></div>
          </div>
        </div>
        <p class="barras-nota">*As linhas a preto sobre as barras estatísticas correspondem à média da EU.</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icone">📈</div>
          <div class="stat-valor">€750</div>
          <div class="stat-label">Mil milhões</div>
          <div class="stat-desc">Investimento total da UE</div>
        </div>
        <div class="stat-card">
          <div class="stat-icone">👥</div>
          <div class="stat-valor">27</div>
          <div class="stat-label">Países</div>
          <div class="stat-desc">Estados-Membros beneficiários</div>
        </div>
        <div class="stat-card">
          <div class="stat-icone">🌿</div>
          <div class="stat-valor">37%</div>
          <div class="stat-label">Transição Verde</div>
          <div class="stat-desc">Mínimo de investimento</div>
        </div>
        <div class="stat-card">
          <div class="stat-icone">⚡</div>
          <div class="stat-valor">20%</div>
          <div class="stat-label">Transição Digital</div>
          <div class="stat-desc">Mínimo de investimento</div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>Sobre este Trabalho</h4>
          <p>Trabalho académico sobre o Plano de Recuperação e Resiliência (PRR) da União Europeia, explorando os seus objetivos, pilares e impacto económico.</p>
        </div>
        <div class="footer-col">
          <h4>Links Úteis</h4>
          <ul>
            <li><a href="#">Comissão Europeia</a></li>
            <li><a href="#">PRR Portugal</a></li>
            <li><a href="#">Next Generation EU</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Informação</h4>
          <ul class="footer-info">
            <li><span>📍</span> União Europeia</li>
            <li><span>✉️</span> info@prr-europa.eu</li>
            <li><span>📞</span> +351 XXX XXX XXX</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <hr class="footer-divider" />
        <p>© 2026 Universidade do Minho - PRR. Todos os direitos reservados.</p>
        <p class="footer-sub">Este é um trabalho académico desenvolvido para fins educacionais.</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const showExportModal = ref(false)

// Esta variável vai guardar os dados do card que clicaste
const cardSelecionado = ref({
  titulo: '',
  descricao: '',
  valor: ''
})

// 1. Função para abrir o modal já com os dados do card certo
function prepararExportacao(titulo, descricao, valor) {
  cardSelecionado.value = { titulo, descricao, valor };
  showExportModal.value = true;
}

// 2. Função que gera o ficheiro usando os dados guardados
function executarDownload(formato) {
  const { titulo, descricao, valor } = cardSelecionado.value;
  const dataGeracao = new Date().toLocaleDateString('pt-PT');
  let conteudo = '';
  let mimeType = '';

  if (formato === 'csv') {
    conteudo = `Indicador;Descricao;Valor;Data\n${titulo};"${descricao}";"${valor}";${dataGeracao}`;
    mimeType = 'text/csv';
  } 
  else if (formato === 'json') {
    conteudo = JSON.stringify({ ...cardSelecionado.value, data: dataGeracao }, null, 2);
    mimeType = 'application/json';
  } 
  else if (formato === 'pdf') {
    gerarPDF(titulo, descricao, valor, dataGeracao);
    showExportModal.value = false;
    return;
  }

  const blob = new Blob([conteudo], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PRR_${titulo.replace(/\s+/g, '_')}.${formato}`;
  a.click();
  URL.revokeObjectURL(url);
  showExportModal.value = false;
}

// Função para o Sumário PDF
function gerarPDF(t, d, v, data) {
  const win = window.open('', '', 'width=800,height=600');
  win.document.write(`
    <html>
      <body style="font-family:sans-serif; padding:40px;">
        <h1 style="color:#931b18;">Relatório PRR: ${t}</h1>
        <p><strong>Descrição:</strong> ${d}</p>
        <p><strong>Estado Atual:</strong> ${v}</p>
        <hr>
        <small>Gerado em ${data} - Portal de Transparência</small>
      </body>
    </html>
  `);
  win.document.close();
  win.print();
}
</script>

<style scoped>
.portal-container {
  margin: -2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
  transform: translateY(-6px); /* ← adiciona */
  background: rgba(255,255,255,0.18); /* ← fundo ligeiramente mais claro */
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

.footer { 
  background-color: #7a1614; 
  color: white; 
  padding: 50px 8% 30px; 
}

.footer-grid { 
  display: grid; 
  grid-template-columns: 1.5fr 1fr 1fr; 
  gap: 60px; 
  margin-bottom: 30px; 
}

.footer-col h4 { 
  font-size: 1rem; 
  font-weight: 700; 
  margin-bottom: 15px; 
  color: white; 
}

.footer-col p { 
  font-size: 0.85rem; 
  opacity: 0.8; 
  line-height: 1.6; 
}

.footer-col ul { 
  list-style: none; 
  padding: 0; 
  margin: 0; 
}

.footer-col ul li { 
  margin-bottom: 10px; 
}

.footer-col ul li a { 
  color: rgba(255,255,255,0.8); 
  text-decoration: none; 
  font-size: 0.88rem; 
  transition: opacity 0.2s; 
}

.footer-col ul li a:hover { 
  opacity: 1; 
  color: white; 
}

.footer-info li { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  font-size: 0.88rem; 
  opacity: 0.85; 
}

.footer-divider { 
  border: none; 
  border-top: 1px solid rgba(255,255,255,0.5); 
  margin-bottom: 20px; 
}

.footer-bottom { 
  text-align: center; 
}

.footer-bottom p { 
  font-size: 0.82rem; 
  opacity: 0.75; 
  margin: 4px 0; 
}

.footer-sub { 
  opacity: 0.5 !important; 
  font-size: 0.75rem !important; 
}
</style>