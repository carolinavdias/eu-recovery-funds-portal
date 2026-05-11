<template>
  <div class="mapa-wrapper">
    <div class="mapa-inner">

      <!-- CABEÇALHO -->
      <div class="mapa-header" :class="{ 'animate-in': tituloVisible }">
        <div>
          <h2>🗺️ Mapa Interativo</h2>
          <p>Passe o rato sobre um país para ver os dados · Clique para explorar em detalhe</p>
        </div>
        <div class="mapa-header-stats" v-if="paises.length">
          <div class="mhs"><span>{{ paises.length }}</span>Países</div>
          <div class="mhs"><span>{{ totalMarcos }}</span>Marcos</div>
          <div class="mhs verde"><span>{{ totalConcluidos }}</span>Concluídos</div>
          <div class="mhs dourado"><span>€750B</span>Total UE</div>
        </div>
      </div>

      <!-- MAPA -->
      <div class="mapa-svg-wrap">
        <div v-if="carregando" class="mapa-loading">
          <div class="spinner"></div>
          <span>A carregar mapa...</span>
        </div>
        <svg ref="svgRef" :viewBox="`0 0 ${W} ${H}`" class="mapa-svg" v-show="!carregando">
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
            <div class="tt-top" :style="{ background: CORES_PAISES[tooltip.pais?.code] }">
              <span class="tt-flag">{{ tooltip.pais?.bandeira }}</span>
              <div>
                <div class="tt-nome">{{ tooltip.pais?.nome }}</div>
                <div class="tt-sub">🏛️ {{ tooltip.pais?.capital }} · 👥 {{ tooltip.pais?.populacao }}</div>
              </div>
            </div>
            <div class="tt-body">
              <div class="tt-fundos">💶 {{ tooltip.pais?.totalFundos }} alocados pelo PRR</div>
              <div class="tt-stats">
                <div class="ts"><strong>{{ tooltip.pais?.marcosTotal }}</strong><span>Marcos</span></div>
                <div class="ts"><strong style="color:#1a7a4a">{{ tooltip.pais?.marcosConcluidos }}</strong><span>Concluídos</span></div>
                <div class="ts"><strong :style="{ color: corProgresso(tooltip.pais?.progresso) }">{{ tooltip.pais?.progresso }}%</strong><span>Progresso</span></div>
              </div>
              <div class="tt-bar-bg"><div class="tt-bar-fill" :style="{ width: tooltip.pais?.progresso + '%', background: corProgresso(tooltip.pais?.progresso) }"></div></div>
              <div class="tt-cta">Clique para explorar →</div>
            </div>
          </div>
        </transition>
      </div>

      <!-- LEGENDA -->
      <div class="legenda">
        <div class="leg-item" v-for="p in paises" :key="p.code" @click="router.push('/paises/' + p.code)">
          <span class="leg-dot" :style="{ background: CORES_PAISES[p.code] }"></span>
          <span>{{ p.bandeira }}</span>
          <span class="leg-nome">{{ p.nome }}</span>
          <span class="leg-prog" :style="{ color: corProgresso(p.progresso) }">{{ p.progresso }}%</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as d3 from 'd3'

const props = defineProps({ paises: { type: Array, default: () => [] } })
const router = useRouter()

const W = 900, H = 600
const svgRef = ref(null)
const gRef = ref(null)
const labelsRef = ref(null)
const pulsesRef = ref(null)
const carregando = ref(true)
const tituloVisible = ref(false)
const tooltip = ref({ visivel: false, x: 0, y: 0, pais: null })

let geoData = null, projection = null, pathGen = null

const PARTICIPANTES = ['PT','ES','FR','IT','DE','GR','HR','RO']
const CORES_PAISES = {
  PT: '#c0392b', ES: '#d35400',
  FR: '#1a5276', IT: '#1e8449',
  DE: '#6c3483', GR: '#b7144e',
  HR: '#b7950b', RO: '#7d6608',
}

const totalMarcos = computed(() => props.paises.reduce((a, p) => a + p.marcosTotal, 0))
const totalConcluidos = computed(() => props.paises.reduce((a, p) => a + p.marcosConcluidos, 0))

function getPais(code) { return props.paises.find(p => p.code === code) }
function corProgresso(p) {
  if (!p && p !== 0) return '#aaa'
  if (p >= 80) return '#1a7a4a'
  if (p >= 40) return '#e6a817'
  if (p === 0) return '#aaa'
  return '#931b18'
}
function getCode(d) {
  return d.properties.ISO2 || d.properties.iso_a2 || d.properties.ADM0_A3?.slice(0,2) || ''
}

function desenharMapa() {
  if (!geoData || !gRef.value) return
  const g = d3.select(gRef.value)
  const labels = d3.select(labelsRef.value)
  const pulses = d3.select(pulsesRef.value)
  g.selectAll('*').remove()
  labels.selectAll('*').remove()
  pulses.selectAll('*').remove()

  // Países neutros
  g.selectAll('path.neutro')
    .data(geoData.features.filter(d => !PARTICIPANTES.includes(getCode(d))))
    .enter().append('path')
    .attr('class', 'neutro')
    .attr('d', pathGen)
    .attr('fill', '#e2e8f0')
    .attr('stroke', 'white').attr('stroke-width', 0.7)
    .attr('opacity', 0)
    .transition().duration(500).delay((d, i) => i * 6)
    .attr('opacity', 1)

  // Países participantes
  const partFeatures = geoData.features.filter(d => PARTICIPANTES.includes(getCode(d)))

  g.selectAll('path.participante')
    .data(partFeatures)
    .enter().append('path')
    .attr('class', 'participante')
    .attr('d', pathGen)
    .attr('fill', d => CORES_PAISES[getCode(d)] || '#999')
    .attr('stroke', 'white').attr('stroke-width', 1.8)
    .attr('filter', 'url(#f-sombra)')
    .attr('opacity', 0)
    .style('cursor', 'pointer')
    .transition().duration(700).delay((d, i) => 200 + i * 100)
    .attr('opacity', 1)

  setTimeout(() => {
    g.selectAll('path.participante')
      .on('mouseover', function(event, d) {
        const code = getCode(d)
        const pais = getPais(code)
        if (!pais) return
        d3.select(this).raise()
          .transition().duration(150)
          .attr('stroke-width', 3)
          .style('filter', `drop-shadow(0 0 10px ${CORES_PAISES[code]}cc) drop-shadow(0 0 4px ${CORES_PAISES[code]})`)

        const rect = svgRef.value.getBoundingClientRect()
        let tx = event.clientX - rect.left + 18
        let ty = event.clientY - rect.top - 120
        if (tx + 260 > rect.width) tx = event.clientX - rect.left - 278
        if (ty < 0) ty = 8
        tooltip.value = { visivel: true, x: tx, y: ty, pais: { ...pais, code } }
      })
      .on('mousemove', function(event) {
        const rect = svgRef.value.getBoundingClientRect()
        let tx = event.clientX - rect.left + 18
        let ty = event.clientY - rect.top - 120
        if (tx + 260 > rect.width) tx = event.clientX - rect.left - 278
        if (ty < 0) ty = 8
        tooltip.value.x = tx
        tooltip.value.y = ty
      })
      .on('mouseout', function() {
        d3.select(this).transition().duration(200)
          .attr('stroke-width', 1.8)
          .style('filter', 'url(#f-sombra)')
        tooltip.value.visivel = false
      })
      .on('click', function(event, d) { router.push('/paises/' + getCode(d)) })
  }, 1200)

  // Bandeiras centradas + pulsos
  partFeatures.forEach((d, i) => {
    const code = getCode(d)
    const pais = getPais(code)
    if (!pais) return
    const c = pathGen.centroid(d)
    if (!c || isNaN(c[0])) return
    const cor = CORES_PAISES[code]

    // Pulso externo
    pulses.append('circle')
      .attr('cx', c[0]).attr('cy', c[1])
      .attr('r', 12).attr('fill', 'none')
      .attr('stroke', cor).attr('stroke-width', 1.5)
      .attr('opacity', 0)
      .attr('class', `pr-${code}`)

    // Círculo branco
    labels.append('circle')
      .attr('cx', c[0]).attr('cy', c[1])
      .attr('r', 13)
      .attr('fill', 'white').attr('fill-opacity', 0.95)
      .attr('stroke', cor).attr('stroke-width', 2.5)
      .attr('opacity', 0)
      .attr('pointer-events', 'none')
      .transition().duration(400).delay(400 + i * 100)
      .attr('opacity', 1)

    // Emoji bandeira — usar foreignObject para melhor alinhamento
    const fo = labels.append('foreignObject')
      .attr('x', c[0] - 11)
      .attr('y', c[1] - 11)
      .attr('width', 22)
      .attr('height', 22)
      .attr('pointer-events', 'none')
      .attr('opacity', 0)

    fo.append('xhtml:div')
      .style('width', '22px').style('height', '22px')
      .style('display', 'flex').style('align-items', 'center').style('justify-content', 'center')
      .style('font-size', '13px').style('line-height', '1')
      .text(pais.bandeira)

    fo.transition().duration(400).delay(500 + i * 100).attr('opacity', 1)
  })

  // Animação de pulse
  function pulse(code) {
    const el = pulses.select(`.pr-${code}`)
    if (el.empty()) return
    el.attr('r', 12).attr('opacity', 0.7)
      .transition().duration(1600).ease(d3.easeLinear)
      .attr('r', 30).attr('opacity', 0)
      .on('end', () => pulse(code))
  }
  setTimeout(() => PARTICIPANTES.forEach((c, i) => setTimeout(() => pulse(c), i * 200)), 1400)
}

onMounted(async () => {
  setTimeout(() => { tituloVisible.value = true }, 100)
  try {
    const res = await fetch('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson')
    geoData = await res.json()
    projection = d3.geoMercator().center([15, 54]).scale(600).translate([W/2, H/2])
    pathGen = d3.geoPath().projection(projection)
    carregando.value = false
    desenharMapa()
  } catch(e) { carregando.value = false }
})

watch(() => props.paises, () => { if (geoData) desenharMapa() }, { deep: true })
</script>

<style scoped>
.mapa-wrapper {
  background: #f5f5f7;
  padding: 0;
}
.mapa-inner {
  padding: 50px 10%;
}

/* CABEÇALHO */
.mapa-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 28px; flex-wrap: wrap; gap: 20px;
  opacity: 0; transform: translateY(-16px);
  transition: all 0.7s ease;
}
.mapa-header.animate-in { opacity: 1; transform: translateY(0); }
.mapa-header h2 { font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
.mapa-header p { font-size: 0.85rem; color: #aaa; }
.mapa-header-stats { display: flex; gap: 10px; flex-wrap: wrap; }
.mhs {
  display: flex; flex-direction: column; align-items: center;
  background: white; border: 1.5px solid #f0f0f0;
  border-radius: 12px; padding: 10px 16px; min-width: 70px;
  transition: all 0.2s;
}
.mhs:hover { border-color: #931b18; transform: translateY(-2px); }
.mhs span { font-size: 1.1rem; font-weight: 900; color: #1a1a1a; }
.mhs { font-size: 0.65rem; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em; }
.mhs.verde span { color: #1a7a4a; }
.mhs.dourado span { color: #c49a28; }

/* MAPA */
.mapa-svg-wrap {
  position: relative;
  border-radius: 20px; overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
  border: 2px solid #e8eaf0;
}
.mapa-loading {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 460px; gap: 12px;
  color: #aaa; background: #f8f9fb; font-size: 0.88rem;
}
.spinner { width: 32px; height: 32px; border: 3px solid #f0f0f0; border-top-color: #931b18; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.mapa-svg { width: 100%; height: auto; display: block; }

/* TOOLTIP */
.tooltip {
  position: absolute; background: white; border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2); min-width: 240px;
  pointer-events: none; z-index: 100; overflow: hidden;
}
.tt-anim-enter-active { transition: all 0.18s cubic-bezier(0.34,1.4,0.64,1); }
.tt-anim-leave-active { transition: all 0.1s ease; }
.tt-anim-enter-from { opacity: 0; transform: translateY(8px) scale(0.95); }
.tt-anim-leave-to { opacity: 0; }

.tt-top {
  padding: 14px 16px; display: flex; align-items: center; gap: 12px;
}
.tt-flag { font-size: 2rem; filter: drop-shadow(0 1px 3px rgba(0,0,0,0.2)); }
.tt-nome { font-size: 1rem; font-weight: 800; color: white; }
.tt-sub { font-size: 0.72rem; color: rgba(255,255,255,0.75); margin-top: 2px; }
.tt-body { padding: 12px 16px; }
.tt-fundos { background: #fdf2f2; color: #931b18; font-size: 0.78rem; font-weight: 700; padding: 5px 10px; border-radius: 8px; margin-bottom: 10px; }
.tt-stats { display: flex; border: 1px solid #f0f0f0; border-radius: 10px; overflow: hidden; margin-bottom: 8px; }
.ts { flex: 1; text-align: center; padding: 8px 4px; border-right: 1px solid #f0f0f0; }
.ts:last-child { border-right: none; }
.ts strong { display: block; font-size: 0.95rem; font-weight: 800; }
.ts span { font-size: 0.62rem; color: #aaa; text-transform: uppercase; letter-spacing: 0.04em; }
.tt-bar-bg { height: 5px; background: #f0f0f0; border-radius: 99px; overflow: hidden; margin-bottom: 8px; }
.tt-bar-fill { height: 100%; border-radius: 99px; }
.tt-cta { font-size: 0.75rem; color: #931b18; font-weight: 700; text-align: right; }

/* LEGENDA */
.legenda { display: flex; gap: 8px; justify-content: center; margin-top: 18px; flex-wrap: wrap; }
.leg-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.8rem; color: #444; font-weight: 600;
  background: white; border: 1.5px solid #f0f0f0;
  padding: 7px 14px; border-radius: 99px;
  cursor: pointer; transition: all 0.2s;
}
.leg-item:hover { border-color: #931b18; color: #931b18; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(147,27,24,0.12); }
.leg-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.leg-nome { }
.leg-prog { font-weight: 800; font-size: 0.76rem; margin-left: 2px; }
</style>