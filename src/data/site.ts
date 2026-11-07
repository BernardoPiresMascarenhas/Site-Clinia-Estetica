/**
 * Conteúdo editável do VÉLIA.
 * Tudo o que é texto, imagem ou dado demonstrativo vive aqui — para adaptar o
 * projeto a uma clínica real, comece por este arquivo (e valide o conteúdo
 * técnico e as regras publicitárias aplicáveis à atividade).
 */

export const site = {
  name: "VÉLIA",
  signature: "Estética & Bem-Estar",
  url: "https://site-clinica-estetica.vercel.app",
  description:
    "VÉLIA — Estética & Bem-Estar é um projeto conceitual de portfólio: um site premium para clínica de estética, com direção de arte editorial, interações e agendamento demonstrativo. Desenvolvido por Bernardo Pires.",
  author: {
    name: "Bernardo Pires",
    url: "https://www.bernardopiresdev.com.br/",
  },
  demoNotice:
    "Projeto conceitual de portfólio. A VÉLIA é uma marca fictícia: não há clínica em funcionamento, profissionais reais ou atendimento disponível.",
};

export const nav = [
  { label: "Essência", href: "#essencia" },
  { label: "Tratamentos", href: "#tratamentos" },
  { label: "Jornada", href: "#jornada" },
  { label: "Galeria", href: "#galeria" },
  { label: "Equipe", href: "#equipe" },
  { label: "Dúvidas", href: "#duvidas" },
] as const;

export type Img = {
  src: string;
  alt: string;
  /** object-position — enquadramento pensado por imagem */
  pos?: string;
};

/* ── Hero ─────────────────────────────────────────────────────── */

export const hero = {
  kicker: "Estética & Bem-Estar",
  titleLines: [
    { text: "A beleza que", italic: false },
    { text: "já é sua,", italic: true },
    { text: "cuidada com", italic: false },
    { text: "intenção.", italic: true },
  ],
  lede: "Um espaço conceitual onde estética, escuta e bem-estar caminham juntos — com cuidados pensados para a sua pele, o seu ritmo e a sua história.",
  image: {
    src: "/images/hero-portrait.jpg",
    alt: "Retrato editorial de uma mulher de perfil suave, pele natural e cabelo preso, sobre fundo neutro.",
    pos: "52% 30%",
  } satisfies Img,
  detail: {
    src: "/images/tech-cream.jpg",
    alt: "Textura de creme sobre superfície bege.",
    pos: "50% 50%",
  } satisfies Img,
  notes: ["Cuidado individual", "Beleza natural", "Escuta atenta"],
};

/* ── Manifesto ────────────────────────────────────────────────── */

export const manifesto = {
  eyebrow: "Nossa essência",
  // Frase em linhas controladas (quebras editoriais, não automáticas).
  // `indent` desloca a linha na "escada" tipográfica; `em` aplica o itálico sálvia.
  statement: [
    { text: "A beleza não", indent: 0 },
    { text: "segue moldes.", indent: 1 },
    { text: "Ela respeita", indent: 2 },
    { text: "quem você é.", indent: 2, em: true },
  ] as { text: string; indent: 0 | 1 | 2; em?: boolean }[],
  support:
    "Na VÉLIA, cada cuidado começa pela escuta. Realçamos o que já é seu — sem pressa, sem padrões externos e com a avaliação profissional como ponto de partida.",
  image: {
    src: "/images/manifesto-portrait.jpg",
    alt: "Retrato de uma mulher de olhos fechados e expressão serena, em meio a folhagens, com luz natural.",
    pos: "36% 32%",
  } satisfies Img,
  columns: [
    {
      n: "I",
      title: "Escutar antes de propor",
      text: "Cada atendimento começa por uma conversa. Expectativas, rotina e histórico guiam qualquer sugestão — e é a avaliação profissional que define o que faz sentido para você.",
    },
    {
      n: "II",
      title: "Realçar, não transformar",
      text: "Trabalhamos a favor das suas características. O objetivo é que você se reconheça no espelho, com uma pele mais cuidada e uma rotina mais leve.",
    },
    {
      n: "III",
      title: "Cuidado que continua",
      text: "Bem-estar não acontece em uma sessão isolada. Acompanhamos o percurso com orientação clara e ajustes ao longo do tempo.",
    },
  ],
};

/* ── Tratamentos ──────────────────────────────────────────────── */

export type Treatment = {
  id: string;
  index: string;
  name: string;
  category: "Facial" | "Corporal" | "Bem-estar" | "Início";
  short: string;
  description: string;
  includes: string[];
  duration: string;
  note: string;
  image: Img;
};

export const treatments: Treatment[] = [
  {
    id: "avaliacao",
    index: "01",
    name: "Avaliação Estética Personalizada",
    category: "Início",
    short: "O primeiro encontro: escuta, observação e um plano de cuidados desenhado com você.",
    description:
      "Um momento dedicado a conhecer suas expectativas, sua rotina e seu histórico de cuidados. A partir dessa conversa e da avaliação profissional, são apresentadas possibilidades de atendimento — sempre com transparência sobre o que cada uma envolve.",
    includes: ["Conversa sobre expectativas e rotina", "Observação da pele com profissional", "Plano de cuidados explicado com clareza"],
    duration: "Aprox. 50 min",
    note: "A indicação de qualquer cuidado depende da avaliação profissional.",
    image: {
      src: "/images/treat-avaliacao.jpg",
      alt: "Profissional com as mãos delicadamente no rosto de uma cliente deitada, em sala de atendimento clara.",
      pos: "50% 40%",
    },
  },
  {
    id: "limpeza",
    index: "02",
    name: "Limpeza de Pele",
    category: "Facial",
    short: "Higienização cuidadosa em etapas, respeitando o momento e a sensibilidade da sua pele.",
    description:
      "Um protocolo em etapas — higienização, preparo e finalização — conduzido com produtos e técnicas escolhidos após a avaliação. A proposta é uma pele limpa e confortável, com orientações para o dia a dia.",
    includes: ["Higienização e preparo", "Etapas ajustadas ao tipo de pele", "Orientações de cuidado em casa"],
    duration: "Aprox. 70 min",
    note: "Frequência e etapas são definidas individualmente.",
    image: {
      src: "/images/treat-limpeza.jpg",
      alt: "Rosto de cliente com espuma de limpeza durante cuidado facial, em luz quente.",
      pos: "50% 45%",
    },
  },
  {
    id: "hidratacao",
    index: "03",
    name: "Hidratação & Revitalização Facial",
    category: "Facial",
    short: "Um ritual de conforto para a pele, com texturas leves e toque atento.",
    description:
      "Cuidados voltados ao conforto e à sensação de pele nutrida, combinando ativos cosméticos e técnicas manuais. As escolhas de produtos acontecem após a avaliação, considerando sensibilidades e preferências.",
    includes: ["Preparo e aplicação de ativos cosméticos", "Massagem facial suave", "Finalização e recomendações"],
    duration: "Aprox. 60 min",
    note: "Sensações e respostas variam de pessoa para pessoa.",
    image: {
      src: "/images/treat-hidratacao.jpg",
      alt: "Close-up de uma mulher aplicando creme na maçã do rosto com a ponta dos dedos.",
      pos: "50% 40%",
    },
  },
  {
    id: "corporal",
    index: "04",
    name: "Cuidados Corporais",
    category: "Corporal",
    short: "Atenção ao corpo como um todo — conforto, textura da pele e momentos de pausa.",
    description:
      "Protocolos corporais pensados para o cuidado da pele e para a sensação de leveza, com técnicas manuais e produtos selecionados. A proposta de cada sessão é construída a partir da conversa inicial.",
    includes: ["Escolha de técnicas após avaliação", "Produtos de textura leve", "Ambiente reservado e acolhedor"],
    duration: "Aprox. 60 a 80 min",
    note: "Não substitui acompanhamento médico ou fisioterapêutico.",
    image: {
      src: "/images/treat-corporal.jpg",
      alt: "Mãos de profissional massageando o antebraço de uma pessoa sobre toalha clara.",
      pos: "50% 45%",
    },
  },
  {
    id: "massagem",
    index: "05",
    name: "Massagem Relaxante",
    category: "Bem-estar",
    short: "Ritmo lento, pressão ajustada e um intervalo real na rotina.",
    description:
      "Uma massagem de movimentos contínuos e envolventes, com pressão ajustada ao seu conforto. Um convite para desacelerar, em um ambiente silencioso e preparado para a pausa.",
    includes: ["Pressão ajustada ao seu conforto", "Óleos de textura suave", "Tempo de acolhimento ao final"],
    duration: "Aprox. 60 min",
    note: "Informe sempre qualquer desconforto durante a sessão.",
    image: {
      src: "/images/treat-massagem.jpg",
      alt: "Massagem com pedras sobre as costas, com flores brancas sobre a maca.",
      pos: "40% 50%",
    },
  },
  {
    id: "bem-estar",
    index: "06",
    name: "Protocolos de Bem-Estar",
    category: "Bem-estar",
    short: "Combinações de cuidados para quem busca constância e autocuidado no calendário.",
    description:
      "Sequências de atendimentos combinados — faciais, corporais e de relaxamento — organizadas ao longo de semanas. O protocolo é desenhado em conjunto e revisto a cada etapa.",
    includes: ["Calendário de cuidados combinado", "Revisões ao longo do percurso", "Ajustes conforme sua rotina"],
    duration: "Programas de 4 a 8 semanas",
    note: "Ilustrativo — formatos reais dependem de cada clínica.",
    image: {
      src: "/images/treat-bemestar.jpg",
      alt: "Sala de vapor com bancos de pedra clara iluminados por luz quente e uma vela ao centro.",
      pos: "50% 60%",
    },
  },
];

/* ── Jornada (O cuidado começa em você) ───────────────────────── */

export const journey = {
  eyebrow: "O cuidado começa em você",
  title: ["Três tempos", "para um cuidado", "que faz sentido."],
  steps: [
    {
      n: "01",
      verb: "Conhecer",
      title: "Entender antes de indicar.",
      text: "Uma conversa sem pressa sobre expectativas, rotina, sensibilidades e o que você espera sentir. É aqui que o cuidado começa a ganhar forma.",
      points: ["Escuta das suas expectativas", "Histórico de cuidados", "Avaliação com profissional"],
      image: { src: "/images/step-conhecer.jpg", alt: "Profissional apoiando as mãos na testa de uma cliente deitada.", pos: "40% 40%" },
    },
    {
      n: "02",
      verb: "Personalizar",
      title: "Escolhas feitas para você.",
      text: "Com base na avaliação, apresentamos possibilidades e explicamos cada uma — o que envolve, a frequência sugerida e o que esperar com realismo.",
      points: ["Opções explicadas com clareza", "Produtos e técnicas compatíveis", "Decisão compartilhada"],
      image: { src: "/images/step-personalizar.jpg", alt: "Placas circulares de vidro com séruns e géis de diferentes texturas sobre fundo nude.", pos: "50% 50%" },
    },
    {
      n: "03",
      verb: "Acompanhar",
      title: "Constância, não pressa.",
      text: "O cuidado continua depois da sessão: orientações para casa, revisões e ajustes conforme a sua pele e a sua rotina mudam.",
      points: ["Orientações para o dia a dia", "Revisões periódicas", "Ajustes ao longo do tempo"],
      image: { src: "/images/step-acompanhar.jpg", alt: "Cliente deitada e relaxada recebendo cuidado com as mãos de uma profissional.", pos: "50% 45%" },
    },
  ],
};

/* ── Explorador de cuidados ───────────────────────────────────── */

export const explorer = {
  eyebrow: "Explorador de cuidados",
  title: "O que você deseja cuidar?",
  lede: "Escolha um tema e navegue pelas categorias de atendimento relacionadas. É uma forma de explorar — não uma avaliação.",
  disclaimer:
    "Conteúdo informativo e demonstrativo. Nenhum dado é coletado e esta navegação não substitui avaliação profissional.",
  options: [
    {
      id: "luminosidade",
      label: "Pele & luminosidade",
      glyph: "◐",
      headline: "Uma pele com aparência mais descansada começa na rotina.",
      text: "Luminosidade costuma estar ligada a hábitos, limpeza adequada e hidratação. Em uma avaliação, é possível entender o que faz sentido para o seu tipo de pele.",
      related: ["avaliacao", "limpeza"],
      shape: "arch",
      image: { src: "/images/explore-luminosidade.jpg", alt: "Retrato próximo de uma mulher com sardas e luz quente atravessando o rosto.", pos: "50% 35%" },
    },
    {
      id: "hidratacao",
      label: "Hidratação facial",
      glyph: "◍",
      headline: "Conforto e textura: o cuidado que a pele sente.",
      text: "Protocolos de hidratação combinam ativos cosméticos e toque atento. A escolha de produtos considera sensibilidades e preferências individuais.",
      related: ["hidratacao", "avaliacao"],
      shape: "circle",
      image: { src: "/images/explore-hidratacao.jpg", alt: "Duas placas de vidro sobrepostas com géis translúcidos em tons dourados.", pos: "50% 50%" },
    },
    {
      id: "relaxamento",
      label: "Relaxamento",
      glyph: "◡",
      headline: "Pausar também é uma forma de cuidado.",
      text: "Massagens e rituais de bem-estar convidam a desacelerar. Ritmo, pressão e ambiente são ajustados para o seu conforto.",
      related: ["massagem", "bem-estar"],
      shape: "seed",
      image: { src: "/images/explore-relaxamento.jpg", alt: "Retrato de uma mulher de olhos fechados vista através de um vidro, em tons quentes.", pos: "50% 45%" },
    },
    {
      id: "corporal",
      label: "Cuidados corporais",
      glyph: "◠",
      headline: "O corpo inteiro merece a mesma atenção.",
      text: "Cuidados corporais podem unir técnicas manuais e produtos selecionados, com foco em conforto e na sensação de leveza.",
      related: ["corporal", "massagem"],
      shape: "pill",
      image: { src: "/images/explore-corporal.jpg", alt: "Costas de uma pessoa sobre a maca com pedras escuras alinhadas e flores brancas.", pos: "45% 50%" },
    },
    {
      id: "rotina",
      label: "Rotina de autocuidado",
      glyph: "◇",
      headline: "Constância vale mais do que intensidade.",
      text: "Uma rotina possível, com orientações claras, tende a ser mais sustentável. Protocolos de bem-estar ajudam a organizar o cuidado ao longo das semanas.",
      related: ["bem-estar", "avaliacao"],
      shape: "arch",
      image: { src: "/images/explore-rotina.jpg", alt: "Mão segurando um frasco conta-gotas de sérum sobre tecido de linho claro.", pos: "50% 40%" },
    },
  ],
} as const;

/* ── Tecnologia & Cuidado ─────────────────────────────────────── */

export const technology = {
  eyebrow: "Tecnologia & cuidado",
  title: ["Precisão", "a serviço da", "delicadeza."],
  lede: "Recursos contemporâneos só fazem sentido quando acompanhados de critério. Na VÉLIA, a tecnologia é uma ferramenta — nunca uma promessa.",
  pillars: [
    { k: "Critério", text: "Cada recurso é apresentado com clareza: para que serve, como funciona e quando não é indicado." },
    { k: "Ambiente", text: "Salas pensadas para conforto, privacidade e uma experiência silenciosa do início ao fim." },
    { k: "Registro", text: "Um histórico organizado de cada atendimento ajuda a acompanhar o percurso com consistência." },
    { k: "Atualização", text: "Uma equipe que estuda continuamente e revisa protocolos com responsabilidade." },
  ],
  lens: {
    hint: "Passe o cursor ou arraste sobre a imagem",
    hintTouch: "Toque e arraste sobre a imagem",
    image: { src: "/images/tech-device.jpg", alt: "Profissional de luvas realizando cuidado facial com equipamento em uma cliente de olhos fechados.", pos: "50% 45%" },
  },
  texture: { src: "/images/tech-texture.jpg", alt: "", pos: "50% 50%" },
  note: "Conteúdo conceitual: equipamentos e protocolos reais devem ser descritos conforme cada clínica e sua regulamentação.",
};

/* ── Galeria editorial ────────────────────────────────────────── */

export type GalleryItem = Img & { caption: string; shape: "arch" | "rect" | "circle" | "tall" | "wide" | "seed" };

export const gallery: GalleryItem[] = [
  { src: "/images/gallery-freckles.jpg", alt: "Retrato de uma jovem com sardas e cabelo preso, em luz suave.", caption: "Pele real, luz natural", shape: "arch", pos: "50% 35%" },
  { src: "/images/gallery-serums.jpg", alt: "Placas de vidro com séruns ao lado de folhas verdes sobre fundo nude.", caption: "Texturas", shape: "wide", pos: "50% 50%" },
  { src: "/images/gallery-touch.jpg", alt: "Mulher tocando delicadamente o próprio rosto, de perfil.", caption: "Gesto", shape: "tall", pos: "50% 30%" },
  { src: "/images/gallery-arch.jpg", alt: "Ambiente minimalista com nicho em arco iluminado e plantas em vasos de cerâmica.", caption: "Arquitetura do cuidado", shape: "arch", pos: "50% 55%" },
  { src: "/images/gallery-cream.jpg", alt: "Pincelada de creme branco sobre fundo claro.", caption: "Leveza", shape: "circle", pos: "50% 50%" },
  { src: "/images/gallery-leaves.jpg", alt: "Retrato de uma mulher com folhas verdes no cabelo, sobre fundo escuro.", caption: "Natureza", shape: "rect", pos: "50% 30%" },
  { src: "/images/gallery-oil.jpg", alt: "Mão segurando conta-gotas de óleo âmbar com uma gota prestes a cair.", caption: "Ritual", shape: "wide", pos: "50% 50%" },
  { src: "/images/gallery-room.jpg", alt: "Sala de atendimento com maca coberta por lençol bege, iluminada por janela ampla.", caption: "Silêncio", shape: "tall", pos: "50% 60%" },
  { src: "/images/gallery-fabric.jpg", alt: "Tecido branco em dobras suaves com sombras delicadas.", caption: "Calma", shape: "seed", pos: "50% 50%" },
];

/* ── Equipe (perfis ilustrativos) ─────────────────────────────── */

export const team = {
  eyebrow: "Profissionais",
  title: "Quem cuida, cuida com atenção.",
  lede: "Um espaço para apresentar a equipe com o cuidado que ela merece. Os perfis abaixo são ilustrativos — nomes e descrições fictícios, sem registros ou credenciais.",
  members: [
    {
      name: "Helena Vasconcelos",
      role: "Cuidados faciais",
      focus: ["Escuta e avaliação", "Rotinas de pele", "Hidratação"],
      quote: "Gosto de explicar cada etapa. Cuidado bom é cuidado entendido.",
      image: { src: "/images/doutora1.jpg", alt: "Retrato profissional de uma mulher de cabelos longos e blazer cinza, sobre fundo neutro.", pos: "50% 0%" },
    },
    {
      name: "Marina Lacerda",
      role: "Cuidados corporais & bem-estar",
      focus: ["Técnicas manuais", "Relaxamento", "Protocolos de bem-estar"],
      quote: "Uma sessão começa no acolhimento, muito antes da maca.",
      image: { src: "/images/doutora2.jpg", alt: "Retrato de uma mulher sorridente de cabelos grisalhos e blazer claro, sobre fundo bege.", pos: "50% 22%" },
    },
    {
      name: "Clara Antunes",
      role: "Experiência do cliente",
      focus: ["Atendimento", "Agenda e orientações", "Acompanhamento"],
      quote: "Meu trabalho é fazer cada visita parecer tranquila e bem cuidada.",
      image: { src: "/images/doutora3.jpg", alt: "Retrato de uma mulher de cabelos escuros e camisa branca, sobre fundo claro.", pos: "58% 30%" },
    },
  ],
};

/* ── Valores (no lugar de depoimentos) ────────────────────────── */

export const values = {
  eyebrow: "Princípios de atendimento",
  title: "Confiança se constrói em cada detalhe.",
  lede: "Em vez de depoimentos inventados, apresentamos os compromissos que orientam a experiência. Depoimentos reais podem ser incluídos futuramente, com autorização expressa de quem os escreveu.",
  items: [
    { k: "Atenção individual", text: "Tempo reservado para ouvir — sem roteiros prontos e sem pressa para indicar.", word: "você" },
    { k: "Comunicação transparente", text: "Explicamos o que cada cuidado envolve, seus limites e o que esperar com realismo.", word: "clareza" },
    { k: "Respeito à individualidade", text: "Seus traços, seu tempo e suas escolhas guiam o percurso — nunca um padrão externo.", word: "respeito" },
    { k: "Experiência de cuidado", text: "Do primeiro contato à saída, cada detalhe do ambiente é pensado para acolher.", word: "acolhimento" },
    { k: "Compromisso com o bem-estar", text: "Indicamos apenas o que faz sentido após avaliação — e dizemos quando algo não é para você.", word: "bem-estar" },
  ],
};

/* ── Agendamento demonstrativo ────────────────────────────────── */

export const booking = {
  eyebrow: "Agendamento",
  title: ["Simule a sua", "visita."],
  lede: "Uma demonstração de como um agendamento online pode ser simples e elegante. Nenhum dado pessoal é solicitado e nada é enviado.",
  preferences: [
    { id: "manha", label: "Manhã", hint: "Começar o dia com calma" },
    { id: "tarde", label: "Tarde", hint: "Uma pausa no meio da semana" },
    { id: "noite", label: "Início da noite", hint: "Depois do expediente" },
  ],
  formats: [
    { id: "primeira", label: "Primeira visita", hint: "Inclui conversa inicial" },
    { id: "retorno", label: "Retorno", hint: "Continuidade de um cuidado" },
  ],
  slots: {
    manha: ["08:30", "09:15", "10:00", "10:45", "11:30"],
    tarde: ["13:30", "14:15", "15:00", "15:45", "16:30"],
    noite: ["17:30", "18:15", "19:00"],
  } as Record<string, string[]>,
};

/* ── FAQ ──────────────────────────────────────────────────────── */

export const faq = [
  {
    q: "Como funciona a avaliação inicial?",
    a: "Em um cenário real, a avaliação é uma conversa com um profissional habilitado sobre expectativas, rotina e histórico de cuidados, seguida da observação da pele. A partir dela são apresentadas possibilidades — nunca uma indicação pronta. Como a VÉLIA é um projeto conceitual, não há avaliações sendo realizadas.",
  },
  {
    q: "Como escolher um serviço?",
    a: "O ideal é não escolher sozinho. O explorador de cuidados deste site ajuda a navegar pelas categorias, mas a indicação de qualquer procedimento depende de avaliação profissional adequada, considerando as características de cada pessoa.",
  },
  {
    q: "A clínica oferece atendimento personalizado?",
    a: "A proposta da marca é justamente essa: cuidados construídos a partir da escuta e da avaliação individual. Neste projeto demonstrativo, a personalização é apresentada como conceito de experiência — não como serviço disponível.",
  },
  {
    q: "Como funcionaria o agendamento?",
    a: "A simulação nesta página mostra o fluxo: escolha do serviço, preferência de horário, data e resumo. Em uma clínica real, essa interface poderia se conectar a uma agenda online, ao WhatsApp ou a um sistema de gestão — com política de privacidade e consentimento adequados.",
  },
  {
    q: "Como entrar em contato?",
    a: "A VÉLIA é uma marca fictícia, portanto não há telefone, endereço ou perfis sociais. Se você tem uma clínica e quer um site com esta experiência, fale com o desenvolvedor pelo portfólio indicado no rodapé.",
  },
];

/* ── CTA final ────────────────────────────────────────────────── */

export const finale = {
  eyebrow: "Começar",
  title: ["O cuidado", "que você merece", "começa aqui."],
  text: "Explore os cuidados, simule uma visita e descubra como uma experiência digital pode refletir a delicadeza de um bom atendimento.",
  image: {
    src: "/images/cta-portrait.jpg",
    alt: "Retrato editorial de uma mulher de cabelos longos e pele natural sobre fundo verde profundo.",
    pos: "50% 30%",
  } satisfies Img,
};
