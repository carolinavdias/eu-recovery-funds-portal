<template>
  <div class="faq-container">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-overlay">
        <div class="hero-content" :class="{ 'animate-in': heroVisible }">
          <div class="hero-badge">{{ appStore.t.faq_badge }}</div>
          <h1>{{ appStore.t.faq_titulo }}<br><span class="hero-accent">{{ appStore.t.faq_accent }}</span></h1>
          <p>{{ appStore.t.faq_sub }}</p>
          <RouterLink to="/" class="btn-voltar">{{ appStore.t.faq_voltar }}</RouterLink>
        </div>
        <div class="hero-deco" :class="{ 'animate-in': heroVisible }">
          <div class="deco-circle c1"></div>
          <div class="deco-circle c2"></div>
          <div class="faq-icon">❓</div>
        </div>
      </div>
    </section>

    <!-- CONTEÚDO -->
    <section class="faq-section">
      <div class="faq-inner">

        <!-- CATEGORIAS (traduzidas) -->
        <div class="categorias">
          <button
            v-for="cat in categorias"
            :key="cat.id"
            class="cat-btn"
            :class="{ ativo: categoriaActiva === cat.id }"
            @click="categoriaActiva = cat.id"
          >
            {{ cat.icone }} {{ cat.label }}
          </button>
        </div>

        <!-- PERGUNTAS (vindas da store) -->
        <div class="faq-lista">
          <div
            v-for="item in perguntasFiltradas"
            :key="item.id"
            class="faq-item"
            :class="{ aberto: abertos.includes(item.id) }"
          >
            <button class="faq-pergunta" @click="toggle(item.id)">
              <span class="faq-q-texto">{{ item.pergunta }}</span>
              <span class="faq-chevron">{{ abertos.includes(item.id) ? '▲' : '▼' }}</span>
            </button>
            <div class="faq-resposta" v-show="abertos.includes(item.id)">
              <p v-for="(linha, j) in item.resposta" :key="j">{{ linha }}</p>
              <RouterLink v-if="item.link" :to="item.link.rota" class="faq-link">
                {{ item.link.texto }} →
              </RouterLink>
            </div>
          </div>

          <div v-if="perguntasFiltradas.length === 0" class="faq-empty">
            <span>🔍</span>
            <p>{{ appStore.t.faq_empty_titulo }}</p>
            <p>{{ appStore.t.faq_empty_desc }}</p>
          </div>
        </div>

        <!-- CONTACTO (traduzido) -->
        <div class="contacto-card">
          <div class="contacto-icon">✉️</div>
          <div class="contacto-texto">
            <h3>{{ appStore.t.faq_contact_titulo }}</h3>
            <p>{{ appStore.t.faq_contact_desc }}</p>
          </div>
          <div class="contacto-links">
            <a href="https://recuperarportugal.gov.pt/" target="_blank" rel="noopener noreferrer" class="contacto-btn">{{ appStore.t.faq_contact_btn_prr }}</a>
            <a href="https://ec.europa.eu/economy_finance/recovery-and-resilience-scoreboard/" target="_blank" rel="noopener noreferrer" class="contacto-btn">{{ appStore.t.faq_contact_btn_scoreboard }}</a>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const heroVisible = ref(false)
const categoriaActiva = ref('geral')
const abertos = ref([])

const categorias = computed(() => [
  { id: 'geral', icone: '🌍', label: appStore.t.faq_cat_geral },
  { id: 'dados', icone: '📊', label: appStore.t.faq_cat_dados },
  { id: 'funcionalidades', icone: '⚙️', label: appStore.t.faq_cat_funcionalidades },
  { id: 'exportacao', icone: '📥', label: appStore.t.faq_cat_exportacao },
])

const perguntas = computed(() => appStore.t.faq_perguntas || [])
const perguntasFiltradas = computed(() =>
  perguntas.value.filter(p => p.categoria === categoriaActiva.value)
)

function toggle(id) {
  if (abertos.value.includes(id)) {
    abertos.value = abertos.value.filter(x => x !== id)
  } else {
    abertos.value = [...abertos.value, id]
  }
}

watch(categoriaActiva, () => {
  abertos.value = []
})

onMounted(() => {
  setTimeout(() => { heroVisible.value = true }, 100)
})
</script>

<style scoped>
/* ESTILOS ORIGINAIS – NÃO MEXIDOS */
.faq-container { margin: -2rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow-x: hidden; }

/* HERO */
.hero {
  background-image: url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 50vh;
}
.hero-overlay {
  background: linear-gradient(135deg, rgba(80,10,8,0.97) 0%, rgba(147,27,24,0.9) 100%);
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 10%;
  gap: 40px;
  flex-wrap: wrap;
}
.hero-content { flex: 1; min-width: 280px; opacity: 0; transform: translateX(-40px); transition: all 0.9s ease; }
.hero-content.animate-in { opacity: 1; transform: translateX(0); }
.hero-deco { opacity: 0; transition: all 0.9s ease 0.4s; position: relative; width: 180px; height: 180px; flex-shrink: 0; }
.hero-deco.animate-in { opacity: 1; }
.deco-circle { position: absolute; border-radius: 50%; border: 2px solid rgba(255,255,255,0.15); }
.c1 { width: 180px; height: 180px; top: 0; left: 0; animation: spin-slow 20s linear infinite; }
.c2 { width: 120px; height: 120px; top: 30px; left: 30px; animation: spin-slow 14s linear infinite reverse; }
.faq-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3.5rem; animation: pulse-faq 2s ease infinite; }
@keyframes spin-slow { to { transform: rotate(360deg); } }
@keyframes pulse-faq { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.12); } }
.hero-badge { display: inline-block; background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.6); color: #d4af37; padding: 6px 16px; border-radius: 99px; font-size: 0.78rem; font-weight: 700; margin-bottom: 16px; }
.hero-content h1 { font-size: 3.5rem; font-weight: 900; color: white; margin-bottom: 14px; line-height: 1; letter-spacing: -0.02em; }
.hero-accent { color: #d4af37; }
.hero-content p { font-size: 0.95rem; color: rgba(255,255,255,0.75); max-width: 460px; line-height: 1.7; margin-bottom: 24px; }
.btn-voltar { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: color 0.2s; }
.btn-voltar:hover { color: white; }

/* SECÇÃO FAQ */
.faq-section { padding: 60px 10%; background: #f5f5f7; }
.faq-inner { max-width: 860px; margin: 0 auto; }

/* CATEGORIAS */
.categorias { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 32px; }
.cat-btn {
  background: white;
  border: 1.5px solid #e0e0e0;
  color: #666;
  padding: 9px 18px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.cat-btn:hover { border-color: #931b18; color: #931b18; }
.cat-btn.ativo { background: #931b18; border-color: #931b18; color: white; }

/* LISTA DE PERGUNTAS */
.faq-lista { display: flex; flex-direction: column; gap: 10px; margin-bottom: 40px; }

.faq-item {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1.5px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.faq-item.aberto {
  border-color: #d4af37;
  box-shadow: 0 4px 20px rgba(212,175,55,0.12);
}

.faq-pergunta {
  width: 100%;
  background: transparent;
  border: none;
  padding: 18px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}
.faq-pergunta:hover { background: #fdf9f0; }
.faq-item.aberto .faq-pergunta { background: #fdf9f0; }

.faq-q-texto { font-size: 0.95rem; font-weight: 700; color: #1a1a1a; line-height: 1.4; flex: 1; }
.faq-item.aberto .faq-q-texto { color: #931b18; }
.faq-chevron { font-size: 0.7rem; color: #aaa; flex-shrink: 0; transition: color 0.2s; }
.faq-item.aberto .faq-chevron { color: #d4af37; }

.faq-resposta {
  padding: 0 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.faq-resposta p { font-size: 0.88rem; color: #555; line-height: 1.7; }
.faq-link {
  display: inline-flex;
  align-items: center;
  margin-top: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #931b18;
  text-decoration: none;
  transition: color 0.2s;
}
.faq-link:hover { color: #6b1210; text-decoration: underline; }

.faq-empty { text-align: center; padding: 40px; color: #aaa; font-size: 0.9rem; }
.faq-empty span { font-size: 2rem; display: block; margin-bottom: 10px; }

/* CONTACTO */
.contacto-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  flex-wrap: wrap;
  border-left: 4px solid #d4af37;
}
.contacto-icon { font-size: 2.5rem; flex-shrink: 0; }
.contacto-texto { flex: 1; min-width: 200px; }
.contacto-texto h3 { font-size: 1.05rem; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; }
.contacto-texto p { font-size: 0.85rem; color: #777; line-height: 1.6; }
.contacto-links { display: flex; gap: 10px; flex-wrap: wrap; flex-shrink: 0; }
.contacto-btn {
  background: #931b18;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  transition: all 0.2s;
  white-space: nowrap;
}
.contacto-btn:hover { background: #6b1210; transform: translateY(-2px); }
</style>