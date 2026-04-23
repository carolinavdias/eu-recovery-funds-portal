<template>
  <div class="portal-container">
    <section class="hero">
      <h1>Mecanismo de Recuperação e Resiliência da EU</h1>
      <p>Monitorize o impacto real dos fundos europeus na sua região e quotidiano.</p>
      <div class="button-group">
        <button class="btn-secondary">Explorar por País</button>
        <button class="btn-primary">Saber mais</button>
        <button class="btn-secondary">Ver Países</button>
      </div>
    </section>

    <section class="intro">
      <h2>O que é o PRR?</h2>
      <p>O PRR - Plano de Recuperação e Resiliência é o programa nacional financiado pelo Mecanismo
       de Recuperação e Resiliência da União Europeia, destinado a apoiar a recuperação económica e 
       a construção de um país mais resiliente.</p>
      
      <div class="cards-grid">
        <div class="info-card">
          <div class="icon">€</div>
          <h3>Investimento</h3>
          <p>Montante Total: €16,6 Bilhões</p>
        </div>
        <div class="info-card">
          <div class="icon">🎯</div>
          <h3>Objetivos</h3>
          <p>Marcos Totais: 341 Objetivos</p>
        </div>
        <div class="info-card">
          <div class="icon">📈</div>
          <h3>Crescimento</h3>
          <p>Prazo Final: 2026</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.portal-container {
  margin: -2rem; /* Isto anula o padding do layout para o vermelho encostar nos cantos */
}

.hero {
  background-color: #931b18;
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.hero h1 {
  color: white !important; /* Força o branco sobre o fundo vermelho */
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.button-group {
  margin-top: 2rem;
}

.btn-primary {
  background-color: #d4af37;
  border: none;
  padding: 12px 24px;
  font-weight: bold;
  cursor: pointer;
  margin: 0 10px;
}

.btn-secondary {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 12px 24px;
  cursor: pointer;
}

.intro {
  padding: 40px;
  text-align: center;
  background-color: white;
}

.cards-grid {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  gap: 20px;
}

.info-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  flex: 1;
}

.info-card h3 {
  color: #931b18 !important;
}
</style>