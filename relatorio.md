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


### 4.2 Estrutura e Navegação

