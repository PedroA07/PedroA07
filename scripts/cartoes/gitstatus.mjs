import { COR, esc, etiqueta, quadro, svg } from '../kit.mjs';

// Diferente dos outros cards, este não mora em assets/: o Action gera todo dia com dados reais
// e publica na branch output, ao lado da cobra. Ver .github/scripts/git-status.mjs.
const LARGURA = 900;
const ALTURA = 306;
const X_ESQUERDA = 22;
const LARGURA_ESQUERDA = 458;
const X_DIREITA = 500;
const LARGURA_DIREITA = 366;
const COR_VAZIA = COR.apagado;

const curto = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n));

function tile({ rotulo, valor, cor, nota }, x, y, largura) {
  return `<rect x="${x + 1}" y="${y + 1}" width="${largura - 2}" height="66" fill="${COR.painel}" stroke="${COR.linha}" stroke-width="2"/>
<text x="${x + 11}" y="${y + 19}" font-size="10" letter-spacing=".8" fill="${COR.apagado}">${esc(rotulo)}</text>
<text x="${x + 11}" y="${y + 44}" font-size="23" font-weight="900" letter-spacing="-.4" fill="${cor}">${esc(valor)}</text>
<text x="${x + 11}" y="${y + 58}" font-size="10" fill="${COR.sub}">${esc(nota)}</text>`;
}

function colunaEsquerda(dados) {
  const tiles = [
    { rotulo: 'COMMITS', valor: curto(dados.commits), cor: COR.verde, nota: 'este ano' },
    { rotulo: 'PULL REQUESTS', valor: curto(dados.prs), cor: COR.azul, nota: 'abertos + merged' },
    { rotulo: 'ISSUES', valor: curto(dados.issues), cor: COR.ambar, nota: 'abertas por mim' },
    { rotulo: 'REPOS', valor: curto(dados.repos), cor: COR.texto, nota: 'públicos' },
    { rotulo: 'ESTRELAS', valor: `★ ${curto(dados.estrelas)}`, cor: COR.ambar, nota: 'recebidas' },
    { rotulo: 'SEGUIDORES', valor: curto(dados.seguidores), cor: COR.rosa, nota: 'party atual' },
  ];
  const largura = (LARGURA_ESQUERDA - 16) / 3;
  const grade = tiles
    .map((t, i) => tile(t, X_ESQUERDA + (i % 3) * (largura + 8), 62 + Math.floor(i / 3) * 74, largura))
    .join('\n');

  const { nivel, progresso } = dados.nivel;
  const xBarra = X_ESQUERDA + 60;
  const larguraBarra = LARGURA_ESQUERDA - 60 - 104;
  return `<text x="${X_ESQUERDA}" y="50" font-size="13" fill="${COR.apagado}"><tspan fill="${COR.verde}">➜</tspan> <tspan fill="${COR.azul}">~</tspan> git status --perfil</text>
${grade}
<line x1="${X_ESQUERDA}" y1="222" x2="${X_ESQUERDA + LARGURA_ESQUERDA}" y2="222" stroke="${COR.linha}" stroke-dasharray="3 3"/>
<text x="${X_ESQUERDA}" y="246" font-size="12" fill="${COR.ambar}">LV ${nivel}</text>
<rect x="${xBarra}" y="236" width="${larguraBarra}" height="12" fill="${COR.vazio}" stroke="${COR.tinta}" stroke-width="2"/>
<rect x="${xBarra + 1}" y="237" width="${((larguraBarra - 2) * progresso).toFixed(1)}" height="10" fill="${COR.azul}"/>
<text x="${X_ESQUERDA + LARGURA_ESQUERDA}" y="246" text-anchor="end" font-size="11.5" fill="${COR.apagado}">XP → LV ${nivel + 1}</text>
<text x="${X_ESQUERDA}" y="272" font-size="10.5" fill="${COR.apagado}">nível = commits + PRs×5 + estrelas×10</text>`;
}

function sequencia({ atual, recorde }) {
  const largura = (LARGURA_DIREITA - 8) / 2;
  const x2 = X_DIREITA + largura + 8;
  const meio = X_DIREITA + largura / 2;
  const meio2 = x2 + largura / 2;
  return `<rect x="${X_DIREITA + 1}" y="35" width="${largura - 2}" height="78" fill="#1a1208" stroke="#e8794f" stroke-width="2"/>
<text class="emoji" x="${meio}" y="58" text-anchor="middle" font-size="20">🔥</text>
<text x="${meio}" y="84" text-anchor="middle" font-size="22" font-weight="900" fill="${COR.texto}">${atual}</text>
<text x="${meio}" y="102" text-anchor="middle" font-size="10" fill="#e8794f">dias seguidos</text>
<rect x="${x2 + 1}" y="35" width="${largura - 2}" height="78" fill="${COR.painel}" stroke="${COR.linha}" stroke-width="2"/>
<text x="${meio2}" y="56" text-anchor="middle" font-size="10" fill="${COR.apagado}">RECORDE</text>
<text x="${meio2}" y="84" text-anchor="middle" font-size="22" font-weight="900" fill="${COR.texto}">${recorde}</text>
<text x="${meio2}" y="102" text-anchor="middle" font-size="10" fill="${COR.sub}">dias</text>`;
}

function barraDeLinguagens(linguagens) {
  const y = 142;
  let x = X_DIREITA + 2;
  const miolo = LARGURA_DIREITA - 4;
  const fatias = linguagens
    .map(({ pct, cor }) => {
      const largura = (miolo * pct) / 100;
      const parte = `<rect x="${x.toFixed(1)}" y="${y + 2}" width="${largura.toFixed(1)}" height="10" fill="${cor ?? COR_VAZIA}"/>`;
      x += largura;
      return parte;
    })
    .join('');
  const legenda = linguagens
    .map(({ nome, pct, cor }, i) => {
      const lx = X_DIREITA + (i % 2) * (LARGURA_DIREITA / 2);
      const ly = 172 + Math.floor(i / 2) * 16;
      return `<rect x="${lx + .5}" y="${ly - 8.5}" width="9" height="9" fill="${cor ?? COR_VAZIA}" stroke="${COR.tinta}"/>
<text x="${lx + 15}" y="${ly}" font-size="11" fill="${COR.corpo}">${esc(nome)} <tspan fill="${COR.apagado}">${pct}%</tspan></text>`;
    })
    .join('\n');
  return `<text x="${X_DIREITA}" y="133" font-size="10" letter-spacing=".8" fill="${COR.apagado}">LINGUAGENS MAIS USADAS</text>
<rect x="${X_DIREITA + 1}" y="${y + 1}" width="${LARGURA_DIREITA - 2}" height="12" fill="${COR.vazio}" stroke="${COR.tinta}" stroke-width="2"/>
${fatias}
${legenda}`;
}

function barrasDaSemana(semana) {
  const topo = 222;
  const altura = 40;
  const maior = Math.max(1, ...semana.map((d) => d.total));
  const passo = LARGURA_DIREITA / 7;
  return semana
    .map(({ letra, total }, i) => {
      const x = X_DIREITA + i * passo;
      const h = Math.max(3, (altura * total) / maior);
      return `<rect x="${x.toFixed(1)}" y="${(topo + altura - h).toFixed(1)}" width="${(passo - 4).toFixed(1)}" height="${h.toFixed(1)}" fill="${total ? COR.verde : COR.linha}" stroke="${COR.tinta}"/>
<text x="${(x + (passo - 4) / 2).toFixed(1)}" y="${topo + altura + 13}" text-anchor="middle" font-size="9" fill="${COR.apagado}">${esc(letra)}</text>`;
    })
    .join('\n');
}

export function gitStatus(dados) {
  const nomes = dados.linguagens.map(({ nome, pct }) => `${nome} ${pct}%`).join(', ');
  const titulo = `Placar do GitHub: ${dados.commits} commits este ano, ${dados.prs} pull requests, ${dados.issues} issues, ${dados.repos} repositórios públicos, ${dados.estrelas} estrelas, ${dados.seguidores} seguidores. Nível ${dados.nivel.nivel}. Sequência de ${dados.sequencia.atual} dias, recorde de ${dados.sequencia.recorde}. Linguagens: ${nomes}.`;
  const corpo = `${quadro({ largura: LARGURA, altura: ALTURA, fundo: COR.terminal, sombra: COR.azul })}
${colunaEsquerda(dados)}
${sequencia(dados.sequencia)}
${barraDeLinguagens(dados.linguagens)}
${barrasDaSemana(dados.semana)}
${etiqueta({ texto: 'PLACAR · GIT STATUS', fundo: COR.azul })}`;
  return svg({ largura: LARGURA, altura: ALTURA, titulo, corpo });
}
