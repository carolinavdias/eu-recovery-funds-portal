import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const paisSelecionado = ref('todos')

  // Persistência do dark mode entre sessões
  const darkMode = ref(localStorage.getItem('prr-dark-mode') === 'true')

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

  // Aplica o modo guardado antes de qualquer render
  if (darkMode.value) {
    document.body.classList.add('dark-mode')
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    document.body.classList.toggle('dark-mode', darkMode.value)
    localStorage.setItem('prr-dark-mode', String(darkMode.value))
  }

  function setPais(code) {
    paisSelecionado.value = code
  }

  return {
    paisSelecionado,
    darkMode,
    paises,
    toggleDarkMode,
    setPais,
  }
})