# Interface Pessoa-Máquina (IPM)
## Proposta de Interface – 1.ª Fase

### Ano Letivo
2025/2026 – 2.º Semestre

### Grupo de Trabalho
  O nosso grupo é constituído pelos elementos seguintes:
- Ana Patrícia da Silva Machado (a111661)  
- Carolina Francisca Vieira Dias (a111179)  
- Alexandra Cerqueira da Luz das Neves (a110903)  

---

## 1. Introdução

  No âmbito da Unidade Curricular de Interface Pessoa-Máquina (IPM), foi proposto o desenvolvimento de uma interface de visualização de dados inspirada no **EU Recovery and Resilience Scoreboard**. O principal objetivo deste trabalho consiste em conceber uma solução de interface que facilite a análise, interpretação e comunicação de informação complexa relacionada com a execução dos Planos Nacionais de Recuperação e Resiliência.

  Nesta primeira fase do projeto, o foco incide exclusivamente no desenho da interface e na definição das suas funcionalidades, tendo por base os perfis de utilizador fornecidos. A proposta desenvolvida procura aplicar princípios de *design* centrado no utilizador, respeitando as principais *guidelines* e heurísticas de usabilidade, de forma a garantir uma experiência de utilização clara, eficiente e acessível a diferentes públicos.

---

## 2. Perfis de Utilizador

  O levantamento de requisitos da aplicação foi realizado com base em três perfis de utilizador distintos, concebidos de modo a representar diferentes contextos profissionais e níveis de literacia técnica. Estes perfis constituíram um elemento central no processo de design da interface, contribuindo para o desenvolvimento de uma solução que responde de forma eficaz a necessidades concretas e heterogéneas.

  A descrição detalhada de cada perfil encontra-se apresentada nas secções seguintes do presente relatório.

---

### 2.1 Perfil 1 – Helena Vasconcelos

  Helena Vasconcelos, de 42 anos, exerce funções como analista de políticas públicas na organização não governamental *Forum Civique Européen*. Reside em Bruxelas, Bélgica, sendo natural de Coimbra, Portugal. É casada e tem dois filhos. Possui doutoramento em Economia Política e uma experiência profissional consolidada na monitorização da transparência de fundos públicos e na avaliação do progresso efetivo face aos marcos e metas definidos pela Comissão Europeia.
  
  No desempenho das suas funções, Helena recorre frequentemente a ferramentas de análise e visualização de dados, como Excel, Tableau e plataformas especializadas, apresentando um elevado nível de literacia técnica. As suas principais necessidades centram-se no acesso a informação detalhada, estruturada e passível de reutilização, nomeadamente através da exportação de dados em formatos editáveis (como CSV ou JSON). Adicionalmente, valoriza a possibilidade de consultar metas específicas por setor de intervenção, bem como o histórico de revisões dos planos nacionais, de modo a garantir a rastreabilidade das decisões e a responsabilização das entidades envolvidas.
  
  A relevância atribuída à transparência e à capacidade de cruzamento de informação é sintetizada na seguinte afirmação: *“A transparência não é apenas publicar números; é permitir que possamos cruzar esses dados para responsabilizar quem decide.”*. Esta perspetiva reforça a necessidade de uma interface que privilegie o acesso a dados completos, comparáveis e facilmente reutilizáveis.

--- 

### 2.2 Perfil 2 – Marco Rossi

  Marco Rossi, de 31 anos, é mestre em Engenharia Eletrotécnica e cofundador da *startup* de energias renováveis *Evo Green Tech*. Reside em Milão, Itália, onde vive num apartamento partilhado, encontrando-se atualmente solteiro. No seu contexto profissional, está diretamente envolvido na definição da estratégia de crescimento da empresa, procurando identificar oportunidades de investimento e expansão no setor das energias renováveis.
  
  Marco possui um elevado nível de literacia técnica, recorrendo regularmente a ferramentas de análise e apoio à decisão, como Power BI, Trello, sistemas SCADA e software de modelação energética. A sua utilização da plataforma incide sobretudo na compreensão da distribuição dos fundos associados aos pilares da transição ecológica (*Green transition*) e da transformação digital (*Digital transformation*), de forma a identificar os países e áreas que apresentam maior investimento e potencial de crescimento.
  
  Entre as suas principais necessidades destacam-se a disponibilidade de visualizações claras e comparativas dos montantes investidos, bem como o acesso facilitado às datas previstas de desembolso. A possibilidade de exportar gráficos e visualizações para utilização em apresentações e *pitch decks* dirigidos a investidores constitui igualmente um requisito relevante. Estas necessidades refletem-se na seguinte afirmação: *“Preciso de saber para onde corre o dinheiro antes de decidir o próximo passo da minha empresa.”*

---

### 2.3 Perfil 3 – Clara Mendes

  Clara Mendes tem 58 anos e exerce funções como professora do ensino secundário. Reside em Évora, Portugal, e encontra-se divorciada, vivendo sozinha. É licenciada em História e desenvolve a sua atividade profissional no contexto letivo e pedagógico, estando atualmente envolvida na implementação da iniciativa “Escola Digital”, com particular ênfase na integração de novos equipamentos e ferramentas tecnológicas no processo de ensino-aprendizagem.

  No que respeita às suas competências técnicas, Clara utiliza ferramentas digitais sobretudo para fins de comunicação e criação de conteúdos, como Adobe Illustrator, redes sociais e plataformas de gestão de conteúdos, nomeadamente WordPress. No seu contexto profissional, a análise de dados complexos não constitui a sua principal área de atuação, pelo que privilegia interfaces com linguagem clara e sucinta, apoiadas por infográficos intuitivos e resumos do tipo *factsheet*, que facilitem a compreensão da informação apresentada.

  As suas principais necessidades prendem-se com a compreensão do impacto concreto da aplicação dos fundos europeus no seu quotidiano e na sua região, como, por exemplo, a renovação de escolas ou a disponibilização de novos equipamentos educativos. Valoriza ainda a possibilidade de comparar a execução de projetos a nível regional e entre países, de modo a perceber se eventuais atrasos nas promessas associadas à sua escola correspondem a situações localizadas ou a um problema generalizado. Esta perspetiva é refletida na seguinte afirmação: *“Ouço falar de milhões todos os dias na televisão, mas gostava de ver de forma simples onde é que esse dinheiro está realmente a ser aplicado e quantas pessoas ajudou.”*

---

## 3. Requisitos do Sistema

### 3.1 Requisitos associados ao Perfil 1 – Helena Vasconcelos

| Necessidade | Requisito do Sistema |
|------------|----------------------|
| Exportação de dados | Exportação em CSV e JSON |
| Acesso a metas por setor | Filtros por setor |
| Histórico de revisões | Visualização de versões anteriores |

### 3.2 Requisitos associados ao Perfil 2 – Marco Rossi

| Necessidade | Requisito do Sistema |
|------------|----------------------|
| Visualizações claras de investimento | *Dashboards* comparativos |
| Datas de desembolso previstas | *Timeline* de pagamentos por país |
| Identificar países que investem mais por pilar | Rankings e gráficos comparativos por pilar |
| Exportação de gráficos | *Download* de gráficos em formato imagem/PDF |

### 3.3 Requisitos associados ao Perfil 3 – Clara Mendes

| Necessidade | Requisito do Sistema |
|------------|----------------------|
| Linguagem clara e sucinta | *Factsheets* e infográficos |
| Navegação e comparação regional | Comparação por país/região |
| Compreensão de atrasos | Indicadores de progresso |

---

## 4. Proposta de Interface

### 4.1 Visão Geral da Interface

  A interface do protótipo foi desenvolvida como um portal de transparência e monitorização da execução do Plano de Recuperação e Resiliência (PRR), em conformidade com as diretrizes do Recovery and Resilience Scoreboard da União Europeia. O design adotado enfatiza a clareza e a acessibilidade de dados complexos, estruturando a interface em três áreas funcionais principais:

### 4.1.1. Área de Exploração e Pesquisa

  O topo da interface foi concebido para facilitar a pesquisa e a filtragem rápida da informação, alinhando-se com a heurística de Controlo e Liberdade do Utilizador. Estes mecanismos permitem que os utilizadores adaptem a informação apresentada aos seus objetivos específicos de análise.

  - **Seletor de países e comparação entre Estados-Membros:**
A inclusão de um seletor de países e de uma funcionalidade de comparação possibilita a navegação regional e a análise comparativa dos dados. Esta funcionalidade responde às necessidades de utilizadores como Marco Rossi, interessado na identificação de padrões de investimento, e Clara Mendes, que procura compreender diferenças regionais.

  - **Barra de pesquisa:**
A barra de pesquisa foi integrada com o objetivo de permitir o acesso direto a metas, setores e indicadores específicos, facilitando a localização eficiente de informação técnica por parte de utilizadores com necessidades analíticas mais aprofundadas, como Helena Vasconcelos. Esta funcionalidade possibilita a identificação imediata de metas ou indicadores específicos, sem a necessidade de navegar por múltiplos menus, promovendo assim maior eficiência na interação com a interface e respeitando a heurística de **“Flexibilidade e Eficiência de Uso”**.

  - **Feedback de Estado:**
O facto de o cursor piscar (que estiveste a configurar) serve como um indicador visual de que o sistema está pronto para receber dados, cumprindo a heurística de "Visibilidade do Estado do Sistema".

### 4.1.2. Painel de Indicadores de Domínio

  A secção central da interface apresenta uma visão sintética do estado global da execução, recorrendo a métricas de alto nível organizadas em cards informativos. Esta organização permite um acesso progressivo a níveis mais detalhados de informação, partindo de indicadores agregados para dados mais específicos.

  - **Investimento e Desembolsos:**
Esta componente apresenta o montante global de investimento, bem como a informação relativa aos desembolsos efetuados, permitindo uma leitura imediata da execução financeira. Adicionalmente, são disponibilizadas opções de exportação de dados, através de funcionalidades de *download*, de modo a suportar análises externas em formatos editáveis, como JSON ou CSV.

  - **Marcos e Metas:**
Os *cards* dedicados aos marcos e metas promovem a transparência do processo de execução, evidenciando o progresso associado aos objetivos específicos definidos no âmbito do *Recovery and Resilience Facility*. Esta informação permite acompanhar o cumprimento dos compromissos assumidos pelos Estados-Membros.

  - **Indicadores Comuns:**
A interface integra ainda a monitorização dos indicadores comuns de reporte obrigatório, essenciais para a avaliação harmonizada do desempenho e para o cumprimento das normas de acompanhamento estabelecidas a nível europeu.

---

### 4.2 Estrutura e Navegação

Todas as páginas podem ser acedidas através de outras páginas, e no topo de cada página mantém-se uma barra com as páginas principais que o visualizador poderá usar para se orientar.

Os atalhos implementados foram feitos para facilitar a interação entre o visualizador e a interface, respeitando a heurística da flexibilidade e eficiência de uso.

Sempre que o utilizador da interface pretende exportar uma figura, gráfico ou tabela, aparece um guia de exportação rápida para o auxiliar da forma mais eficaz possível.

Para além destas, foram implementadas diversas interações com vista a respeitar as heurísticas de Usabilidade referentes à estrutura e navegação correta de uma interface e a torná-la o mais dinâmica possível.

---

## 5. Adequação da Interface aos Perfis de Utilizador

  A interface foi concebida com o objetivo de responder às necessidades dos três perfis definidos no enunciado do projeto (Helena Vasconcelos, Marco Rossi e Clara Mendes). Assim, as necessidades específicas de cada um destes perfis constituíram as principais diretrizes orientadoras ao longo do processo de desenvolvimento da interface.

### 5.1 Respostas Implementadas para o Perfil 1 - Helena Vasconcelos

  Todas as figuras, gráficos e tabelas disponibilizados na interface incluem funcionalidades de exportação nos formatos **CSV**, **JSON** e **PDF**, permitindo que Helena possa editar e utilizar os conjuntos de dados para fins de análise e monitorização.

  Pelo mesmo motivo, são também disponibilizados relatórios e tabelas com registos históricos, possibilitando a consulta e análise de planos anteriores sempre que necessário. Esta funcionalidade permite não apenas a comparação entre diferentes períodos ou estratégias, mas também contribui para garantir a consistência e a fiabilidade dos dados e da informação apresentada.

  Deste modo, procura-se assegurar o princípio de transparência que Helena valoriza na utilização de interfaces digitais.
  
---

### 5.2 Respostas Implementadas para o Perfil 2 - Marco Rossi

  Relativamente ao perfil de Marco Rossi, cuja atividade empreendedora exige um acesso rápido e claro a informação relevante sobre financiamento e oportunidades de investimento, procurou-se integrar na interface funcionalidades que facilitem a análise e interpretação dos dados disponibilizados.

  Um dos exemplos é a página **Top 100 Beneficiários**, onde é possível identificar de forma imediata as empresas ou entidades que receberam os maiores volumes de financiamento no âmbito do **Plano de Recuperação e Resiliência (PRR)**.

  Adicionalmente, na página de **Desembolsos**, foi integrada uma tabela que apresenta os desembolsos mais recentes, bem como o próximo desembolso previsto aprovado pela Comissão Europeia. Nesta tabela é possível consultar informações como a data, o ID da transação, o montante desembolsado, o tipo de apoio (subvenção ou empréstimo) e o estado do desembolso (pago ou pendente). O identificador da transação permite ainda identificar facilmente o país que recebeu, ou poderá vir a receber, o respetivo financiamento.

  Para uma análise mais detalhada, foi também disponibilizado um percurso de navegação específico para cada país, no qual se apresentam informações consideradas relevantes para empreendedores e investidores, como é o caso de Marco Rossi. Nestes percursos, os setores de investimento (**Pilares do PRR**) encontram-se organizados por ordem decrescente do valor total investido pelo respetivo país.

  Para complementar esta análise, foram incluídos gráficos de barras que permitem observar de forma clara a evolução do investimento por setor ao longo do tempo, no período compreendido entre 2021 e 2026, correspondente ao horizonte de implementação do PRR. Tal como referido anteriormente, estes gráficos podem ser exportados, possibilitando a sua utilização em apresentações ou pitchs dirigidos a investidores.

  Deste modo, as funcionalidades implementadas permitem visualizar de forma clara o fluxo de financiamento, respondendo às necessidades de análise e tomada de decisão associadas ao perfil de Marco Rossi.

---

### 5.3 Respostas Implementadas para o Perfil 3 - Clara Mendes

  Por último, no que diz respeito ao perfil de Clara Mendes, foram seguidas diversas **heurísticas de usabilidade** com o objetivo de garantir a acessibilidade, intuitividade e clareza da informação disponibilizada na interface.

  As diferentes páginas encontram-se organizadas de forma simples e explícita, evitando a concentração excessiva de informação numa única página. Esta abordagem permite uma navegação mais clara e reduz a sobrecarga cognitiva dos utilizadores.

A  dicionalmente, as cores são utilizadas de forma estratégica, permitindo destacar informações relevantes e facilitar a interpretação da informação numa **visão geral** da interface. Desta forma, torna-se possível identificar rapidamente padrões e tirar conclusões de forma intuitiva, nomeadamente no que diz respeito à comparação entre países, aos projetos mais recentes desenvolvidos no âmbito do **Plano de Recuperação e Resiliência (PRR)**, como a renovação de escolas, construção de infraestruturas rodoviárias ou apoios à investigação, bem como às possíveis causas de atrasos em determinados investimentos, como os relacionados com infraestruturas educativas.

  Para além disso, todas as páginas utilizam uma linguagem clara e concisa, acompanhada de títulos e subtítulos estruturados, permitindo compreender facilmente os temas abordados nos diferentes gráficos, tabelas e restantes elementos visuais.

  Em suma, a interface foi concebida com o objetivo de garantir elevados níveis de perceptibilidade, clareza informacional e usabilidade, respondendo às necessidades identificadas para este perfil de utilizador.

---

## 6. Conclusão

  A primeira fase do projeto de **Interface Pessoa-Máquina** permitiu a transição bem sucedida de um levantamento teórico de requisitos para o desenvolvimento de uma solução de interface interativa e centrada no utilizador. Através da análise detalhada dos perfis de Helena, Marco e Clara, foi possível conceber um portal que equilibra a complexidade analítica dos dados com a simplicidade visual necessária à transparência da informação pública.

  A implementação do protótipo no **Figma** não se limitou aos aspetos estéticos, tendo sido igualmente orientada por princípios de usabilidade e feedback do sistema. Exemplos disso incluem a barra de pesquisa interativa com cursor dinâmico e os *dashboards* de desembolsos, que oferecem respostas diretas às necessidades de monitorização e análise de investimento identificadas durante a fase de levantamento de requisitos.

  Em síntese, a proposta apresentada procura cumprir as **heurísticas de usabilidade de Nielsen**, garantindo que a informação relativa ao **Plano de Recuperação e Resiliência (PRR)** em Portugal é apresentada de forma acessível, comparável e útil, atendendo aos diferentes níveis de literacia digital dos cidadãos.

---

## 7. Link para o projeto Figma 
- https://www.figma.com/design/tgYwB32hyxl8PHEXoaRci4/IPM?node-id=0-1&p=f&t=updeBZMDUoPbVNrE-0
