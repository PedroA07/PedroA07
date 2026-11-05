import { CAPA } from '../dados.mjs';
import { COR, esc, larguraMono, linhasDeTexto, padraoPontos, quebrar, reticula, svg } from '../kit.mjs';

const LARGURA = 900;
const ALTURA = 424;
const LINHA_DO_TOPO = 46;

const css = `
@keyframes balanca{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes pisca{0%,49%{opacity:1}50%,100%{opacity:0}}
.balao{transform-origin:700px 168px;animation:balanca 2.4s ease-in-out infinite}
.cursor{animation:pisca 1s steps(1) infinite}
.titulo{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:900;letter-spacing:-.06em}
`;

function etiquetas(y) {
  let x = 30;
  return CAPA.etiquetas
    .map((texto, i) => {
      const largura = larguraMono(texto, 12) + 20;
      const preenchida = i === 0 || i === CAPA.etiquetas.length - 1;
      const fundo = i === 0 ? COR.tinta : i === CAPA.etiquetas.length - 1 ? COR.laranja : 'none';
      const contorno = preenchida ? '' : ` stroke="${COR.tinta}" stroke-width="2"`;
      const cor = preenchida ? COR.papel : COR.tinta;
      const peca = `<rect x="${x}" y="${y}" width="${largura}" height="26" fill="${fundo}"${contorno}/><text x="${x + 10}" y="${y + 17.5}" font-size="12" font-weight="800" fill="${cor}">${esc(texto)}</text>`;
      x += largura + 8;
      return peca;
    })
    .join('\n');
}

/** O mascote: cabeça de monitor, >_ verde piscando e fone laranja. */
function mascote(x, y) {
  return `<g transform="translate(${x} ${y})">
<rect x="6" y="6" width="210" height="210" fill="${COR.tinta}"/>
<rect x="1.5" y="1.5" width="207" height="207" fill="${COR.ouro}" stroke="${COR.tinta}" stroke-width="3"/>
<rect x="3" y="3" width="204" height="204" fill="url(#pontos-mascote)"/>
<path d="M30 207 C40 160 170 160 180 207Z" fill="${COR.tinta}"/>
<path d="M78 175 L105 196 L132 175" fill="none" stroke="${COR.verde}" stroke-width="5"/>
<path d="M46 104 C46 22 164 22 164 104" fill="none" stroke="${COR.tinta}" stroke-width="11" stroke-linecap="round"/>
<path d="M46 104 C46 22 164 22 164 104" fill="none" stroke="${COR.laranja}" stroke-width="5" stroke-linecap="round"/>
<rect x="58" y="58" width="94" height="88" rx="14" fill="${COR.terminal}" stroke="${COR.tinta}" stroke-width="5"/>
<rect x="66" y="66" width="78" height="72" rx="8" fill="#0f1a12"/>
<text x="78" y="113" font-size="34" font-weight="900" fill="${COR.verde}">&gt;</text>
<rect class="cursor" x="100" y="110" width="22" height="5" fill="${COR.verde}"/>
<rect x="34" y="90" width="22" height="34" rx="7" fill="${COR.laranja}" stroke="${COR.tinta}" stroke-width="5"/>
<rect x="154" y="90" width="22" height="34" rx="7" fill="${COR.laranja}" stroke="${COR.tinta}" stroke-width="5"/>
<circle cx="105" cy="152" r="4" fill="${COR.tinta}"/>
</g>`;
}

function balao() {
  return `<g class="balao">
<path d="M516 70 H656 Q672 70 672 86 V116 Q672 132 656 132 H650 L700 168 L622 132 H516 Q500 132 500 116 V86 Q500 70 516 70 Z" fill="${COR.branco}" stroke="${COR.tinta}" stroke-width="3" stroke-linejoin="round"/>
<text class="gibi" x="586" y="100" text-anchor="middle" font-size="19" font-weight="800" fill="${COR.tinta}">Olá, mundo!</text>
<text class="gibi" x="586" y="119" text-anchor="middle" font-size="11.5" fill="${COR.marrom}">hello, world!</text>
</g>`;
}

export function capa() {
  const reticulaDaCapa = reticula({
    cx: LARGURA - 8,
    cy: LINHA_DO_TOPO + 2,
    alcance: 430,
    passo: 13,
    raioMaximo: 5.4,
    cor: COR.laranja,
    dentro: (x, y) => y > LINHA_DO_TOPO + 3 && x < LARGURA - 11 && y < ALTURA - 11,
  });

  const corpo = `<rect x="8" y="8" width="${LARGURA - 8}" height="${ALTURA - 8}" fill="${COR.laranja}"/>
<rect x="1.5" y="1.5" width="${LARGURA - 11}" height="${ALTURA - 11}" fill="${COR.papel}" stroke="${COR.tinta}" stroke-width="3"/>
${reticulaDaCapa}
<g class="sans" font-size="11" font-weight="800" letter-spacing="1.5">
<text class="sans" x="30" y="32" fill="${COR.tinta}">${esc(CAPA.edicao)}</text>
<text class="sans" x="${LARGURA / 2 + 26}" y="32" text-anchor="middle" fill="${COR.tinta}">${esc(CAPA.local)}</text>
<text class="sans" x="${LARGURA - 34}" y="32" text-anchor="end" fill="${COR.laranja}">${esc(CAPA.preco)}</text>
</g>
<rect x="30" y="${LINHA_DO_TOPO - 3}" width="${LARGURA - 64}" height="3" fill="${COR.tinta}"/>
<text class="titulo" x="26" y="156" font-size="128" fill="${COR.tinta}">Pedro</text>
<text class="titulo" x="34" y="262" font-size="128" fill="${COR.tinta}">Andrade<tspan fill="${COR.laranja}">.</tspan></text>
${etiquetas(286)}
${linhasDeTexto(quebrar(CAPA.chamada, 68), {
  x: 30,
  y: 346,
  altura: 25,
  atributos: `class="serif" font-size="18.5" font-style="italic" fill="${COR.tinta}"`,
})}
${linhasDeTexto(quebrar(CAPA.chamadaEn, 100), {
  x: 30,
  y: 398,
  altura: 16,
  atributos: `class="serif" font-size="12" font-style="italic" fill="${COR.marrom}"`,
})}
${mascote(650, 128)}
<rect x="656" y="352" width="204" height="26" fill="${COR.papel}" stroke="${COR.tinta}" stroke-width="2"/>
<text x="758" y="369.5" text-anchor="middle" font-size="11" font-weight="800" letter-spacing="1.1" fill="${COR.tinta}">▶ PLAYER 1 <tspan fill="#1a7f37">● ONLINE</tspan></text>
${balao()}`;

  return svg({
    largura: LARGURA,
    altura: ALTURA,
    titulo: 'Capa de revista: Pedro Andrade, engenheiro de software. Edição 09, especial engenharia.',
    css,
    defs: padraoPontos({ id: 'pontos-mascote', passo: 8, raio: 1.6, cor: COR.laranja, opacidade: 0.45 }),
    corpo,
  });
}
