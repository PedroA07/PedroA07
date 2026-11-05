// Todo o texto dos SVGs mora aqui. Depois de editar, rode: node scripts/gerar-svgs.mjs

export const CAPA = {
  edicao: 'EDIÇÃO Nº 09 · ESPECIAL ENGENHARIA',
  local: 'SÃO PAULO · BR',
  preco: 'GRÁTIS P/ RECRUTADORES',
  etiquetas: ['ENGENHEIRO DE SOFTWARE', 'FULL STACK', 'DADOS & IA', 'CYBER SEC ↻'],
  chamada:
    'Ele projeta sistemas de ponta a ponta, treina modelos, faz jogo na Unity… e agora aprende a invadir o que ele mesmo construiu.',
  chamadaEn: 'He builds end-to-end systems, trains models, makes Unity games… and now learns to break into them.',
};

export const WHOAMI = {
  sobre:
    'Engenheiro de software e dev full stack. Gosto de pegar um problema confuso e devolver um sistema rodando — da arquitetura e do banco ao app no celular. Fundador da Nexus.',
  sobreEn: 'Software engineer & full-stack dev. From architecture and databases to mobile.',
  habilidades: [
    ['OK', 'Análise e Desenv. de Sistemas — UNIP'],
    ['OK', 'Ciência de Dados'],
    ['OK', 'Machine Learning'],
    ['..', 'Cyber Segurança'],
  ],
};

export const FICHA = {
  campos: [
    ['classe', 'Eng. de Software'],
    ['subclasse', 'Cientista de Dados'],
    ['em treino', 'Hacker Ético'],
  ],
  atributos: [
    ['ARQUITETURA', 8],
    ['BACK-END', 8],
    ['FRONT-END', 8],
    ['BANCO DE DADOS', 8],
    ['DADOS / ML', 7],
    ['MOBILE', 6],
    ['GAME DEV', 5],
    ['SEGURANÇA', 4],
  ],
  golpe: 'requisito confuso → sistema em produção',
};

export const MISSOES = [
  {
    arquivo: 'missao-sonara',
    etiqueta: 'CAP. 2 · MISSÕES EM DESTAQUE',
    nome: 'Sonara',
    tipo: 'MISSÃO PRINCIPAL',
    emoji: '🎵',
    onomatopeia: 'TUM-TSS!',
    cor: '#c4471f',
    resumo: 'Player de música desktop que baixa com capa e metadados, organiza a biblioteca e exporta até pro som do carro.',
    resumoEn: 'Desktop music player: downloads with art and tags, organizes your library, exports to your car stereo.',
    stack: 'tauri 2 · react · typescript · sqlite',
    linguagem: 'TypeScript',
    acao: 'baixar',
  },
  {
    // PENDÊNCIA: preencher descrição e stack. O link fica no README.md.
    arquivo: 'missao-mandachuva',
    nome: 'Mandachuva',
    tipo: 'BOT · SITE',
    emoji: '🤠',
    onomatopeia: 'MANDA!',
    cor: '#1f6feb',
    resumo: 'Site do bot Mandachuva — descrição curta do que ele faz aqui.',
    resumoEn: '',
    stack: 'stack do projeto aqui',
    linguagem: 'JavaScript',
    acao: 'ver site',
  },
];

export const MISSOES_SECRETAS = ['Operacional SSZ', 'James (IA)', 'Nexus Control', 'MatchBox', 'VTT RPG na Unity'];

export const CTF = {
  nivel1Base64: 'ZmxhZ3tjdXJpb3NvX2VoX2Vsb2dpb30=',
  dica: 'dica: 64 é um número bonito',
  titulo: ['Tem uma flag escondida', 'neste perfil.'],
  texto: 'Decifre, abra uma issue com ela e seu @ entra no hall da fama. Três níveis: o 1 está aqui, o 2 no código-fonte do README, o 3 num commit antigo.',
  textoEn: 'Decode it, open an issue and your @ joins the hall of fame.',
};

const ladrilhos = (lista) =>
  lista.split('|').map((item) => {
    const [marca, nome, fundo, cor = '#ffffff'] = item.split(',');
    return { marca, nome, fundo, cor };
  });

export const INVENTARIO = [
  {
    grupo: 'ARMAS PRINCIPAIS',
    nota: 'uso todo dia',
    cor: '#c4471f',
    itens: ladrilhos(
      'TS,TypeScript,#3178c6|JS,JavaScript,#f1c75b,#17140f|Py,Python,#3776ab|⚛,React,#20232a,#61dafb|N›,Next.js,#17140f|Nd,Node,#3c873a|Tw,Tailwind,#0ea5b7|Fa,FastAPI,#009688',
    ),
  },
  {
    grupo: 'ARMADURA (DADOS)',
    nota: 'onde tudo mora',
    cor: '#1f6feb',
    itens: ladrilhos(
      'Sb,Supabase,#3ecf8e,#17140f|Pg,Postgres,#336791|My,MySQL,#e48e00|Mg,MongoDB,#4ea94b|Sq,SQLite,#0f4c6b|pv,pgvector,#6e40c9',
    ),
  },
  {
    grupo: 'MAGIAS (IA/ML)',
    nota: 'concluído ✓',
    cor: '#1a7f37',
    itens: ladrilhos(
      'Pd,Pandas,#150458|Np,NumPy,#4dabcf|Sk,scikit-learn,#f7931e,#17140f|Tf,TensorFlow,#ff6f00|Jp,Jupyter,#f37626|AI,Claude API,#d97757',
    ),
  },
  {
    grupo: 'MONTARIAS',
    nota: 'mobile, desktop, jogos',
    cor: '#8250df',
    itens: ladrilhos(
      'RN,React Native,#20232a,#61dafb|Ta,Tauri,#24c8db,#17140f|El,Electron,#47848f|U,Unity,#17140f|C#,C#,#68217a|Bl,Blender,#e87d0d',
    ),
  },
  {
    grupo: 'FURTIVIDADE (SEC)',
    nota: 'em treino ↻',
    cor: '#cf222e',
    itens: ladrilhos(
      '$_,Linux,#17140f,#56d364|Kl,Kali,#268bee|Nm,Nmap,#4b0082|Bp,Burp,#ff6633|Ws,Wireshark,#1679a7|Dk,Docker,#2496ed|Gt,Git,#f05032',
    ),
  },
];

export const CONQUISTAS = [
  { icone: '🎓', titulo: 'Formado', texto: 'ADS · UNIP', textoEn: 'graduated' },
  { icone: '🧠', titulo: 'Mente de Dados', texto: 'Ciência de Dados concluído', textoEn: 'data science, done' },
  { icone: '🤖', titulo: 'Treinador de Modelos', texto: 'Machine Learning concluído', textoEn: 'machine learning, done' },
  { icone: '🏢', titulo: 'Fundador', texto: 'abriu a Nexus', textoEn: 'founded Nexus' },
  { icone: '🎧', titulo: 'DJ de Terminal', texto: 'fez 2 players de música', textoEn: 'built 2 music players' },
  { icone: '🔓', titulo: 'Hacker Ético', texto: 'Cyber Segurança', textoEn: 'locked', progresso: 70 },
];

export const CONTATO = {
  chamada: '▶ PRESS START PARA CONECTAR',
  titulo: 'Vamos construir algo?',
  tituloEn: 'Let’s build something.',
  botoes: [
    { arquivo: 'botao-linkedin', texto: '[A] LINKEDIN', fundo: '#56d364', cor: '#0d1117', sombra: '#1a7f37' },
    { arquivo: 'botao-portfolio', texto: '[B] NEXUS · PORTFÓLIO', fundo: '#17140f', cor: '#f2eee6', sombra: '#f1c75b' },
    { arquivo: 'botao-steam', texto: '[X] STEAM', fundo: '#17140f', cor: '#66c0f4', sombra: '#66c0f4' },
  ],
};
