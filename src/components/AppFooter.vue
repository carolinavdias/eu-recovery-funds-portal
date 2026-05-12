<template>
  <footer class="app-footer-global">
    <div class="footer-inner">

      <!-- COLUNA BRAND -->
      <div class="footer-brand">
        <RouterLink to="/" class="footer-logo-link">
          <span>🏛️</span>
          <span class="footer-logo-text">PORTAL <span class="footer-logo-accent">PRR</span></span>
        </RouterLink>
        <p class="footer-desc">
          Monitorização do Plano de Recuperação e Resiliência no âmbito do
          Mecanismo de Recuperação e Resiliência da União Europeia.
        </p>
        <p class="footer-academic">
          Trabalho académico desenvolvido para a UC de IPM · UMinho 2025/26
        </p>
      </div>

      <!-- COLUNA NAVEGAÇÃO -->
      <div class="footer-col">
        <p class="footer-col-titulo">Navegação</p>
        <ul>
          <li><RouterLink to="/">Dashboard</RouterLink></li>
          <li><RouterLink to="/marcos">Marcos e Metas</RouterLink></li>
          <li><RouterLink to="/indicadores">Indicadores Comuns</RouterLink></li>
          <li><RouterLink to="/desembolsos">Desembolsos</RouterLink></li>
          <li><RouterLink to="/paises">Países</RouterLink></li>
        </ul>
      </div>

      <!-- COLUNA LINKS EXTERNOS -->
      <div class="footer-col">
        <p class="footer-col-titulo">Fontes</p>
        <ul>
          <li>
            <a href="https://commission.europa.eu/index_pt" target="_blank" rel="noopener noreferrer">
              Comissão Europeia
            </a>
          </li>
          <li>
            <a href="https://recuperarportugal.gov.pt/" target="_blank" rel="noopener noreferrer">
              PRR Portugal
            </a>
          </li>
          <li>
            <a href="https://next-generation-eu.europa.eu/index_pt" target="_blank" rel="noopener noreferrer">
              Next Generation EU
            </a>
          </li>
          <li>
            <a href="https://recovery-and-resilience-scoreboard.ec.europa.eu/" target="_blank" rel="noopener noreferrer">
              EU Scoreboard
            </a>
          </li>
        </ul>
      </div>

    </div>

    <!-- LINHA INFERIOR -->
    <div class="footer-bottom">
      <hr class="footer-divider" />
      <div class="footer-bottom-inner">
        <span>© 2026 Portal PRR · Mecanismo de Recuperação e Resiliência da UE</span>
        <span class="footer-status">
          <span class="sync-dot"></span>
          Dados actualizados · IPM 2025/26
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Sem dependências externas — usa apenas RouterLink do Vue Router
</script>

<style scoped>
.app-footer-global {
  background-color: #0f172a;
  color: #cbd5e1;
  border-top: 3px solid #d4af37;
  padding: 3rem 2rem 0;
  font-size: 0.875rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 2rem;
}

/* BRAND */
.footer-logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  margin-bottom: 1rem;
}

.footer-logo-text {
  font-size: 1.1rem;
  font-weight: 800;
  color: white;
  letter-spacing: 1px;
}

.footer-logo-accent {
  color: #d4af37;
}

.footer-desc {
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  max-width: 340px;
}

.footer-academic {
  color: #64748b;
  font-size: 0.78rem;
  font-style: italic;
}

/* COLUNAS */
.footer-col-titulo {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #d4af37;
  margin-bottom: 1rem;
}

.footer-col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer-col ul li a,
.footer-col ul li a:visited {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-col ul li a:hover {
  color: #d4af37;
}

/* LINHA INFERIOR */
.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-divider {
  border: none;
  border-top: 1px solid #1e293b;
  margin-bottom: 1.25rem;
}

.footer-bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  color: #475569;
  font-size: 0.78rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.footer-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sync-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #22c55e;
  display: inline-block;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-bottom-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }
}
</style>