<div align="center">

# 🏛️ ℙ𝕆ℝ𝕋𝔸𝕃 ℙℝℝ
### *Do dinheiro à decisão*

Visualização interativa de dados do **Mecanismo de Recuperação e Resiliência da União Europeia**

[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
[![Pinia](https://img.shields.io/badge/Pinia-store-f7d336?style=for-the-badge)](https://pinia.vuejs.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-visualizations-ff6384?style=for-the-badge)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/Licença-Académica-931b18?style=for-the-badge)](.)

[![Ver Vídeo](https://img.shields.io/badge/Ver%20Vídeo%20de%20Apresentação-YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/yCtLdJ1a8jI)

</div>

---

## 📋 Sobre o Projeto

O **Portal PRR** é um sistema de visualização de dados inspirado no [EU Recovery and Resilience Scoreboard](https://ec.europa.eu/economy_finance/recovery-and-resilience-scoreboard/), desenvolvido no âmbito da unidade curricular de **Interação Pessoa-Máquina (IPM)** do 2º ano de LEI na Universidade do Minho.

A aplicação permite explorar dados do Plano de Recuperação e Resiliência de 27 países europeus, incluindo marcos e metas, desembolsos financeiros, indicadores comuns e comparação entre países, com suporte para modo escuro e dois idiomas.

---

## 👥 Grupo TCX

| Nº | Nome | Contribuição Principal |
|---|---|---|
| a111179 | Carolina Dias | AppLayout, Routing, Mapa Interativo, Países, Comparação, Marcos e Metas |
| a111661 | Ana Patrícia Machado | Dashboard, Indicadores Comuns, Navbar, Sidebar, Footer |
| a110903 | Alexandra Neves | Desembolsos, Chart.js, db.json, Idioma PT/EN |

---

## 🎬 Vídeo de Apresentação

[![Portal PRR Vídeo](https://img.shields.io/badge/Assistir%20no%20YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/yCtLdJ1a8jI)

Duração: 6m 42s

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18 ou superior
- npm 9 ou superior

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/UMinho-ENGINF-IPM/ipm-2526-2s-tcx.git

# Entrar na pasta
cd ipm-2526-2s-tcx

# Instalar dependências
npm install
```

### Executar em desenvolvimento

```bash
# Iniciar a aplicação e o servidor de dados em simultâneo
npm run dev:all
```

A aplicação fica disponível em `http://localhost:5173` e o servidor de dados em `http://localhost:3001`.

Alternativamente, em terminais separados:

```bash
# Terminal 1 - Servidor de dados (json-server)
npm run dev:api

# Terminal 2 - Aplicação Vue
npm run dev
```

---

## ✨ Funcionalidades

**Dashboard**
Visão geral dos fundos PRR com métricas globais, gráficos por pilar de investimento e acesso rápido a todas as secções.

**Marcos e Metas**
Listagem completa dos marcos de 27 países com filtros por país, setor e estado, gráficos de progresso, histórico de revisões e exportação em CSV, JSON e PDF.

**Desembolsos**
Análise financeira dos pagamentos efetuados pela Comissão Europeia, com gráficos por ano e por tipo de financiamento, top 100 beneficiários e histórico de tranches.

**Indicadores Comuns**
Monitorização dos indicadores de reporte obrigatório com visualização por país e período semestral.

**Países**
Mapa interativo D3 com os 27 Estados-Membros, fichas individuais com dados completos e navegação por clique.

**Comparação**
Análise lado a lado de dois países com scorecard de métricas, sistema de pontuação e detecção de empate.

**Extras**
Modo escuro completo, suporte a dois idiomas (PT/EN) com troca em tempo real, splash screen animada, página 404 personalizada e tratamento de erros de API.

---

## 🛠️ Tecnologias

| Tecnologia | Utilização |
|---|---|
| Vue 3 Composition API | Framework principal |
| Pinia | Gestão de estado global |
| Vue Router | Navegação entre páginas |
| Chart.js | Gráficos de barras, donut e linha |
| D3.js + GeoJSON | Mapa interativo da Europa |
| json-server | Servidor de dados mockup |
| Vite | Build tool e servidor de desenvolvimento |

---

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Estilos globais e dark mode
├── components/      # Componentes partilhados (Navbar, Sidebar, Footer, Mapa)
├── views/           # Páginas da aplicação
├── stores/          # Store Pinia (idioma, país, dark mode, traduções)
├── services/        # Comunicação com a API (json-server)
└── router/          # Configuração de rotas
db.json              # Base de dados mockup com dados de 27 países
```

---

## 🤖 Declaração de Uso de Ferramentas de IA

Em conformidade com os princípios de integridade académica definidos no enunciado, declaramos que durante o desenvolvimento deste trabalho recorremos às ferramentas **Claude (Anthropic)** e **DeepSeek** para:

- Apoio na estruturação inicial de componentes Vue.js
- Geração de funções utilitárias de baixo nível
- Revisão e síntese do feedback dos professores à fase 1
- Sugestões de abordagem para o sistema de dark mode

Todo o código foi revisto, compreendido, adaptado e validado pelos membros do grupo antes de ser integrado no projeto.

---

## 📚 Contexto Académico

| | |
|---|---|
| Unidade Curricular | Interação Pessoa-Máquina (IPM) |
| Curso | Licenciatura em Engenharia Informática (LEI) |
| Instituição | Universidade do Minho |
| Ano Letivo | 2025/26 |
| Grupo | TCX |

---

<div align="center">

*Portal PRR - IPM 2025/26 · Universidade do Minho*

</div>
