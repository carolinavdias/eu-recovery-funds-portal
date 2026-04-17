import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const paisSelecionado = ref('todos')
  const darkMode = ref(false)
  const idioma = ref('pt')

  const paises = [
    { code: 'todos', nome: 'Todos os países' },
    { code: 'PT', nome: 'Portugal' },
    { code: 'ES', nome: 'Espanha' },
    { code: 'FR', nome: 'França' },
    { code: 'IT', nome: 'Itália' },
    { code: 'DE', nome: 'Alemanha' },
    { code: 'GR', nome: 'Grécia' },
    { code: 'HR', nome: 'Croácia' },
    { code: 'RO', nome: 'Roménia' },
  ]

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    document.body.classList.toggle('dark-mode', darkMode.value)
  }

  function setPais(code) {
    paisSelecionado.value = code
  }

  return {
    paisSelecionado,
    darkMode,
    idioma,
    paises,
    toggleDarkMode,
    setPais,
  }
})