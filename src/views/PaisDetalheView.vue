<template>
  <div class="detalhe-container">

    <!-- LOADING -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>A carregar dados do país...</p>
    </div>

    <!-- ERRO -->
    <div v-if="erro" class="erro-state">
      <span>⚠️</span><p>{{ erro }}</p>
    </div>

    <template v-if="pais && !loading">

      <!-- HERO -->
      <section class="hero" :style="{ backgroundImage: `url(${pais.imagem})` }">
        <div class="hero-overlay">
          <div class="hero-left" :class="{ 'animate-in': heroVisible }">
            <RouterLink to="/paises" class="btn-voltar">← Todos os Países</RouterLink>
            <div class="hero-bandeira">{{ pais.bandeira }}</div>
            <h1>{{ pais.nome }}</h1>
            <p>🏛️ {{ pais.capital }} · 👥 {{ pais.populacao }}</p>
            <div class="hero-fundos">💶 {{ pais.totalFundos }} alocados</div>
          </div>
          <div class="hero-stats" :class="{ 'animate-in': heroVisible }">
            <div class="hsc">
              <span class="hsc-icon">🎯</span>
              <span class="hsc-val">{{ pais.marcosTotal }}</span>
              <span class="hsc-label">Marcos Totais</span>
            </div>
            <div class="hsc verde">
              <span class="hsc-icon">✅</span>
              <span class="hsc-val">{{ pais.marcosConcluidos }}</span>
              <span class="hsc-label">Concluídos</span>
            </div>
            <div class="hsc amarelo">
              <span class="hsc-icon">⏳</span>
              <span class="hsc-val">{{ pais.marcosTotal - pais.marcosConcluidos }}</span>
              <span class="hsc-label">Em Curso</span>
            </div>
            <div class="hsc azul">
              <span class="hsc-icon">📊</span>
              <span class="hsc-val">{{ pais.progresso }}%</span>
              <span class="hsc-label">Progresso</span>
            </div>
          </div>
        </div>
      </section>

      <!-- BARRA DE PROGRESSO GLOBAL -->
      <section class="progresso-global">
        <div class="pg-inner">
          <div class="pg-info">
            <span>Progresso geral de execução do PRR em {{ pais.nome }}</span>
            <strong :style="{ color: corProgresso(pais.progresso) }">{{ pais.progresso }}%</strong>
          </div>
          <div class="pg-bar-bg">
            <div class="pg-bar-fill" :style="{ width: pais.progresso + '%', background: corProgresso(pais.progresso) }"></div>
          </div>
        </div>
      </section>

      <!-- MARCOS DESTE PAÍS -->
      <section class="marcos-section">
        <div class="section-header">
          <div>
            <h2>Marcos e Metas</h2>
            <p class="section-sub">{{ marcos.length }} marcos registados para {{ pais.nome }}</p>
          </div>
          <RouterLink to="/marcos" class="btn-ver-todos">Ver todos os marcos →</RouterLink>
        </div>

        <div v-if="marcos.length === 0" class="empty-state">
          <span class="empty-icon">📋</span>
          <h3>Sem marcos registados</h3>
          <p>Não existem marcos registados para este país.</p>
        </div>

        <div v-else class="marcos-grid">
          <div v-for="marco in marcos" :key="marco.id" class="marco-card">
            <div class="marco-img-wrap">
              <img :src="marco.imagem" :alt="marco.titulo" class="marco-img" />
              <div class="marco-overlay"></div>
              <div class="marco-pills">
                <span class="setor-pill">{{ marco.setorLabel }}</span>
                <span :class="['estado-pill', marco.estado]">{{ estadoLabel(marco.estado) }}</span>
              </div>
            </div>
            <div class="marco-body">
              <h3>{{ marco.titulo }}</h3>
              <p>{{ marco.descricao }}</p>
              <div class="marco-meta">📅 {{ marco.prazo }} · 💶 {{ marco.investimento }}</div>
              <div class="progresso-wrap">
                <div class="progresso-header">
                  <span>Progresso</span>
                  <strong :style="{ color: corProgresso(marco.progresso) }">{{ marco.progresso }}%</strong>
                </div>
                <div class="prog-bg">
                  <div class="prog-fill" :style="{ width: marco.progresso + '%', background: corProgresso(marco.progresso) }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DESEMBOLSOS DESTE PAÍS -->
      <section class="desembolsos-section" v-if="desembolsos.length > 0">
        <div class="section-header">
          <div>
            <h2>Histórico de Desembolsos</h2>
            <p class="section-sub">Pagamentos efetuados pela EU a {{ pais.nome }}</p>
          </div>
        </div>
        <div class="tabela-wrap">
          <table class="tabela">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipologia</th>
                <th>Descrição</th>
                <th>Montante</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in desembolsos" :key="d.id">
                <td>{{ new Date(d.data).toLocaleDateString('pt-PT') }}</td>
                <td><span class="tipo-badge">{{ d.tipologia }}</span></td>
                <td>{{ d.descricao }}</td>
                <td class="montante">{{ formatarMontante(d.montante) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- BOTÕES DE AÇÃO -->
      <section class="acoes-section">
        <RouterLink to="/paises" class="btn-acao-outline">← Voltar aos Países</RouterLink>
        <RouterLink to="/paises/comparar" class="btn-acao-primary">⚖️ Comparar com outro país</RouterLink>
        <RouterLink to="/marcos" class="btn-acao-outline">🎯 Ver todos os marcos</RouterLink>
      </section>

    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPaisByCode, getMarcosByPais, getDesembolsosByPais } from '@/services/api.js'

const route = useRoute()
const pais = ref(null)
const marcos = ref([])
const desembolsos = ref([])
const loading = ref(true)
const erro = ref(null)
const heroVisible = ref(false)

function corProgresso(p) {
  if (p >= 80) return '#1a7a4a'
  if (p >= 40) return '#e6a817'
  if (p === 0) return '#aaa'
  return '#931b18'
}

function estadoLabel(e) {
  return e === 'concluido' ? '✅ Concluído' : e === 'em_curso' ? '⏳ Em curso' : '⚠️ Em atraso'
}

function formatarMontante(v) {
  return '€' + (v / 1000000000).toFixed(1) + 'B'
}

onMounted(async () => {
  try {
    const code = route.params.id
    const [paisData, marcosData, desembolsosData] = await Promise.all([
      getPaisByCode(code),
      getMarcosByPais(code),
      getDesembolsosByPais(code),
    ])
    if (!paisData) { erro.value = 'País não encontrado.'; return }
    pais.value = paisData
    marcos.value = marcosData
    desembolsos.value = desembolsosData
  } catch (e) {
    erro.value = 'Não foi possível carregar os dados do país.'
  } finally {
    loading.value = false
  }
  setTimeout(() => { heroVisible.value = true }, 100)
})
</script>

<style scoped>
.detalhe-container { margin: -2rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow-x: auto; }

.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; gap: 16px; color: #888; }
.loading-spinner { width: 40px; height: 40px; border: 3px solid #f0f0f0; border-top-color: #931b18; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.erro-state { background: #fdf2f2; border: 1px solid #f8d7da; border-radius: 16px; padding: 20px 30px; margin: 20px 10%; display: flex; align-items: center; gap: 12px; color: #721c24; }

/* HERO */
.hero { background-size: cover; background-position: center; background-attachment: fixed; min-height: 65vh; }
.hero-overlay { background: linear-gradient(135deg, rgba(14,30,80,0.95) 0%, rgba(26,58,107,0.88) 100%); min-height: 65vh; display: flex; align-items: center; justify-content: space-between; padding: 60px 10%; gap: 50px; flex-wrap: wrap; }
.hero-left { flex: 1; min-width: 300px; opacity: 0; transform: translateX(-40px); transition: all 0.8s ease; }
.hero-left.animate-in { opacity: 1; transform: translateX(0); }
.hero-stats { opacity: 0; transform: translateX(40px); transition: all 0.8s ease 0.3s; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.hero-stats.animate-in { opacity: 1; transform: translateX(0); }
.btn-voltar { display: inline-block; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px; transition: color 0.2s; }
.btn-voltar:hover { color: white; }
.hero-bandeira { font-size: 4rem; margin-bottom: 10px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3)); }
.hero-left h1 { font-size: 3.5rem; font-weight: 900; color: white; margin-bottom: 10px; line-height: 1; }
.hero-left p { font-size: 0.95rem; color: rgba(255,255,255,0.75); margin-bottom: 16px; }
.hero-fundos { display: inline-block; background: rgba(212,175,55,0.2); border: 1px solid rgba(212,175,55,0.6); color: #d4af37; padding: 8px 18px; border-radius: 99px; font-size: 0.88rem; font-weight: 700; }
.hsc { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 22px 18px; text-align: center; backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 120px; transition: transform 0.3s; }
.hsc:hover { transform: translateY(-4px); }
.hsc.verde { border-color: rgba(26,122,74,0.4); }
.hsc.amarelo { border-color: rgba(230,168,23,0.4); }
.hsc.azul { border-color: rgba(46,107,191,0.4); }
.hsc-icon { font-size: 1.5rem; }
.hsc-val { font-size: 2rem; font-weight: 900; color: #d4af37; line-height: 1; }
.hsc-label { font-size: 0.7rem; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.06em; }

/* PROGRESSO GLOBAL */
.progresso-global { background: white; padding: 20px 10%; border-bottom: 1px solid #f0f0f0; }
.pg-inner { max-width: 100%; }
.pg-info { display: flex; justify-content: space-between; font-size: 0.85rem; color: #666; margin-bottom: 8px; }
.pg-bar-bg { height: 10px; background: #f0f0f0; border-radius: 99px; overflow: hidden; }
.pg-bar-fill { height: 100%; border-radius: 99px; transition: width 1s ease; }

/* MARCOS */
.marcos-section { padding: 50px 10%; background: #f5f5f7; }
.section-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; flex-wrap: wrap; gap: 12px; }
.section-header h2 { font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
.section-sub { font-size: 0.88rem; color: #aaa; }
.btn-ver-todos { background: #931b18; color: white; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; transition: all 0.2s; }
.btn-ver-todos:hover { background: #6b1210; transform: translateY(-2px); }

.empty-state { text-align: center; padding: 60px; background: white; border-radius: 20px; }
.empty-icon { font-size: 3rem; display: block; margin-bottom: 15px; }
.empty-state h3 { font-size: 1.2rem; color: #333; margin-bottom: 8px; }
.empty-state p { color: #888; }

.marcos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 22px; }
.marco-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); transition: transform 0.3s, box-shadow 0.3s; }
.marco-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
.marco-img-wrap { position: relative; height: 160px; overflow: hidden; }
.marco-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.marco-card:hover .marco-img { transform: scale(1.08); }
.marco-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%); }
.marco-pills { position: absolute; bottom: 10px; left: 10px; right: 10px; display: flex; justify-content: space-between; }
.setor-pill { font-size: 0.7rem; font-weight: 700; color: white; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.3); padding: 3px 9px; border-radius: 99px; }
.estado-pill { font-size: 0.7rem; font-weight: 700; padding: 3px 9px; border-radius: 99px; }
.estado-pill.concluido { background: rgba(26,122,74,0.9); color: white; }
.estado-pill.em_curso { background: rgba(230,168,23,0.9); color: white; }
.estado-pill.em_atraso { background: rgba(147,27,24,0.9); color: white; }
.marco-body { padding: 18px 20px; }
.marco-body h3 { font-size: 0.95rem; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; line-height: 1.4; }
.marco-body p { font-size: 0.8rem; color: #888; line-height: 1.5; margin-bottom: 10px; }
.marco-meta { font-size: 0.78rem; color: #666; margin-bottom: 12px; }
.progresso-wrap { }
.progresso-header { display: flex; justify-content: space-between; font-size: 0.74rem; color: #aaa; margin-bottom: 5px; }
.prog-bg { height: 6px; background: #f0f0f0; border-radius: 99px; overflow: hidden; }
.prog-fill { height: 100%; border-radius: 99px; transition: width 0.8s ease; }

/* DESEMBOLSOS */
.desembolsos-section { padding: 50px 10%; background: white; }
.tabela-wrap { overflow-x: auto; border-radius: 16px; border: 1px solid #f0f0f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.tabela { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
.tabela thead tr { background: linear-gradient(135deg, #0e1e50, #2e6bbf); }
.tabela th { padding: 14px 18px; text-align: left; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: white; }
.tabela tbody tr { border-bottom: 1px solid #f5f5f5; transition: background 0.15s; }
.tabela tbody tr:hover { background: #f0f5ff; }
.tabela td { padding: 14px 18px; color: #555; }
.tipo-badge { background: #e6f1fb; color: #2e6bbf; font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 99px; }
.montante { font-weight: 700; color: #1a7a4a; font-size: 0.95rem; }

/* AÇÕES */
.acoes-section { padding: 40px 10%; background: #f5f5f7; display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
.btn-acao-primary { background: #2e6bbf; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 0.92rem; transition: all 0.2s; }
.btn-acao-primary:hover { background: #1a4e9a; transform: translateY(-2px); }
.btn-acao-outline { background: white; color: #333; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 0.92rem; border: 1.5px solid #e0e0e0; transition: all 0.2s; }
.btn-acao-outline:hover { border-color: #2e6bbf; color: #2e6bbf; }
</style>