const BASE_URL = 'http://localhost:3001'

export async function getMarcos() {
  const res = await fetch(`${BASE_URL}/marcos`)
  if (!res.ok) throw new Error('Erro ao carregar marcos')
  return res.json()
}

export async function getMarcosByPais(paisCode) {
  const res = await fetch(`${BASE_URL}/marcos?paisCode=${paisCode}`)
  if (!res.ok) throw new Error('Erro ao carregar marcos')
  return res.json()
}

export async function getPaises() {
  const res = await fetch(`${BASE_URL}/paises`)
  if (!res.ok) throw new Error('Erro ao carregar países')
  return res.json()
}

export async function getPaisByCode(code) {
  const res = await fetch(`${BASE_URL}/paises?code=${code}`)
  if (!res.ok) throw new Error('Erro ao carregar país')
  const data = await res.json()
  return data[0] || null
}

export async function getDesembolsos() {
  const res = await fetch(`${BASE_URL}/desembolsos`)
  if (!res.ok) throw new Error('Erro ao carregar desembolsos')
  return res.json()
}

export async function getDesembolsosByPais(paisCode) {
  const res = await fetch(`${BASE_URL}/desembolsos?paisCode=${paisCode}`)
  if (!res.ok) throw new Error('Erro ao carregar desembolsos')
  return res.json()
}

export async function getIndicadores() {
  const res = await fetch(`${BASE_URL}/indicadores`)
  if (!res.ok) throw new Error('Erro ao carregar indicadores')
  return res.json()
}