<template>
  <div class="paises-container">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-overlay">
        <div class="hero-content" :class="{ 'animate-in': heroVisible }">
          <div class="hero-badge">{{ appStore.t.paises_badge }}</div>
          <h1>{{ appStore.t.paises_titulo }}<br><span class="hero-accent">{{ appStore.t.paises_accent }}</span></h1>
          <p>{{ appStore.t.paises_sub }}</p>
          <div class="hero-actions">
            <button class="btn-hero-primary" @click="scrollSmooth('mapa-section')">{{ appStore.t.paises_btn_mapa }}</button>
            <RouterLink to="/paises/comparar" class="btn-hero-outline">{{ appStore.t.paises_btn_comparar }}</RouterLink>
          </div>
        </div>
        <div class="hero-stats" :class="{ 'animate-in': heroVisible }">
          <div class="hsc"><div class="hsc-icon">🌍</div><span class="hsc-val">{{ contadorPaises }}</span><span class="hsc-label">{{ appStore.idioma === 'pt' ? 'Países' : 'Countries' }}</span></div>
          <div class="hsc"><div class="hsc-icon">💶</div><span class="hsc-val">€750B</span><span class="hsc-label">{{ appStore.t.paises_total_eu }}</span></div>
          <div class="hsc"><div class="hsc-icon">🎯</div><span class="hsc-val">{{ totaisMarcosReais.total }}</span><span class="hsc-label">{{ appStore.t.paises_marcos_label }}</span></div>
          <div class="hsc"><div class="hsc-icon">✅</div><span class="hsc-val">{{ totaisMarcosReais.concluidos }}</span><span class="hsc-label">{{ appStore.t.paises_concluidos_label }}</span></div>
        </div>
      </div>
    </section>

    <!-- LOADING -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>{{ appStore.t.paises_loading }}</p>
    </div>

    <!-- ERRO -->
    <div v-if="erro" class="erro-state"><span>⚠️</span><p>{{ erro }}</p></div>

    <!-- MAPA -->
    <div id="mapa-section" v-if="!loading">
      <MapaEuropa :paises="paisesTraduzidos"
                  :desembolsosPorPais="totalDesembolsadoPorPais"
                  :proximasTranches="proximaTranchePorPais"
                  :marcosStatsPorPais="marcosStatsPorPais"
      />
    </div>

    <!-- GRID -->
    <section class="grid-section" id="grid-paises" v-if="!loading">
      <div class="grid-header">
        <div>
          <h2>{{ appStore.t.paises_grid_title }}</h2>
          <p class="grid-sub">{{ appStore.t.paises_grid_sub }}</p>
        </div>
        <RouterLink to="/paises/comparar" class="btn-comparar">{{ appStore.t.paises_btn_comparar }}</RouterLink>
      </div>

      <div class="paises-grid">
        <div
          v-for="(pais, index) in paisesTraduzidos"
          :key="pais.id"
          class="pais-card"
          :style="{ animationDelay: (index * 0.07) + 's' }"
          @click="$router.push('/paises/' + pais.code)"
        >
          <div class="pais-card-banner">
            <img :src="pais.imagem" :alt="pais.nome" class="pais-banner-img" />
            <div class="pais-banner-overlay"></div>
            <span class="pais-bandeira-big">{{ pais.bandeira }}</span>
            <div class="pais-badge-progresso" :style="{ background: corProgresso(percentagemReal(pais.code)) }">
              {{ percentagemReal(pais.code) }}%
            </div>
          </div>
          <div class="pais-card-body">
            <div class="pais-card-top">
              <div>
                <h3 class="pais-nome">{{ pais.nome }}</h3>
                <span class="pais-capital">🏛️ {{ pais.capital }} · 👥 {{ pais.populacao }}</span>
              </div>
              <div class="pais-fundos">{{ pais.totalFundos }}</div>
            </div>
            <div class="pais-progresso-wrap">
              <div class="pais-progresso-header">
                <span>{{ appStore.t.paises_progresso_label }}</span>
                <strong :style="{ color: corProgresso(percentagemReal(pais.code)) }">{{ percentagemReal(pais.code) }}%</strong>
              </div>
              <div class="pais-progresso-bg">
                <div class="pais-progresso-fill" :style="{ width: percentagemReal(pais.code) + '%', background: corProgresso(percentagemReal(pais.code)) }"></div>
              </div>
            </div>

            <!-- Estatísticas de marcos (dinâmicas) -->
            <div class="pais-stats">
              <div class="pais-stat">
                <span class="pais-stat-val">{{ marcosStatsPorPais[pais.code]?.total || 0 }}</span>
                <span class="pais-stat-label">{{ appStore.t.paises_marcos_label }}</span>
              </div>
              <div class="pais-stat-divider"></div>
              <div class="pais-stat">
                <span class="pais-stat-val" style="color:#1a7a4a">{{ marcosStatsPorPais[pais.code]?.concluidos || 0 }}</span>
                <span class="pais-stat-label">{{ appStore.t.paises_concluidos_label }}</span>
              </div>
              <div class="pais-stat-divider"></div>
              <div class="pais-stat">
                <span class="pais-stat-val" style="color:#931b18">{{ (marcosStatsPorPais[pais.code]?.total || 0) - (marcosStatsPorPais[pais.code]?.concluidos || 0) }}</span>
                <span class="pais-stat-label">{{ appStore.t.paises_em_curso_label }}</span>
              </div>
            </div>

            <!-- Total Desembolsado e Próxima Tranche -->
            <div class="pais-dados-financeiros">
              <div class="finance-item">
                <span class="finance-label">💰 {{ appStore.t.paises_total_desembolsado }}</span>
                <span class="finance-value">{{ formatMoneyReduzido(totalDesembolsadoPorPais[pais.code] || 0) }}</span>
              </div>
              <span class="finance-divider">|</span>
              <div class="finance-item">
                <span class="finance-label">🗓️ {{ appStore.t.paises_proxima_tranche }}</span>
                <span class="finance-value">{{ proximaTranchePorPais[pais.code] || '—' }}</span>
              </div>
            </div>

            <div class="pais-card-footer">
              <span class="btn-ver-mais">{{ appStore.t.paises_ver_detalhes }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getPaises, getDesembolsos, getMarcos } from '@/services/api.js'
import MapaEuropa from '@/components/MapaEuropa.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const paisesRaw = ref([])
const desembolsos = ref([])
const loading = ref(true)
const erro = ref(null)
const heroVisible = ref(false)
const contadorPaises = ref(0)
const marcos = ref([])

// Dados traduzidos dos países com base no idioma atual
const paisesTraduzidos = computed(() => {
  const isPt = appStore.idioma === 'pt'
  return paisesRaw.value.map(p => ({
    ...p,
    nome: isPt ? p.nome_pt : p.nome_en,
    capital: isPt ? p.capital_pt : p.capital_en,
    populacao: isPt ? p.populacao_pt : p.populacao_en,
    totalFundos: isPt ? p.totalFundos_pt : p.totalFundos_en,
  }))
})

// Estatísticas reais dos marcos por país
const marcosStatsPorPais = computed(() => {
  const stats = {}
  marcos.value.forEach(m => {
    const code = m.paisCode
    if (!stats[code]) stats[code] = { total: 0, concluidos: 0 }
    stats[code].total++
    if (m.estado === 'concluido') stats[code].concluidos++
  })
  return stats
})

// Totais gerais (para o hero)
const totaisMarcosReais = computed(() => {
  let total = 0
  let concluidos = 0
  for (const stats of Object.values(marcosStatsPorPais.value)) {
    total += stats.total
    concluidos += stats.concluidos
  }
  return { total, concluidos }
})

// Total desembolsado por país (só pagos)
const totalDesembolsadoPorPais = computed(() => {
  const map = {}
  desembolsos.value.forEach(d => {
    if (d.estado === 'Pago') {
      map[d.paisCode] = (map[d.paisCode] || 0) + d.montante
    }
  })
  return map
})

// Próxima tranche (mais próxima data futura entre 'Em Avaliação' ou 'Planeado')
const proximaTranchePorPais = computed(() => {
  const map = {}
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  desembolsos.value.forEach(d => {
    const code = d.paisCode
    const dataObj = new Date(d.data)
    dataObj.setHours(0, 0, 0, 0)
    
    if ((d.estado === 'Em Avaliação' || d.estado === 'Planeado') && dataObj > hoje) {
      if (!map[code] || dataObj < map[code].data) {
        map[code] = { data: dataObj, label: formatDateShort(dataObj) }
      }
    }
  })
  
  const result = {}
  for (const [code, obj] of Object.entries(map)) {
    result[code] = obj.label
  }
  return result
})

// Função auxiliar para calcular a percentagem real de um país
function percentagemReal(code) {
  const stats = marcosStatsPorPais.value[code]
  if (!stats || stats.total === 0) return 0
  return Math.round((stats.concluidos / stats.total) * 100)
}

function corProgresso(p) {
  if (p >= 80) return '#1a7a4a'
  if (p >= 40) return '#e6a817'
  if (p === 0) return '#aaa'
  return '#931b18'
}

function scrollSmooth(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function animarContador(ref, target, duration = 1500) {
  const start = performance.now()
  const update = (now) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    ref.value = Math.round(eased * target)
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

function formatMoneyReduzido(val) {
  if (val >= 1e9) return `€ ${(val / 1e9).toFixed(1)}B`
  if (val >= 1e6) return `€ ${(val / 1e6).toFixed(1)}M`
  if (val >= 1e3) return `€ ${(val / 1e3).toFixed(0)} mil`
  return `€ ${Math.round(val).toLocaleString('pt-PT')}`
}

function formatDateShort(date) {
  const mesesPt = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  const mesesEn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const meses = appStore.idioma === 'pt' ? mesesPt : mesesEn
  return `${meses[date.getMonth()]} ${date.getFullYear()}`
}

onMounted(async () => {
  try {
    const [paisesData, desembolsosData, marcosData] = await Promise.all([
      getPaises(), getDesembolsos(), getMarcos()
    ])
    paisesRaw.value = paisesData
    desembolsos.value = desembolsosData
    marcos.value = marcosData
  } catch (e) {
    console.error(e)
    erro.value = appStore.t.paises_erro
  } finally {
    loading.value = false
  }
  setTimeout(() => {
    heroVisible.value = true
    animarContador(contadorPaises, paisesTraduzidos.value.length)
  }, 100)
})
</script>

<style scoped>
/* ===== TODO O CSS ORIGINAL É MANTIDO EXACTAMENTE IGUAL ===== */
.paises-container { margin: -2rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow-x: hidden; }

.hero {
  background-image: url('https://images.unsplash.com/photo-1485081669829-bacb8c7bb1f3?w=1600');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 65vh;
}
.hero-overlay {
  background: linear-gradient(135deg, rgba(100,15,13,0.95) 0%, rgba(147,27,24,0.88) 100%);
  min-height: 65vh;
  display: flex; align-items: center; justify-content: space-between;
  padding: 70px 10%; gap: 50px; flex-wrap: wrap;
}
.hero-content { flex: 1; min-width: 300px; opacity: 0; transform: translateX(-40px); transition: all 0.8s ease; }
.hero-content.animate-in { opacity: 1; transform: translateX(0); }
.hero-stats { opacity: 0; transform: translateX(40px); transition: all 0.8s ease 0.3s; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.hero-stats.animate-in { opacity: 1; transform: translateX(0); }
.hero-badge { display: inline-block; background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.6); color: #d4af37; padding: 7px 18px; border-radius: 99px; font-size: 0.82rem; font-weight: 600; margin-bottom: 20px; }
.hero-content h1 { font-size: 4rem; font-weight: 900; color: white; margin-bottom: 18px; line-height: 1; letter-spacing: -0.02em; }
.hero-accent { color: #d4af37; }
.hero-content p { font-size: 1rem; color: rgba(255,255,255,0.8); max-width: 480px; line-height: 1.8; margin-bottom: 32px; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-hero-primary { background: linear-gradient(135deg, #d4af37, #c49a28); color: #5a0f0f; border: none; padding: 14px 28px; border-radius: 10px; font-weight: 800; font-size: 0.92rem; cursor: pointer; transition: all 0.3s; }
.btn-hero-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(212,175,55,0.4); }
.btn-hero-outline { background: transparent; color: white; border: 2px solid rgba(255,255,255,0.6); padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 0.92rem; cursor: pointer; transition: all 0.3s; text-decoration: none; display: inline-flex; align-items: center; }
.btn-hero-outline:hover { border-color: white; background: rgba(255,255,255,0.1); }
.hsc { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 22px 18px; text-align: center; backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 120px; transition: transform 0.3s; }
.hsc:hover { transform: translateY(-4px); }
.hsc-icon { font-size: 1.6rem; }
.hsc-val { font-size: 2rem; font-weight: 900; color: #d4af37; line-height: 1; }
.hsc-label { font-size: 0.7rem; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.06em; }

.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; gap: 16px; color: #888; }
.loading-spinner { width: 40px; height: 40px; border: 3px solid #f0f0f0; border-top-color: #931b18; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.erro-state { background: #fdf2f2; border: 1px solid #f8d7da; border-radius: 16px; padding: 20px 30px; margin: 20px 10%; display: flex; align-items: center; gap: 12px; color: #721c24; }

.grid-section { padding: 60px 10%; background: #f5f5f7; }
.grid-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 35px; flex-wrap: wrap; gap: 15px; }
.grid-header h2 { font-size: 2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 5px; }
.grid-sub { font-size: 0.88rem; color: #aaa; }
.btn-comparar { background: #931b18; color: white; text-decoration: none; padding: 11px 22px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; transition: all 0.2s; display: inline-block; }
.btn-comparar:hover { background: #6b1210; transform: translateY(-2px); }

.paises-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 22px; }
.pais-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; animation: fadeInUp 0.6s ease both; border: 2px solid transparent; }
.pais-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.14); border-color: #931b18; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.pais-card-banner { height: 140px; position: relative; overflow: hidden; }
.pais-banner-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.pais-card:hover .pais-banner-img { transform: scale(1.08); }
.pais-banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 60%); }
.pais-bandeira-big { position: absolute; bottom: 12px; left: 16px; font-size: 2.8rem; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5)); }
.pais-badge-progresso { position: absolute; top: 12px; right: 12px; color: white; font-size: 0.78rem; font-weight: 800; padding: 4px 10px; border-radius: 99px; }
.pais-card-body { padding: 20px 22px 22px; }
.pais-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 10px; }
.pais-nome { font-size: 1.1rem; font-weight: 800; color: #1a1a1a; margin-bottom: 3px; }
.pais-capital { font-size: 0.75rem; color: #888; }
.pais-fundos { font-size: 0.82rem; font-weight: 800; color: #931b18; background: #fdf2f2; padding: 5px 12px; border-radius: 99px; white-space: nowrap; flex-shrink: 0; }
.pais-progresso-wrap { margin-bottom: 16px; }
.pais-progresso-header { display: flex; justify-content: space-between; font-size: 0.76rem; color: #aaa; margin-bottom: 6px; }
.pais-progresso-bg { height: 8px; background: #f0f0f0; border-radius: 99px; overflow: hidden; }
.pais-progresso-fill { height: 100%; border-radius: 99px; transition: width 0.8s ease; }
.pais-stats { display: flex; align-items: center; justify-content: space-around; padding: 14px 0; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; margin-bottom: 16px; }
.pais-stat { text-align: center; }
.pais-stat-val { display: block; font-size: 1.2rem; font-weight: 800; color: #1a1a1a; }
.pais-stat-label { font-size: 0.7rem; color: #aaa; text-transform: uppercase; letter-spacing: 0.04em; }
.pais-stat-divider { width: 1px; height: 30px; background: #f0f0f0; }
.pais-card-footer { text-align: right; }
.btn-ver-mais { font-size: 0.82rem; font-weight: 700; color: #931b18; }
.pais-card:hover .btn-ver-mais { text-decoration: underline; }

.pais-dados-financeiros {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin: 12px 0;
  background: transparent;
}
.finance-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  text-align: center;
}
.finance-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}
.finance-value {
  font-weight: 800;
  color: #1a1a1a;
  font-size: 0.9rem;
}
.finance-divider {
  color: #ccc;
  font-weight: 400;
}
</style>