<template>
  <div class="mapa-wrapper">
    <div class="mapa-inner">

      <!-- CABEÇALHO -->
      <div class="mapa-header" :class="{ 'animate-in': tituloVisible }">
        <div>
          <h2>{{ appStore.t.mapa_titulo }}</h2>
          <p>{{ appStore.t.mapa_sub }}</p>
        </div>
        <div class="mapa-header-stats" v-if="paises.length">
          <div class="mhs"><span>{{ paises.length }}</span>{{ appStore.t.mapa_paises_label }}</div>
          <div class="mhs"><span>{{ totalMarcosReal }}</span>{{ appStore.t.mapa_marcos_label }}</div>
          <div class="mhs verde"><span>{{ totalConcluidosReal }}</span>{{ appStore.t.mapa_concluidos_label }}</div>
          <div class="mhs dourado"><span>€750B</span>{{ appStore.t.mapa_total_ue }}</div>
        </div>
      </div>

      <!-- MAPA -->
      <div class="mapa-svg-wrap">
        <!-- Estado de carregamento -->
        <div v-if="carregando" class="mapa-loading">
          <div class="spinner"></div>
          <span>{{ appStore.t.mapa_loading }}</span>
        </div>

        <!-- Estado de erro -->
        <div v-else-if="erroGeoJson" class="mapa-loading">
          <span>⚠️</span>
          <span>{{ appStore.t.mapa_erro_carregar || 'Erro ao carregar o mapa.' }}</span>
          <button class="btn-retry" @click="carregarGeoJson">{{ appStore.t.mapa_tentar_novamente || 'Tentar novamente' }}</button>
        </div>

        <svg v-else ref="svgRef" :viewBox="`0 0 ${W} ${H}`" class="mapa-svg">
          <defs>
            <radialGradient id="ocean-grad" cx="30%" cy="40%" r="80%">
              <stop offset="0%" stop-color="#daeaf7"/>
              <stop offset="100%" stop-color="#b8d4ee"/>
            </radialGradient>
            <filter id="f-sombra">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.2)"/>
            </filter>
          </defs>
          <rect width="900" height="600" fill="url(#ocean-grad)"/>
          <g ref="gRef"></g>
          <g ref="pulsesRef"></g>
          <g ref="labelsRef"></g>
        </svg>

        <!-- TOOLTIP -->
        <transition name="tt-anim">
          <div v-if="tooltip.visivel" class="tooltip" :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
            <div class="tt-top" :style="{ background: corPais(tooltip.pais?.code) }">
              <span class="tt-flag">{{ tooltip.pais?.bandeira }}</span>
              <div>
                <div class="tt-nome">{{ tooltip.pais?.nome }}</div>
                <div class="tt-sub">🏛️ {{ tooltip.pais?.capital }} · 👥 {{ tooltip.pais?.populacao }}</div>
              </div>
            </div>
            <div class="tt-body">
              <div class="tt-fundos">💶 {{ tooltip.pais?.totalFundos }} {{ appStore.t.mapa_tooltip_allocated }}</div>
              <div class="tt-stats">
                <div class="ts">
                  <strong>{{ marcosStatsPorPais[tooltip.pais?.code]?.total || 0 }}</strong>
                  <span>{{ appStore.t.mapa_marcos_label }}</span>
                </div>
                <div class="ts">
                  <strong style="color:#1a7a4a">{{ marcosStatsPorPais[tooltip.pais?.code]?.concluidos || 0 }}</strong>
                  <span>{{ appStore.t.mapa_tooltip_completed }}</span>
                </div>
                <div class="ts">
                  <strong :style="{ color: corProgresso(percentagemPorPais[tooltip.pais?.code] || 0) }">
                    {{ percentagemPorPais[tooltip.pais?.code] || 0 }}%
                  </strong>
                  <span>{{ appStore.t.mapa_tooltip_progress }}</span>
                </div>
              </div>
              <div class="tt-desembolso">
                💰 {{ appStore.t.mapa_tooltip_disbursed }}
                <strong>{{ formatMoneyReduzido(desembolsosPorPais[tooltip.pais?.code] || 0) }}</strong>
              </div>
              <div class="tt-proxima">
                🗓️ {{ appStore.t.mapa_tooltip_next_tranche }}
                <strong>{{ proximasTranches[tooltip.pais?.code] || '—' }}</strong>
              </div>
              <div class="tt-progress-label">{{ appStore.t.mapa_tooltip_progress }}</div>
              <div class="tt-bar-bg"><div class="tt-bar-fill" :style="{ width: (percentagemPorPais[tooltip.pais?.code] || 0) + '%', background: corProgresso(percentagemPorPais[tooltip.pais?.code] || 0) }"></div></div>
              <div class="tt-cta">{{ appStore.t.mapa_tooltip_click }}</div>
            </div>
          </div>
        </transition>
      </div>

      <!-- LEGENDA -->
      <div class="legenda">
        <div
          class="leg-item"
          v-for="p in paises"
          :key="p.code"
          @click="router.push('/paises/' + p.code)"
          @mouseenter="destacarPaisLegenda(p.code)"
          @mouseleave="removerDestaqueLegenda(p.code)"
        >
          <span class="leg-dot" :style="{ background: corPais(p.code) }"></span>
          <span>{{ p.bandeira }}</span>
          <span class="leg-nome">{{ p.nome }}</span>
          <span class="leg-prog" :style="{ color: corProgresso(percentagemPorPais[p.code] || 0) }"> {{ percentagemPorPais[p.code] || 0 }}% </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as d3 from 'd3'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const router = useRouter()

const props = defineProps({
  paises: { type: Array, required: true },
  desembolsosPorPais: { type: Object, required: true },
  proximasTranches: { type: Object, required: true },
  marcosStatsPorPais: { type: Object, required: true }
})

const W = 900, H = 600
const svgRef = ref(null)
const gRef = ref(null)
const labelsRef = ref(null)
const pulsesRef = ref(null)
const carregando = ref(true)
const erroGeoJson = ref(false)
const tituloVisible = ref(false)
const tooltip = ref({ visivel: false, x: 0, y: 0, pais: null })

let geoData = null, projection = null, pathGen = null
const pathsMap = new Map()
const centroidsMap = new Map()
const coresMap = new Map()
const palette = [
  '#c0392b', '#d35400', '#1a5276', '#1e8449', '#6c3483', '#b7144e', '#b7950b', '#7d6608',
  '#2980b9', '#27ae60', '#8e44ad', '#e67e22', '#2c3e50', '#f1c40f', '#e74c3c', '#16a085',
  '#c44569', '#f39c12', '#9b59b6', '#3498db', '#2ecc71', '#e84393', '#fdcb6e', '#6ab04c',
  '#eb4d4b', '#686de0', '#f0932b', '#badc58'
]

// Locale dinâmico baseado no idioma
const currentLocale = computed(() => appStore.idioma === 'pt' ? 'pt-PT' : 'en-GB')

function corPais(code) {
  if (coresMap.has(code)) return coresMap.get(code)
  const index = coresMap.size % palette.length
  const cor = palette[index]
  coresMap.set(code, cor)
  return cor
}

function getPais(code) { return props.paises.find(p => p.code === code) }

function corProgresso(p) {
  if (p === undefined || p === null) return '#aaa'
  if (p >= 80) return '#1a7a4a'
  if (p >= 40) return '#e6a817'
  if (p === 0) return '#aaa'
  return '#931b18'
}

function getCode(d) {
  const propsGeo = d.properties
  if (propsGeo.ISO2) return propsGeo.ISO2
  if (propsGeo.iso_a2) return propsGeo.iso_a2
  if (propsGeo.ADM0_A3) return propsGeo.ADM0_A3.slice(0,2)
  if (propsGeo.ADM0_A3_IS) return propsGeo.ADM0_A3_IS.slice(0,2)
  console.warn('Código de país não identificado para feature:', propsGeo)
  return ''
}

function formatMoneyReduzido(val) {
  if (typeof val !== 'number' || isNaN(val)) return '€ 0'
  if (val >= 1e9) return `€ ${(val / 1e9).toFixed(1)}B`
  if (val >= 1e6) return `€ ${(val / 1e6).toFixed(1)}M`
  if (val >= 1e3) {
    const thousands = val / 1e3
    const suffix = appStore.idioma === 'pt' ? 'mil' : 'k'
    return `€ ${thousands.toFixed(0)} ${suffix}`
  }
  return `€ ${Math.round(val).toLocaleString(currentLocale.value)}`
}

// Percentagem de marcos concluídos
const percentagemPorPais = computed(() => {
  const result = {}
  for (const [code, stats] of Object.entries(props.marcosStatsPorPais)) {
    if (!stats || stats.total === 0) result[code] = 0
    else result[code] = Math.round((stats.concluidos / stats.total) * 100)
  }
  return result
})

const totalMarcosReal = computed(() => {
  let total = 0
  for (const stats of Object.values(props.marcosStatsPorPais)) total += stats?.total || 0
  return total
})

const totalConcluidosReal = computed(() => {
  let total = 0
  for (const stats of Object.values(props.marcosStatsPorPais)) total += stats?.concluidos || 0
  return total
})

// Funções de destaque e tooltip
function destacarPaisLegenda(code) {
  const pathEl = pathsMap.get(code)
  if (!pathEl) return
  try {
    const cor = corPais(code)
    d3.select(pathEl)
      .raise()
      .transition().duration(150)
      .attr('stroke-width', 3)
      .style('filter', `drop-shadow(0 0 10px ${cor}cc) drop-shadow(0 0 4px ${cor})`)

    const centroid = centroidsMap.get(code)
    if (centroid && svgRef.value) {
      const rect = svgRef.value.getBoundingClientRect()
      const tooltipWidth = 260, tooltipHeight = 200
      let tx = centroid[0] + rect.right + 10
      let ty = centroid[1] + rect.top + 20
      if (tx + tooltipWidth > rect.width) tx = centroid[0] + rect.left - tooltipWidth - 10
      if (tx < 0) tx = 8
      if (ty + tooltipHeight > rect.height) ty = rect.height - tooltipHeight - 10
      if (ty < 0) ty = 8
      const pais = getPais(code)
      if (pais) tooltip.value = { visivel: true, x: tx, y: ty, pais: { ...pais, code } }
    }
  } catch (err) {
    console.error('Erro em destacarPaisLegenda:', err)
  }
}

function removerDestaqueLegenda(code) {
  const pathEl = pathsMap.get(code)
  if (!pathEl) return
  try {
    d3.select(pathEl)
      .transition().duration(200)
      .attr('stroke-width', 1.8)
      .style('filter', 'url(#f-sombra)')
    tooltip.value.visivel = false
  } catch (err) {
    console.error('Erro em removerDestaqueLegenda:', err)
  }
}

// Carregamento do GeoJSON
async function carregarGeoJson() {
  erroGeoJson.value = false
  carregando.value = true
  try {
    const res = await fetch('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    geoData = await res.json()
    projection = d3.geoMercator().center([15, 54]).scale(600).translate([W/2, H/2])
    pathGen = d3.geoPath().projection(projection)
    desenharMapa()
  } catch (err) {
    console.error('Erro ao carregar GeoJSON:', err)
    erroGeoJson.value = true
  } finally {
    carregando.value = false
  }
}

function desenharMapa() {
  if (!geoData || !gRef.value || !pathGen) return
  try {
    const g = d3.select(gRef.value)
    const labels = d3.select(labelsRef.value)
    const pulses = d3.select(pulsesRef.value)
    g.selectAll('*').remove()
    labels.selectAll('*').remove()
    pulses.selectAll('*').remove()
    pathsMap.clear()
    centroidsMap.clear()

    const paisesMap = new Map(props.paises.map(p => [p.code, p]))
    const codigosExistentes = new Set(paisesMap.keys())
    const featuresAll = geoData.features
    const neutros = featuresAll.filter(d => !codigosExistentes.has(getCode(d)))
    const participantes = featuresAll.filter(d => codigosExistentes.has(getCode(d)))

    // Desenha países neutros (cinzentos)
    g.selectAll('path.neutro')
      .data(neutros)
      .enter().append('path')
      .attr('class', 'neutro')
      .attr('d', pathGen)
      .attr('fill', '#e2e8f0')
      .attr('stroke', 'white').attr('stroke-width', 0.7)
      .attr('opacity', 0)
      .transition().duration(500).delay((d, i) => i * 6)
      .attr('opacity', 1)

    // Desenha países participantes (com cores)
    g.selectAll('path.participante')
      .data(participantes)
      .enter().append('path')
      .attr('class', 'participante')
      .attr('d', pathGen)
      .attr('fill', d => corPais(getCode(d)))
      .attr('stroke', 'white').attr('stroke-width', 1.8)
      .attr('filter', 'url(#f-sombra)')
      .attr('opacity', 0)
      .style('cursor', 'pointer')
      .transition().duration(700).delay((d, i) => 200 + i * 100)
      .attr('opacity', 1)
      .each(function(d) {
        const code = getCode(d)
        if (codigosExistentes.has(code)) {
          pathsMap.set(code, this)
          const centroid = pathGen.centroid(d)
          if (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) centroidsMap.set(code, centroid)
        }
      })

    // Eventos do mouse (com try/catch)
    setTimeout(() => {
      g.selectAll('path.participante')
        .on('mouseover', function(event, d) {
          try {
            const code = getCode(d)
            const pais = getPais(code)
            if (!pais) return
            const cor = corPais(code)
            d3.select(this).raise()
              .transition().duration(150)
              .attr('stroke-width', 3)
              .style('filter', `drop-shadow(0 0 10px ${cor}cc) drop-shadow(0 0 4px ${cor})`)

            const rect = svgRef.value.getBoundingClientRect()
            const tooltipWidth = 260, tooltipHeight = 200
            let tx = event.clientX - rect.left + 18
            let ty = event.clientY - rect.top - 120
            if (tx + tooltipWidth > rect.width) tx = event.clientX - rect.left - tooltipWidth - 18
            if (tx < 0) tx = 8
            if (ty < 0) ty = event.clientY - rect.top + 20
            if (ty + tooltipHeight > rect.height) ty = event.clientY - rect.top - tooltipHeight - 20
            if (ty < 0) ty = 8
            tooltip.value = { visivel: true, x: tx, y: ty, pais: { ...pais, code } }
          } catch (err) { console.error('mouseover error:', err) }
        })
        .on('mousemove', function(event) {
          try {
            const rect = svgRef.value.getBoundingClientRect()
            const tooltipWidth = 260, tooltipHeight = 200
            let tx = event.clientX - rect.left + 18
            let ty = event.clientY - rect.top - 120
            if (tx + tooltipWidth > rect.width) tx = event.clientX - rect.left - tooltipWidth - 18
            if (tx < 0) tx = 8
            if (ty < 0) ty = event.clientY - rect.top + 20
            if (ty + tooltipHeight > rect.height) ty = event.clientY - rect.top - tooltipHeight - 20
            if (ty < 0) ty = 8
            tooltip.value.x = tx
            tooltip.value.y = ty
          } catch (err) { console.error('mousemove error:', err) }
        })
        .on('mouseout', function() {
          try {
            d3.select(this).transition().duration(200)
              .attr('stroke-width', 1.8)
              .style('filter', 'url(#f-sombra)')
            tooltip.value.visivel = false
          } catch (err) { console.error('mouseout error:', err) }
        })
        .on('click', function(event, d) { router.push('/paises/' + getCode(d)) })
    }, 1200)

    // Animação de pulsos e bandeiras
    participantes.forEach((d, i) => {
      const code = getCode(d)
      const pais = getPais(code)
      if (!pais) return
      const c = pathGen.centroid(d)
      if (!c || isNaN(c[0]) || isNaN(c[1])) return
      const cor = corPais(code)

      pulses.append('circle')
        .attr('cx', c[0]).attr('cy', c[1])
        .attr('r', 12).attr('fill', 'none')
        .attr('stroke', cor).attr('stroke-width', 1.5)
        .attr('opacity', 0)
        .attr('class', `pr-${code}`)

      labels.append('circle')
        .attr('cx', c[0]).attr('cy', c[1])
        .attr('r', 13)
        .attr('fill', 'white').attr('fill-opacity', 0.95)
        .attr('stroke', cor).attr('stroke-width', 2.5)
        .attr('opacity', 0)
        .attr('pointer-events', 'none')
        .transition().duration(400).delay(400 + i * 100)
        .attr('opacity', 1)

      const fo = labels.append('foreignObject')
        .attr('x', c[0] - 11).attr('y', c[1] - 11)
        .attr('width', 22).attr('height', 22)
        .attr('pointer-events', 'none')
        .attr('opacity', 0)

      fo.append('xhtml:div')
        .style('width', '22px').style('height', '22px')
        .style('display', 'flex').style('align-items', 'center').style('justify-content', 'center')
        .style('font-size', '13px').style('line-height', '1')
        .text(pais.bandeira)

      fo.transition().duration(400).delay(500 + i * 100).attr('opacity', 1)
    })

    function pulse(code) {
      const el = pulses.select(`.pr-${code}`)
      if (el.empty()) return
      el.attr('r', 12).attr('opacity', 0.7)
        .transition().duration(1600).ease(d3.easeLinear)
        .attr('r', 30).attr('opacity', 0)
        .on('end', () => pulse(code))
    }
    setTimeout(() => {
      Array.from(codigosExistentes).forEach((c, idx) => setTimeout(() => pulse(c), idx * 200))
    }, 1400)

  } catch (err) {
    console.error('Erro ao desenhar o mapa:', err)
    erroGeoJson.value = true
  }
}

onMounted(() => {
  setTimeout(() => { tituloVisible.value = true }, 100)
  carregarGeoJson()
})

watch(() => props.paises, () => { if (geoData && !erroGeoJson.value) desenharMapa() }, { deep: true })
</script>

<style scoped>
/* ESTILOS ORIGINAIS MANTIDOS EXACTAMENTE IGUAIS */
.mapa-wrapper { background: #f5f5f7; padding: 0; }
.mapa-inner { padding: 50px 10%; }
.mapa-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 20px; opacity: 0; transform: translateY(-16px); transition: all 0.7s ease; }
.mapa-header.animate-in { opacity: 1; transform: translateY(0); }
.mapa-header h2 { font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
.mapa-header p { font-size: 0.85rem; color: #aaa; }
.mapa-header-stats { display: flex; gap: 10px; flex-wrap: wrap; }
.mhs { display: flex; flex-direction: column; align-items: center; background: white; border: 1.5px solid #f0f0f0; border-radius: 12px; padding: 10px 16px; min-width: 70px; transition: all 0.2s; }
.mhs:hover { border-color: #931b18; transform: translateY(-2px); }
.mhs span { font-size: 1.1rem; font-weight: 900; color: #1a1a1a; }
.mhs { font-size: 0.65rem; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em; }
.mhs.verde span { color: #1a7a4a; }
.mhs.dourado span { color: #c49a28; }
.mapa-svg-wrap { position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.12); border: 2px solid #e8eaf0; }
.mapa-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 460px; gap: 12px; color: #aaa; background: #f8f9fb; font-size: 0.88rem; }
.spinner { width: 32px; height: 32px; border: 3px solid #f0f0f0; border-top-color: #931b18; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.btn-retry { background: #931b18; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; margin-top: 8px; transition: background 0.2s; }
.btn-retry:hover { background: #6b1210; }
.mapa-svg { width: 100%; height: auto; display: block; }
.tooltip { position: absolute; background: white; border-radius: 16px; box-shadow: 0 12px 40px rgba(0,0,0,0.2); min-width: 260px; pointer-events: none; z-index: 100; overflow: hidden; }
.tt-anim-enter-active { transition: all 0.18s cubic-bezier(0.34,1.4,0.64,1); }
.tt-anim-leave-active { transition: all 0.1s ease; }
.tt-anim-enter-from { opacity: 0; transform: translateY(8px) scale(0.95); }
.tt-anim-leave-to { opacity: 0; }
.tt-top { padding: 14px 16px; display: flex; align-items: center; gap: 12px; }
.tt-flag { font-size: 2rem; filter: drop-shadow(0 1px 3px rgba(0,0,0,0.2)); }
.tt-nome { font-size: 1rem; font-weight: 800; color: white; }
.tt-sub { font-size: 0.72rem; color: rgba(255,255,255,0.75); margin-top: 2px; }
.tt-body { padding: 12px 16px; }
.tt-fundos { background: #fdf2f2; color: #931b18; font-size: 0.78rem; font-weight: 700; padding: 5px 10px; border-radius: 8px; margin-bottom: 10px; }
.tt-desembolso, .tt-proxima { font-size: 0.78rem; margin-bottom: 8px; color: #444; display: flex; justify-content: space-between; }
.tt-desembolso strong, .tt-proxima strong { color: #1a1a1a; }
.tt-stats { display: flex; border: 1px solid #f0f0f0; border-radius: 10px; overflow: hidden; margin-bottom: 8px; }
.ts { flex: 1; text-align: center; padding: 8px 4px; border-right: 1px solid #f0f0f0; }
.ts:last-child { border-right: none; }
.ts strong { display: block; font-size: 0.95rem; font-weight: 800; }
.ts span { font-size: 0.62rem; color: #aaa; text-transform: uppercase; letter-spacing: 0.04em; }
.tt-bar-bg { height: 5px; background: #f0f0f0; border-radius: 99px; overflow: hidden; margin-bottom: 8px; }
.tt-progress-label { font-size: 0.7rem; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; }
.tt-bar-fill { height: 100%; border-radius: 99px; }
.tt-cta { font-size: 0.75rem; color: #931b18; font-weight: 700; text-align: right; }
.legenda { display: flex; gap: 8px; justify-content: center; margin-top: 18px; flex-wrap: wrap; }
.leg-item { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #444; font-weight: 600; background: white; border: 1.5px solid #f0f0f0; padding: 7px 14px; border-radius: 99px; cursor: pointer; transition: all 0.2s; }
.leg-item:hover { border-color: #931b18; color: #931b18; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(147,27,24,0.12); }
.leg-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.leg-prog { font-weight: 800; font-size: 0.76rem; margin-left: 2px; }
</style>