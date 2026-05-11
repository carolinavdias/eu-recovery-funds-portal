<template>
  <div class="nf-container">
    <div class="nf-bg-deco">
      <div class="bg-circle b1"></div>
      <div class="bg-circle b2"></div>
      <div class="bg-circle b3"></div>
    </div>

    <div class="nf-content" :class="{ 'animate-in': visible }">
      <div class="nf-numero">
        <span class="num-4 left">4</span>
        <div class="num-0">
          <div class="globo">🌍</div>
        </div>
        <span class="num-4 right">4</span>
      </div>

      <div class="nf-badge">⚠️ Página não encontrada</div>

      <h1>Ups! Esta página perdeu-se no mapa.</h1>
      <p>A página que está à procura pode ter sido movida, removida ou simplesmente nunca existiu. Vamos ajudá-lo a voltar ao caminho certo.</p>

      <div class="nf-actions">
        <RouterLink to="/" class="btn-primario">🏠 Voltar ao Dashboard</RouterLink>
        <RouterLink to="/paises" class="btn-outline">🌍 Explorar Países</RouterLink>
      </div>

      <div class="nf-sugestoes">
        <div class="sug-titulo">Talvez procures por:</div>
        <div class="sug-grid">
          <RouterLink to="/marcos" class="sug-card">
            <span class="sug-icon">🎯</span>
            <span class="sug-nome">Marcos e Metas</span>
            <span class="sug-arrow">→</span>
          </RouterLink>
          <RouterLink to="/indicadores" class="sug-card">
            <span class="sug-icon">📊</span>
            <span class="sug-nome">Indicadores Comuns</span>
            <span class="sug-arrow">→</span>
          </RouterLink>
          <RouterLink to="/desembolsos" class="sug-card">
            <span class="sug-icon">💶</span>
            <span class="sug-nome">Desembolsos</span>
            <span class="sug-arrow">→</span>
          </RouterLink>
          <RouterLink to="/paises/comparar" class="sug-card">
            <span class="sug-icon">⚖️</span>
            <span class="sug-nome">Comparar Países</span>
            <span class="sug-arrow">→</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)

onMounted(() => {
  setTimeout(() => { visible.value = true }, 100)
})
</script>

<style scoped>
.nf-container {
  margin: -2rem;
  min-height: 100vh;
  background: linear-gradient(180deg, #fef9f0 0%, #f5f5f7 100%);
  padding: 60px 10%;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
}

.nf-bg-deco { position: absolute; inset: 0; pointer-events: none; }
.bg-circle { position: absolute; border-radius: 50%; }
.b1 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(147,27,24,0.08) 0%, transparent 70%); top: -150px; left: -100px; animation: float-slow 12s ease infinite; }
.b2 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%); bottom: -50px; right: -50px; animation: float-slow 15s ease infinite reverse; }
.b3 { width: 200px; height: 200px; background: radial-gradient(circle, rgba(46,107,191,0.08) 0%, transparent 70%); top: 40%; right: 20%; animation: float-slow 10s ease infinite; }
@keyframes float-slow { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-20px); } }

.nf-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}
.nf-content.animate-in { opacity: 1; transform: translateY(0); }

.nf-numero {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}
.num-4 {
  font-size: 9rem;
  font-weight: 900;
  background: linear-gradient(135deg, #931b18 0%, #d4af37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  animation: number-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.num-4.left { animation-delay: 0.2s; }
.num-4.right { animation-delay: 0.4s; transform: scaleX(-1); }
@keyframes number-pop {
  from { opacity: 0; transform: scale(0.5) rotate(-10deg); }
  to { opacity: 1; transform: scale(1); }
}
.num-4.right { transform: scaleX(-1); }
.num-4.right { animation: number-pop-right 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both; }
@keyframes number-pop-right {
  from { opacity: 0; transform: scale(0.5) rotate(10deg); }
  to { opacity: 1; transform: scale(1); }
}

.num-0 {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 12px solid;
  border-image: linear-gradient(135deg, #931b18, #d4af37) 1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 40px rgba(147, 27, 24, 0.15);
  animation: number-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
}
.globo {
  font-size: 4.5rem;
  animation: spin-globo 8s linear infinite;
  display: inline-block;
}
@keyframes spin-globo { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.nf-badge {
  display: inline-block;
  background: rgba(147, 27, 24, 0.1);
  border: 1px solid rgba(147, 27, 24, 0.3);
  color: #931b18;
  padding: 7px 18px;
  border-radius: 99px;
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 18px;
}

.nf-content h1 {
  font-size: 2.4rem;
  font-weight: 900;
  color: #1a1a1a;
  margin-bottom: 14px;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.nf-content p {
  font-size: 1rem;
  color: #666;
  max-width: 580px;
  margin: 0 auto 36px;
  line-height: 1.7;
}

.nf-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-bottom: 50px;
  flex-wrap: wrap;
}
.btn-primario {
  background: linear-gradient(135deg, #6b1210, #931b18);
  color: white;
  text-decoration: none;
  padding: 15px 32px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.95rem;
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(147, 27, 24, 0.25);
}
.btn-primario:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(147, 27, 24, 0.4); }
.btn-outline {
  background: white;
  color: #333;
  text-decoration: none;
  padding: 15px 32px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
}
.btn-outline:hover { border-color: #931b18; color: #931b18; transform: translateY(-3px); }

.nf-sugestoes {
  max-width: 700px;
  margin: 0 auto;
}
.sug-titulo {
  font-size: 0.85rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 18px;
}

.sug-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}
.sug-card {
  background: white;
  border: 1.5px solid #f0f0f0;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #333;
  font-weight: 700;
  font-size: 0.92rem;
  transition: all 0.25s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}
.sug-card:hover {
  border-color: #931b18;
  color: #931b18;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(147, 27, 24, 0.12);
}
.sug-card:hover .sug-arrow { transform: translateX(4px); color: #931b18; }
.sug-icon { font-size: 1.4rem; }
.sug-nome { flex: 1; text-align: left; }
.sug-arrow { color: #ccc; font-weight: 700; transition: all 0.25s; }

@media (max-width: 600px) {
  .num-4 { font-size: 6rem; }
  .num-0 { width: 100px; height: 100px; }
  .globo { font-size: 3rem; }
  .nf-content h1 { font-size: 1.6rem; }
}
</style>