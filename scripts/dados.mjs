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

/** Nome, ícone de scripts/icones/ e, para o que não tem logo, as letras e a cor de fundo. */
const ladrilhos = (lista) =>
  lista.split('|').map((item) => {
    const [nome, icone, marca, fundo] = item.split(',');
    return { nome, icone, marca, fundo };
  });

export const INVENTARIO = [
  {
    grupo: 'ARMAS PRINCIPAIS',
    nota: 'uso todo dia',
    cor: '#c4471f',
    itens: ladrilhos(
      'TypeScript,typescript|JavaScript,javascript|Python,python|React,react|Next.js,nextdotjs|Node,nodedotjs|Tailwind,tailwindcss|FastAPI,fastapi',
    ),
  },
  {
    grupo: 'ARMADURA (DADOS)',
    nota: 'onde tudo mora',
    cor: '#1f6feb',
    itens: ladrilhos(
      'Supabase,supabase|Postgres,postgresql|MySQL,mysql|MongoDB,mongodb|SQLite,sqlite|pgvector,,pv,#336791',
    ),
  },
  {
    grupo: 'MAGIAS (IA/ML)',
    nota: 'concluído ✓',
    cor: '#1a7f37',
    itens: ladrilhos(
      'Pandas,pandas|NumPy,numpy|scikit-learn,scikitlearn|TensorFlow,tensorflow|Jupyter,jupyter|Claude API,anthropic',
    ),
  },
  {
    grupo: 'MONTARIAS',
    nota: 'mobile, desktop, jogos',
    cor: '#8250df',
    itens: ladrilhos(
      'React Native,react|Tauri,tauri|Electron,electron|Unity,unity|C#,,C#,#68217a|Blender,blender',
    ),
  },
  {
    grupo: 'FURTIVIDADE (SEC)',
    nota: 'em treino ↻',
    cor: '#cf222e',
    itens: ladrilhos(
      'Linux,linux|Kali,kalilinux|Nmap,,Nm,#4b0082|Burp Suite,burpsuite|Wireshark,wireshark|Docker,docker|Git,git',
    ),
  },
];

export const CONQUISTAS = [
  { icone: 'ach-grad', titulo: 'Formado', texto: 'ADS · UNIP', textoEn: 'graduated' },
  { icone: 'ach-brain', titulo: 'Mente de Dados', texto: 'Ciência de Dados concluído', textoEn: 'data science, done' },
  { icone: 'ach-robot', titulo: 'Treinador de Modelos', texto: 'Machine Learning concluído', textoEn: 'machine learning, done' },
  { icone: 'ach-founder', titulo: 'Fundador', texto: 'abriu a Nexus', textoEn: 'founded Nexus' },
  { icone: 'ach-dj', titulo: 'DJ de Terminal', texto: 'fez 2 players de música', textoEn: 'built 2 music players' },
  { icone: 'ach-lock', titulo: 'Hacker Ético', texto: 'Cyber Segurança', textoEn: 'locked', progresso: 70 },
];

export const CONTATO = {
  chamada: '▶ PRESS START PARA CONECTAR',
  titulo: 'Vamos construir algo?',
  tituloEn: 'Let’s build something.',
  // A Nexus não tem arquivo em scripts/icones/: o botão desenha o N do próprio site.
  botoes: [
    { arquivo: 'botao-linkedin', texto: 'LinkedIn', logo: 'logo-linkedin', fundo: '#0a66c2', cor: '#ffffff', borda: '#f2eee6' },
    { arquivo: 'botao-portfolio', texto: 'Nexus · Portfólio', fundo: '#0b1b3b', cor: '#00e5ff', borda: '#00e5ff' },
    { arquivo: 'botao-steam', texto: 'Steam', logo: 'logo-steam', fundo: ['#171a21', '#1b2838'], cor: '#ffffff', borda: '#66c0f4' },
  ],
};
