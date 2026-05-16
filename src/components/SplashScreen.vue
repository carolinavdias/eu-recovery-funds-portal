<template>
  <div class="splash" :class="{ 'splash-hide': esconder }">
    <div class="splash-content">
      <div class="splash-logo">🏛️</div>
      <div class="splash-texto">
        <span class="splash-portal">PORTAL</span>
        <span class="splash-prr">PRR</span>
      </div>
      <div class="splash-linha"></div>
      <p class="splash-sub">Do dinheiro à decisão</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const esconder = ref(false)
const emit = defineEmits(['done'])

onMounted(() => {
  setTimeout(() => {
    esconder.value = true
    setTimeout(() => emit('done'), 600)
  }, 2200)
})
</script>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  background: #931b18;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  transition: opacity 0.6s ease;
}

.splash-hide {
  opacity: 0;
  pointer-events: none;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  animation: entrar 0.6s ease;
}

@keyframes entrar {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.splash-logo {
  font-size: 4rem;
  animation: pulsar 1.2s ease-in-out infinite;
}

@keyframes pulsar {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.15); }
}

.splash-texto {
  display: flex;
  gap: 10px;
  align-items: baseline;
}

.splash-portal {
  font-size: 2.2rem;
  font-weight: 900;
  color: white;
  letter-spacing: 0.05em;
}

.splash-prr {
  font-size: 2.2rem;
  font-weight: 900;
  color: #d4af37;
  letter-spacing: 0.05em;
}

.splash-linha {
  width: 60px;
  height: 2px;
  background: #d4af37;
  border-radius: 2px;
  animation: crescer 0.8s ease 0.4s both;
}

@keyframes crescer {
  from { width: 0; }
  to   { width: 60px; }
}

.splash-sub {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.08em;
  font-style: italic;
}
</style>