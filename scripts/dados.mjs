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
    nome: 'Sonara',
    tipo: 'MISSÃO PRINCIPAL',
    imagem: 'sonara.jpg',
    onomatopeia: 'TUM-TSS!',
    resumo:
      'Player de música desktop que baixa com capa e metadados, organiza a biblioteca e exporta até pro som do carro. Tem letra sincronizada e modo vídeo, em Windows, macOS e Linux.',
    resumoEn:
      'Desktop music player: downloads with art and tags, organizes your library, exports to your car stereo. Synced lyrics and video mode on Windows, macOS and Linux.',
    stack: 'tauri 2 · react · typescript · sqlite',
    linguagem: 'TypeScript',
    acao: 'baixar',
  },
  {
    arquivo: 'missao-mandachuva',
    nome: 'Manda Chuva',
    tipo: 'BOT · SITE',
    imagem: 'manda-chuva.jpg',
    onomatopeia: 'MANDA!',
    resumo:
      'O bot oficial da resenha no Discord: cargos de cor, boas-vindas com card, festas que se trocam sozinhas, aniversários, tickets, moderação e perfil com medalhas, tudo num painel com login do Discord.',
    resumoEn:
      'Discord bot with color roles, welcome cards, self-changing holiday themes, birthdays, tickets, moderation and profile medals, all set up from a web panel.',
    stack: 'discord.js · node 22 · preact · three.js',
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

/** A marca é o nome de um logo de scripts/icones.mjs ou, se ele não existir, letras. */
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
      'typescript,TypeScript,#3178c6|javascript,JavaScript,#f1c75b,#17140f|python,Python,#3776ab|react,React,#20232a,#61dafb|nextdotjs,Next.js,#17140f|nodedotjs,Node,#3c873a|tailwindcss,Tailwind,#0ea5b7|fastapi,FastAPI,#009688',
    ),
  },
  {
    grupo: 'ARMADURA (DADOS)',
    nota: 'onde tudo mora',
    cor: '#1f6feb',
    itens: ladrilhos(
      'supabase,Supabase,#3ecf8e,#17140f|postgresql,Postgres,#336791|mysql,MySQL,#e48e00|mongodb,MongoDB,#4ea94b|sqlite,SQLite,#0f4c6b|pv,pgvector,#6e40c9',
    ),
  },
  {
    grupo: 'MAGIAS (IA/ML)',
    nota: 'concluído ✓',
    cor: '#1a7f37',
    itens: ladrilhos(
      'pandas,Pandas,#150458|numpy,NumPy,#4dabcf|scikitlearn,scikit-learn,#f7931e,#17140f|tensorflow,TensorFlow,#ff6f00|jupyter,Jupyter,#f37626|anthropic,Claude API,#d97757',
    ),
  },
  {
    grupo: 'MONTARIAS',
    nota: 'mobile, desktop, jogos',
    cor: '#8250df',
    itens: ladrilhos(
      'react,React Native,#20232a,#61dafb|tauri,Tauri,#24c8db,#17140f|electron,Electron,#47848f|unity,Unity,#17140f|C#,C#,#68217a|blender,Blender,#e87d0d',
    ),
  },
  {
    grupo: 'FURTIVIDADE (SEC)',
    nota: 'em treino ↻',
    cor: '#cf222e',
    itens: ladrilhos(
      'linux,Linux,#17140f,#f1c75b|kalilinux,Kali,#268bee|Nm,Nmap,#4b0082|burpsuite,Burp Suite,#ff6633|wireshark,Wireshark,#1679a7|docker,Docker,#2496ed|git,Git,#f05032',
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
  // Sem logo em scripts/icones.mjs, o botão da Nexus desenha o N do próprio site.
  botoes: [
    { arquivo: 'botao-linkedin', texto: 'LinkedIn', logo: 'linkedin', fundo: '#0a66c2', cor: '#ffffff', borda: '#f2eee6' },
    { arquivo: 'botao-portfolio', texto: 'Nexus · Portfólio', fundo: '#0b1b3b', cor: '#00e5ff', borda: '#00e5ff' },
    { arquivo: 'botao-steam', texto: 'Steam', logo: 'steam', fundo: ['#171a21', '#1b2838'], cor: '#ffffff', borda: '#66c0f4' },
  ],
};
