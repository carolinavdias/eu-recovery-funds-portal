<template>
  <div class="comparar-container">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-overlay">
        <div class="hero-content" :class="{ 'animate-in': heroVisible }">
          <div class="hero-badge">⚖️ Análise Comparativa</div>
          <h1>Comparar<br><span class="hero-accent">Países</span></h1>
          <p>Selecione dois países e explore uma análise detalhada lado a lado do seu desempenho no PRR.</p>
          <RouterLink to="/paises" class="btn-voltar">← Voltar aos Países</RouterLink>
        </div>
        <div class="hero-deco" :class="{ 'animate-in': heroVisible }">
          <div class="deco-circle c1"></div>
          <div class="deco-circle c2"></div>
          <div class="deco-circle c3"></div>
          <div class="deco-vs">VS</div>
        </div>
      </div>
    </section>

    <!-- SELETORES -->
    <section class="seletores-section">
      <div class="seletores-titulo">
        <h2>Escolhe os países a comparar</h2>
        <p>Clica num país para o seleccionar · Clica num seleccionado para remover</p>
      </div>

      <div class="selecionados-wrap">
        <div class="slot" :class="{ preenchido: paisA }" @click="paisA && (codigoA = '')">
          <template v-if="paisA">
            <img :src="paisA.imagem" class="slot-img" />
            <div class="slot-overlay azul-overlay"></div>
            <div class="slot-info">
              <span class="slot-num azul-num">A</span>
              <span class="slot-flag">{{ paisA.bandeira }}</span>
              <div class="slot-text">
                <span class="slot-nome">{{ paisA.nome }}</span>
                <span class="slot-cap">{{ paisA.capital }}</span>
              </div>
              <span class="slot-remove">✕</span>
            </div>
          </template>
          <div v-else class="slot-vazio azul-vazio">
            <span class="slot-num-vazio">A</span>
            <span>Escolha um país</span>
          </div>
        </div>

        <div class="vs-central">
          <div class="vs-ring" :class="{ ativo: paisA && paisB }">VS</div>
          <button v-if="paisA && paisB" class="vs-trocar" @click="trocarPaises">⇄ Trocar</button>
        </div>

        <div class="slot" :class="{ preenchido: paisB }" @click="paisB && (codigoB = '')">
          <template v-if="paisB">
            <img :src="paisB.imagem" class="slot-img" />
            <div class="slot-overlay vermelho-overlay"></div>
            <div class="slot-info">
              <span class="slot-num vermelho-num">B</span>
              <span class="slot-flag">{{ paisB.bandeira }}</span>
              <div class="slot-text">
                <span class="slot-nome">{{ paisB.nome }}</span>
                <span class="slot-cap">{{ paisB.capital }}</span>
              </div>
              <span class="slot-remove">✕</span>
            </div>
          </template>
          <div v-else class="slot-vazio vermelho-vazio">
            <span class="slot-num-vazio">B</span>
            <span>Escolha um país</span>
          </div>
        </div>
      </div>

      <div class="paises-picker">
        <div
          v-for="p in paises"
          :key="p.code"
          class="picker-card"
          :class="{ 'selected-a': codigoA === p.code, 'selected-b': codigoB === p.code }"
          @click="selecionarPais(p.code)"
        >
          <img :src="p.imagem" class="picker-img" />
          <div class="picker-overlay"></div>
          <div class="picker-badge azul-badge" v-if="codigoA === p.code">A</div>
          <div class="picker-badge vermelho-badge" v-if="codigoB === p.code">B</div>
          <div class="picker-info">
            <span class="picker-flag">{{ p.bandeira }}</span>
            <span class="picker-nome">{{ p.nome }}</span>
          </div>
          <div class="picker-progresso">
            <div class="pp-bg"><div class="pp-fill" :style="{ width: p.progresso + '%' }"></div></div>
            <span class="pp-val">{{ p.progresso }}%</span>
          </div>
        </div>
      </div>
    </section>

    <template v-if="paisA && paisB">
      <!-- PROGRESSO -->
      <section class="progresso-section">
        <div class="prog-wrap" :class="{ reveal: revealProgresso }">
          <div class="prog-pais-a">
            <span class="prog-flag">{{ paisA.bandeira }}</span>
            <span class="prog-nome">{{ paisA.nome }}</span>
            <span class="prog-val azul">{{ paisA.progresso }}%</span>
          </div>
          <div class="prog-track">
            <div class="prog-bar-a" :style="{ width: revealProgresso ? paisA.progresso + '%' : '0%' }"></div>
            <div class="prog-bar-b" :style="{ width: revealProgresso ? paisB.progresso + '%' : '0%' }"></div>
          </div>
          <div class="prog-pais-b">
            <span class="prog-val vermelho">{{ paisB.progresso }}%</span>
            <span class="prog-nome">{{ paisB.nome }}</span>
            <span class="prog-flag">{{ paisB.bandeira }}</span>
          </div>
        </div>
      </section>

      <!-- SCORECARD -->
      <section class="scorecard-section">
        <div class="sc-titulo" :class="{ reveal: revealScore }">
          <h2>Comparação de Métricas</h2>
          <p>Sistema de pontuação · cada métrica vencida vale 1 ponto</p>
        </div>

        <div class="sc-legenda" :class="{ reveal: revealScore }">
          <div class="leg-item">
            <span class="leg-cor azul-cor"></span>
            <span>Vence País A</span>
          </div>
          <div class="leg-item">
            <span class="leg-cor vermelho-cor"></span>
            <span>Vence País B</span>
          </div>
          <div class="leg-item">
            <span class="leg-empate">=</span>
            <span>Empate</span>
          </div>
          <div class="leg-item">
            <span class="leg-bar"><span class="leg-bar-fill"></span></span>
            <span>Barra proporcional ao valor</span>
          </div>
        </div>

        <div class="scorecard-grid" :class="{ reveal: revealScore }">
          <div class="sc-col-header azul-bg">
            <span class="sch-flag">{{ paisA.bandeira }}</span>
            <span class="sch-nome">{{ paisA.nome }}</span>
            <span class="sch-score">{{ scoreA }} pts</span>
          </div>
          <div class="sc-col-center-header">Métrica</div>
          <div class="sc-col-header vermelho-bg">
            <span class="sch-flag">{{ paisB.bandeira }}</span>
            <span class="sch-nome">{{ paisB.nome }}</span>
            <span class="sch-score">{{ scoreB }} pts</span>
          </div>
          <template v-for="(m, i) in metricas" :key="i">
            <div class="sc-val-cell" :class="{ vence: m.venceA === true }">
              <div class="scv-top">
                <span v-if="m.venceA === true" class="scv-check">✓</span>
                <span class="scv-num">{{ m.valA }}</span>
              </div>
              <div v-if="revealScore" class="scv-bar-wrap">
                <div class="scv-bar azul-bar" :style="{ width: barWidth(m.numA, m.numB) + '%' }"></div>
              </div>
            </div>
            <div class="sc-metric-label">
              <div class="sml-text">{{ m.label }}</div>
              <div class="sml-status">
                <span v-if="m.empate" class="status-empate">=</span>
                <span v-else-if="m.venceA === true" class="status-dot azul-dot"></span>
                <span v-else-if="m.venceA === false" class="status-dot vermelho-dot"></span>
              </div>
            </div>
            <div class="sc-val-cell right" :class="{ vence: m.venceA === false }">
              <div class="scv-top right">
                <span class="scv-num">{{ m.valB }}</span>
                <span v-if="m.venceA === false" class="scv-check">✓</span>
              </div>
              <div v-if="revealScore" class="scv-bar-wrap right">
                <div class="scv-bar vermelho-bar" :style="{ width: barWidth(m.numB, m.numA) + '%' }"></div>
              </div>
            </div>
          </template>
        </div>
      </section>

      <!-- VENCEDOR -->
      <section class="vencedor-section">
        <transition name="vencedor-pop">
          <div v-if="revealVencedor && vencedor" class="vencedor-card" :class="vencedor.code === codigoA ? 'v-azul' : 'v-vermelho'">
            <div class="v-trofeu">🏆</div>
            <div class="v-content">
              <div class="v-label">MELHOR DESEMPENHO GERAL</div>
              <div class="v-nome">{{ vencedor.bandeira }} {{ vencedor.nome }}</div>
              <div class="v-stats">
                <span>{{ vencedor.progresso }}% progresso</span>
                <span>·</span>
                <span>{{ taxaConclusao(vencedor) }}% taxa de conclusão</span>
                <span>·</span>
                <span>{{ scoreVencedor }} pontos</span>
              </div>
            </div>
            <div class="v-stars">
              <span v-for="i in 5" :key="i" class="v-star" :style="{ animationDelay: (i * 0.1) + 's' }">⭐</span>
            </div>
          </div>
        </transition>
      </section>

      <!-- MARCOS -->
      <section class="marcos-section">
        <div class="marcos-titulo" :class="{ reveal: revealMarcos }"><h2>🎯 Marcos e Metas</h2></div>
        <div class="marcos-dual" :class="{ reveal: revealMarcos }">
          <div class="marcos-col">
            <div class="mc-header azul-bg">{{ paisA.bandeira }} {{ paisA.nome }}<span class="mc-count">{{ marcosA.length }}</span></div>
            <div v-if="!marcosA.length" class="mc-empty">Sem marcos registados</div>
            <div v-for="(m, i) in marcosA" :key="m.id" class="marco-item" :style="{ animationDelay: (i * 0.07) + 's' }">
              <div class="mi-top">
                <span class="mi-setor">{{ m.setorLabel }}</span>
                <span :class="['mi-estado', m.estado]">{{ estadoLabel(m.estado) }}</span>
              </div>
              <div class="mi-titulo">{{ m.titulo }}</div>
              <div class="mi-prog">
                <div class="mi-bg"><div class="mi-fill azul-fill" :style="{ width: m.progresso + '%' }"></div></div>
                <span>{{ m.progresso }}%</span>
              </div>
            </div>
          </div>
          <div class="marcos-col">
            <div class="mc-header vermelho-bg">{{ paisB.bandeira }} {{ paisB.nome }}<span class="mc-count">{{ marcosB.length }}</span></div>
            <div v-if="!marcosB.length" class="mc-empty">Sem marcos registados</div>
            <div v-for="(m, i) in marcosB" :key="m.id" class="marco-item" :style="{ animationDelay: (i * 0.07) + 's' }">
              <div class="mi-top">
                <span class="mi-setor">{{ m.setorLabel }}</span>
                <span :class="['mi-estado', m.estado]">{{ estadoLabel(m.estado) }}</span>
              </div>
              <div class="mi-titulo">{{ m.titulo }}</div>
              <div class="mi-prog">
                <div class="mi-bg"><div class="mi-fill vermelho-fill" :style="{ width: m.progresso + '%' }"></div></div>
                <span>{{ m.progresso }}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ACÇÕES -->
      <section class="acoes-section">
        <RouterLink :to="'/paises/' + paisA.code" class="btn-acao azul">{{ paisA.bandeira }} Explorar {{ paisA.nome }}</RouterLink>
        <RouterLink to="/paises" class="btn-acao outline">← Todos os Países</RouterLink>
        <RouterLink :to="'/paises/' + paisB.code" class="btn-acao vermelho">{{ paisB.bandeira }} Explorar {{ paisB.nome }}</RouterLink>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { getPaises, getMarcosByPais } from '@/services/api.js'

const paises = ref([])
const codigoA = ref('')
const codigoB = ref('')
const marcosA = ref([])
const marcosB = ref([])
const heroVisible = ref(false)
const revealProgresso = ref(false)
const revealScore = ref(false)
const revealVencedor = ref(false)
const revealMarcos = ref(false)

const paisA = computed(() => paises.value.find(p => p.code === codigoA.value) || null)
const paisB = computed(() => paises.value.find(p => p.code === codigoB.value) || null)

function selecionarPais(code) {
  if (codigoA.value === code) { codigoA.value = ''; return }
  if (codigoB.value === code) { codigoB.value = ''; return }
  if (!codigoA.value) { codigoA.value = code; return }
  if (!codigoB.value) { codigoB.value = code; return }
  codigoA.value = code
}

function trocarPaises() {
  const tmp = codigoA.value
  codigoA.value = codigoB.value
  codigoB.value = tmp
}

function taxaConclusao(pais) {
  if (!pais || pais.marcosTotal === 0) return 0
  return Math.round((pais.marcosConcluidos / pais.marcosTotal) * 100)
}

function estadoLabel(e) {
  return e === 'concluido' ? '✅ Concluído' : e === 'em_curso' ? '⏳ Em curso' : '⚠️ Em atraso'
}

function barWidth(val, other) {
  const max = Math.max(Number(val) || 0, Number(other) || 0)
  if (max === 0) return 0
  return Math.round((Number(val) || 0) / max * 100)
}

const metricas = computed(() => {
  if (!paisA.value || !paisB.value) return []
  const a = paisA.value, b = paisB.value
  const rows = [
    { label: 'Progresso Geral', valA: a.progresso + '%', valB: b.progresso + '%', numA: a.progresso, numB: b.progresso },
    { label: 'Marcos Totais', valA: a.marcosTotal, valB: b.marcosTotal, numA: a.marcosTotal, numB: b.marcosTotal },
    { label: 'Marcos Concluídos', valA: a.marcosConcluidos, valB: b.marcosConcluidos, numA: a.marcosConcluidos, numB: b.marcosConcluidos },
    { label: 'Taxa de Conclusão', valA: taxaConclusao(a) + '%', valB: taxaConclusao(b) + '%', numA: taxaConclusao(a), numB: taxaConclusao(b) },
    { label: 'Fundos Alocados', valA: a.totalFundos, valB: b.totalFundos, numA: parseFloat(a.totalFundos) || 0, numB: parseFloat(b.totalFundos) || 0 },
    { label: 'População', valA: a.populacao, valB: b.populacao, numA: parseFloat(a.populacao) || 0, numB: parseFloat(b.populacao) || 0 },
  ]
  return rows.map(r => ({ ...r, venceA: r.numA > r.numB ? true : r.numA < r.numB ? false : null, empate: r.numA === r.numB }))
})

const scoreA = computed(() => metricas.value.filter(m => m.venceA === true).length)
const scoreB = computed(() => metricas.value.filter(m => m.venceA === false).length)
const vencedor = computed(() => { if (!paisA.value || !paisB.value) return null; return scoreA.value >= scoreB.value ? paisA.value : paisB.value })
const scoreVencedor = computed(() => { if (!vencedor.value) return 0; return vencedor.value.code === codigoA.value ? scoreA.value : scoreB.value })

watch([codigoA, codigoB], async ([newA, newB]) => {
  revealProgresso.value = false; revealScore.value = false; revealVencedor.value = false; revealMarcos.value = false
  if (newA) { try { marcosA.value = await getMarcosByPais(newA) } catch { marcosA.value = [] } } else { marcosA.value = [] }
  if (newB) { try { marcosB.value = await getMarcosByPais(newB) } catch { marcosB.value = [] } } else { marcosB.value = [] }
  if (newA && newB) {
    await nextTick()
    setTimeout(() => { revealProgresso.value = true }, 200)
    setTimeout(() => { revealScore.value = true }, 500)
    setTimeout(() => { revealMarcos.value = true }, 800)
    setTimeout(() => { revealVencedor.value = true }, 1100)
  }
})

onMounted(async () => {
  setTimeout(() => { heroVisible.value = true }, 100)
  try { paises.value = await getPaises() } catch {}
})
</script>

<style scoped>
.comparar-container { margin: -2rem; font-family: 'Segoe UI', sans-serif; overflow-x: hidden; }

/* HERO */
.hero { background-image: url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600'); background-size: cover; background-position: center; background-attachment: fixed; min-height: 50vh; }
.hero-overlay { background: linear-gradient(135deg, rgba(80,10,8,0.97) 0%, rgba(147,27,24,0.9) 100%); min-height: 50vh; display: flex; align-items: center; justify-content: space-between; padding: 60px 10%; gap: 40px; flex-wrap: wrap; position: relative; overflow: hidden; }
.hero-content { flex: 1; min-width: 280px; opacity: 0; transform: translateX(-40px); transition: all 0.9s ease; }
.hero-content.animate-in { opacity: 1; transform: translateX(0); }
.hero-deco { opacity: 0; transition: all 0.9s ease 0.4s; position: relative; width: 200px; height: 200px; flex-shrink: 0; }
.hero-deco.animate-in { opacity: 1; }
.deco-circle { position: absolute; border-radius: 50%; border: 2px solid rgba(255,255,255,0.15); }
.c1 { width: 200px; height: 200px; top: 0; left: 0; animation: spin-slow 20s linear infinite; }
.c2 { width: 140px; height: 140px; top: 30px; left: 30px; animation: spin-slow 14s linear infinite reverse; }
.c3 { width: 80px; height: 80px; top: 60px; left: 60px; background: rgba(212,175,55,0.1); animation: pulse-ring 2s ease infinite; }
.deco-vs { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2rem; font-weight: 900; color: #d4af37; text-shadow: 0 0 20px rgba(212,175,55,0.5); }
@keyframes spin-slow { to { transform: rotate(360deg); } }
@keyframes pulse-ring { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); opacity: 0.7; } }
.hero-badge { display: inline-block; background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.6); color: #d4af37; padding: 6px 16px; border-radius: 99px; font-size: 0.78rem; font-weight: 700; margin-bottom: 16px; }
.hero-content h1 { font-size: 3.8rem; font-weight: 900; color: white; margin-bottom: 14px; line-height: 1; letter-spacing: -0.02em; }
.hero-accent { color: #d4af37; }
.hero-content p { font-size: 0.95rem; color: rgba(255,255,255,0.72); max-width: 460px; line-height: 1.7; margin-bottom: 24px; }
.btn-voltar { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: color 0.2s; }
.btn-voltar:hover { color: white; }

/* SELETORES */
.seletores-section { padding: 50px 10%; background: #f5f5f7; }
.seletores-titulo { text-align: center; margin-bottom: 32px; }
.seletores-titulo h2 { font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 6px; }
.seletores-titulo p { font-size: 0.88rem; color: #888; }

.selecionados-wrap { display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center; margin-bottom: 32px; }
.slot { height: 140px; border-radius: 18px; overflow: hidden; position: relative; cursor: pointer; border: 3px solid transparent; transition: all 0.3s; }
.slot:not(.preenchido) { border: 3px dashed #d8d8dc; cursor: default; }
.slot.preenchido:hover { transform: scale(1.02); }
.slot.preenchido:hover .slot-img { transform: scale(1.08); }
.slot.preenchido:hover .slot-remove { opacity: 1; transform: scale(1); }
.slot-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.slot-overlay { position: absolute; inset: 0; }
.azul-overlay { background: linear-gradient(135deg, rgba(26,58,107,0.85), rgba(46,107,191,0.7)); }
.vermelho-overlay { background: linear-gradient(135deg, rgba(107,18,16,0.85), rgba(147,27,24,0.7)); }
.slot-info { position: absolute; inset: 0; display: flex; align-items: center; padding: 0 22px; gap: 14px; }
.slot-num { font-size: 1.4rem; font-weight: 900; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.azul-num { background: white; color: #2e6bbf; }
.vermelho-num { background: white; color: #931b18; }
.slot-flag { font-size: 2.4rem; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3)); }
.slot-text { flex: 1; display: flex; flex-direction: column; }
.slot-nome { font-size: 1.2rem; font-weight: 800; color: white; line-height: 1.1; }
.slot-cap { font-size: 0.78rem; color: rgba(255,255,255,0.8); margin-top: 2px; }
.slot-remove { font-size: 1.1rem; color: white; opacity: 0; transform: scale(0.8); transition: all 0.2s; background: rgba(0,0,0,0.3); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.slot-vazio { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; font-size: 0.92rem; font-weight: 600; }
.azul-vazio { color: #2e6bbf; background: rgba(46,107,191,0.04); }
.vermelho-vazio { color: #931b18; background: rgba(147,27,24,0.04); }
.slot-num-vazio { font-size: 2rem; font-weight: 900; opacity: 0.3; }

.vs-central { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.vs-ring { width: 56px; height: 56px; border-radius: 50%; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 900; color: #ccc; border: 3px solid #f0f0f0; transition: all 0.4s; }
.vs-ring.ativo { color: #931b18; border-color: #931b18; animation: pulse-vs 2s ease infinite; }
@keyframes pulse-vs { 0%,100% { box-shadow: 0 4px 20px rgba(147,27,24,0.2); } 50% { box-shadow: 0 4px 30px rgba(147,27,24,0.45); } }
.vs-trocar { background: #931b18; color: white; border: none; padding: 7px 14px; border-radius: 8px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.vs-trocar:hover { background: #6b1210; transform: scale(1.05); }

.paises-picker { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 14px; }
.picker-card { position: relative; height: 130px; border-radius: 16px; overflow: hidden; cursor: pointer; border: 3px solid transparent; transition: all 0.3s; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.picker-card:hover { transform: translateY(-5px); box-shadow: 0 12px 28px rgba(0,0,0,0.18); }
.picker-card:hover .picker-img { transform: scale(1.1); }
.picker-card.selected-a { border-color: #2e6bbf; box-shadow: 0 0 0 4px rgba(46,107,191,0.25), 0 8px 24px rgba(46,107,191,0.3); transform: translateY(-5px); }
.picker-card.selected-b { border-color: #931b18; box-shadow: 0 0 0 4px rgba(147,27,24,0.25), 0 8px 24px rgba(147,27,24,0.3); transform: translateY(-5px); }
.picker-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.picker-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%); }
.picker-badge { position: absolute; top: 8px; right: 8px; color: white; font-size: 0.85rem; font-weight: 900; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); animation: badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.azul-badge { background: #2e6bbf; }
.vermelho-badge { background: #931b18; }
@keyframes badge-pop { from { transform: scale(0); } to { transform: scale(1); } }
.picker-info { position: absolute; bottom: 28px; left: 0; right: 0; padding: 0 12px; display: flex; align-items: center; gap: 6px; }
.picker-flag { font-size: 1.2rem; filter: drop-shadow(0 1px 3px rgba(0,0,0,0.4)); }
.picker-nome { font-size: 0.82rem; font-weight: 700; color: white; flex: 1; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
.picker-progresso { position: absolute; bottom: 8px; left: 12px; right: 12px; display: flex; align-items: center; gap: 6px; }
.pp-bg { flex: 1; height: 4px; background: rgba(255,255,255,0.25); border-radius: 99px; overflow: hidden; }
.pp-fill { height: 100%; background: white; border-radius: 99px; }
.pp-val { font-size: 0.7rem; font-weight: 800; color: white; }

/* PROGRESSO */
.progresso-section { padding: 36px 10%; background: white; border-bottom: 1px solid #f0f0f0; }
.prog-wrap { display: flex; align-items: center; gap: 20px; opacity: 0; transform: translateY(20px); transition: all 0.7s ease; }
.prog-wrap.reveal { opacity: 1; transform: translateY(0); }
.prog-pais-a, .prog-pais-b { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.prog-flag { font-size: 1.5rem; }
.prog-nome { font-size: 0.88rem; font-weight: 700; color: #333; }
.prog-val { font-size: 1.3rem; font-weight: 900; }
.prog-val.azul { color: #1a4e9a; }
.prog-val.vermelho { color: #931b18; }
.prog-track { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.prog-bar-a, .prog-bar-b { height: 10px; border-radius: 99px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
.prog-bar-a { background: linear-gradient(90deg, #1a3a6b, #2e6bbf); }
.prog-bar-b { background: linear-gradient(90deg, #6b1210, #931b18); }

/* SCORECARD */
.scorecard-section { padding: 50px 10%; background: #f5f5f7; }
.sc-titulo { text-align: center; margin-bottom: 20px; opacity: 0; transform: translateY(20px); transition: all 0.6s; }
.sc-titulo.reveal { opacity: 1; transform: translateY(0); }
.sc-titulo h2 { font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 6px; }
.sc-titulo p { font-size: 0.85rem; color: #888; }

.sc-legenda { display: flex; justify-content: center; gap: 24px; margin-bottom: 24px; flex-wrap: wrap; opacity: 0; transform: translateY(10px); transition: all 0.6s ease 0.1s; }
.sc-legenda.reveal { opacity: 1; transform: translateY(0); }
.leg-item { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; color: #666; font-weight: 600; }
.leg-cor { width: 12px; height: 12px; border-radius: 3px; }
.azul-cor { background: #2e6bbf; }
.vermelho-cor { background: #931b18; }
.leg-empate { width: 18px; height: 18px; border-radius: 4px; background: #f0f0f0; color: #888; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; }
.leg-bar { width: 30px; height: 6px; background: #f0f0f0; border-radius: 99px; overflow: hidden; display: block; }
.leg-bar-fill { display: block; width: 70%; height: 100%; background: linear-gradient(90deg, #2e6bbf, #931b18); }

.scorecard-grid { display: grid; grid-template-columns: 1fr 160px 1fr; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); opacity: 0; transform: translateY(30px); transition: all 0.7s ease 0.2s; }
.scorecard-grid.reveal { opacity: 1; transform: translateY(0); }
.sc-col-header { display: flex; align-items: center; gap: 10px; padding: 18px 22px; color: white; font-weight: 700; }
.sc-col-header.azul-bg { background: linear-gradient(135deg, #1a3a6b, #2e6bbf); }
.sc-col-header.vermelho-bg { background: linear-gradient(135deg, #6b1210, #931b18); justify-content: flex-end; }
.sc-col-center-header { background: #1a1a1a; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.sch-flag { font-size: 1.5rem; }
.sch-nome { font-size: 0.9rem; flex: 1; }
.sch-score { background: rgba(255,255,255,0.22); padding: 4px 12px; border-radius: 99px; font-size: 0.78rem; font-weight: 800; }

.sc-val-cell { padding: 16px 22px; border-bottom: 1px solid #f5f5f5; display: flex; flex-direction: column; justify-content: center; gap: 8px; transition: background 0.2s; }
.sc-val-cell.vence { background: linear-gradient(90deg, rgba(46,107,191,0.08), transparent); }
.sc-val-cell.right { align-items: flex-end; }
.sc-val-cell.right.vence { background: linear-gradient(270deg, rgba(147,27,24,0.08), transparent); }

.scv-top { display: flex; align-items: center; gap: 8px; }
.scv-num { font-size: 1.15rem; font-weight: 800; color: #555; transition: all 0.3s; }
.sc-val-cell.vence .scv-num { color: #1a4e9a; font-size: 1.3rem; }
.sc-val-cell.right.vence .scv-num { color: #931b18; font-size: 1.3rem; }
.scv-check { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, #1a3a6b, #2e6bbf); color: white; font-size: 0.78rem; font-weight: 900; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(46,107,191,0.3); animation: check-pop 0.4s cubic-bezier(0.34,1.56,0.64,1); }
.sc-val-cell.right .scv-check { background: linear-gradient(135deg, #6b1210, #931b18); box-shadow: 0 2px 6px rgba(147,27,24,0.3); }
@keyframes check-pop { from { transform: scale(0) rotate(-90deg); } to { transform: scale(1) rotate(0); } }
.scv-bar-wrap { width: 100%; }
.scv-bar-wrap.right { display: flex; justify-content: flex-end; }
.scv-bar { height: 5px; border-radius: 99px; transition: width 1s ease; }
.azul-bar { background: linear-gradient(90deg, #1a3a6b, #2e6bbf); }
.vermelho-bar { background: linear-gradient(90deg, #6b1210, #931b18); }

.sc-metric-label { padding: 14px 12px; border-bottom: 1px solid #f5f5f5; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: #fafafa; }
.sml-text { font-size: 0.78rem; font-weight: 700; color: #333; text-align: center; line-height: 1.3; }
.sml-status { display: flex; align-items: center; justify-content: center; }
.status-dot { width: 10px; height: 10px; border-radius: 50%; display: block; }
.azul-dot { background: #2e6bbf; box-shadow: 0 0 0 3px rgba(46,107,191,0.2); }
.vermelho-dot { background: #931b18; box-shadow: 0 0 0 3px rgba(147,27,24,0.2); }
.status-empate { color: #aaa; font-weight: 800; font-size: 0.95rem; }

/* VENCEDOR */
.vencedor-section { padding: 0 10% 50px; background: #f5f5f7; }
.vencedor-card { display: flex; align-items: center; gap: 24px; padding: 28px 32px; border-radius: 24px; box-shadow: 0 12px 40px rgba(0,0,0,0.18); }
.v-azul { background: linear-gradient(135deg, #0e2151, #1a3a6b, #2e6bbf); }
.v-vermelho { background: linear-gradient(135deg, #3d0a08, #6b1210, #931b18); }
.v-trofeu { font-size: 3rem; animation: bounce-trophy 1s ease infinite alternate; flex-shrink: 0; }
@keyframes bounce-trophy { from { transform: translateY(0) rotate(-5deg); } to { transform: translateY(-10px) rotate(5deg); } }
.v-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.6); margin-bottom: 6px; }
.v-nome { font-size: 1.8rem; font-weight: 900; color: white; margin-bottom: 6px; }
.v-stats { font-size: 0.82rem; color: rgba(255,255,255,0.75); display: flex; gap: 8px; flex-wrap: wrap; }
.v-stars { margin-left: auto; display: flex; gap: 4px; flex-shrink: 0; }
.v-star { font-size: 1.4rem; animation: star-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes star-pop { from { opacity: 0; transform: scale(0) rotate(-20deg); } to { opacity: 1; transform: scale(1); } }
.vencedor-pop-enter-active { transition: all 0.7s cubic-bezier(0.34,1.4,0.64,1); }
.vencedor-pop-enter-from { opacity: 0; transform: scale(0.85) translateY(30px); }

/* MARCOS */
.marcos-section { padding: 50px 10%; background: white; }
.marcos-titulo { text-align: center; margin-bottom: 24px; opacity: 0; transform: translateY(16px); transition: all 0.5s; }
.marcos-titulo.reveal { opacity: 1; transform: translateY(0); }
.marcos-titulo h2 { font-size: 1.8rem; font-weight: 800; color: #1a1a1a; }
.marcos-dual { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; opacity: 0; transform: translateY(24px); transition: all 0.7s ease 0.2s; }
.marcos-dual.reveal { opacity: 1; transform: translateY(0); }
.marcos-col { border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
.mc-header { display: flex; align-items: center; gap: 8px; padding: 14px 18px; color: white; font-weight: 700; font-size: 0.9rem; }
.mc-count { margin-left: auto; background: rgba(255,255,255,0.2); padding: 2px 10px; border-radius: 99px; font-size: 0.8rem; }
.mc-empty { padding: 28px; text-align: center; color: #bbb; font-size: 0.88rem; background: white; }
.marco-item { padding: 12px 16px; border-bottom: 1px solid #f8f8f8; background: white; animation: fadeInUp 0.4s ease both; transition: background 0.15s; }
.marco-item:hover { background: #fafafa; }
.marco-item:last-child { border-bottom: none; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.mi-top { display: flex; justify-content: space-between; margin-bottom: 4px; }
.mi-setor { font-size: 0.7rem; color: #aaa; }
.mi-estado { font-size: 0.7rem; font-weight: 700; padding: 1px 7px; border-radius: 99px; }
.mi-estado.concluido { background: #d4edda; color: #155724; }
.mi-estado.em_curso { background: #fff3cd; color: #856404; }
.mi-estado.em_atraso { background: #f8d7da; color: #721c24; }
.mi-titulo { font-size: 0.83rem; font-weight: 600; color: #333; margin-bottom: 7px; line-height: 1.4; }
.mi-prog { display: flex; align-items: center; gap: 8px; }
.mi-bg { flex: 1; height: 5px; background: #f0f0f0; border-radius: 99px; overflow: hidden; }
.mi-fill { height: 100%; border-radius: 99px; transition: width 0.8s ease; }
.azul-fill { background: linear-gradient(90deg, #1a3a6b, #2e6bbf); }
.vermelho-fill { background: linear-gradient(90deg, #6b1210, #931b18); }
.mi-prog span { font-size: 0.72rem; font-weight: 700; color: #666; width: 30px; text-align: right; }

/* ACÇÕES */
.acoes-section { padding: 40px 10%; background: #f5f5f7; display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
.btn-acao { text-decoration: none; padding: 14px 26px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; transition: all 0.25s; }
.btn-acao.azul { background: linear-gradient(135deg, #1a3a6b, #2e6bbf); color: white; }
.btn-acao.azul:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(46,107,191,0.3); }
.btn-acao.vermelho { background: linear-gradient(135deg, #6b1210, #931b18); color: white; }
.btn-acao.vermelho:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(147,27,24,0.3); }
.btn-acao.outline { background: white; color: #333; border: 1.5px solid #e0e0e0; }
.btn-acao.outline:hover { border-color: #931b18; color: #931b18; transform: translateY(-2px); }
</style>