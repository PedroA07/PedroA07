import { CONTATO } from '../dados.mjs';
import { ICONES } from '../icones.mjs';
import { COR, esc, fatia, quadro } from '../kit.mjs';

// Card único com os três botões empilhados à direita. Cada botão tem o próprio link,
// então o card sai fatiado: a chamada à esquerda e uma fatia para cada botão.
const LARGURA = 900;
const ALTURA = 192;
const CORTE_X = 612;
const CORTES_Y = [0, 65, 121, ALTURA];
const X_BOTAO = 627;
const Y_BOTOES = [16, 72, 128];
const LARGURA_BOTAO = 236;
const ALTURA_BOTAO = 42;
const LOGO_NEXUS = 'M4 20V4l16 16V4';

const fundo = quadro({ largura: LARGURA, altura: ALTURA, topo: 0, fundo: COR.tinta, sombra: COR.verde });

export function contato() {
  const css = `
@keyframes pisca{0%,49%{opacity:1}50%,100%{opacity:0}}
.pisca{animation:pisca 1.2s steps(1) infinite}
`;
  return fatia({
    largura: CORTE_X,
    altura: ALTURA,
    titulo: `Press start. ${CONTATO.titulo} ${CONTATO.tituloEn}`,
    css,
    corpo: `${fundo}
<text class="pisca" x="30" y="58" font-size="13" font-weight="800" letter-spacing="1.8" fill="${COR.ouro}">${esc(CONTATO.chamada)}</text>
<text class="sans" x="30" y="106" font-size="38" font-weight="900" letter-spacing="-1.2" fill="${COR.papel}">${esc(CONTATO.titulo)}</text>
<text class="serif" x="30" y="140" font-size="20" font-style="italic" fill="#cfc8bb">${esc(CONTATO.tituloEn)}</text>`,
  });
}

export function botao({ texto, logo, fundo: cores, cor, borda }, indice) {
  const y = Y_BOTOES[indice];
  const gradiente = Array.isArray(cores);
  const defs = gradiente
    ? `<linearGradient id="fundo-botao"><stop offset="0" stop-color="${cores[0]}"/><stop offset="1" stop-color="${cores[1]}"/></linearGradient>`
    : '';
  const desenho = logo
    ? `<path fill="${cor}" d="${ICONES[logo]}"/>`
    : `<path fill="none" stroke="${cor}" stroke-width="3" stroke-linejoin="round" d="${LOGO_NEXUS}"/>`;

  return fatia({
    x: CORTE_X,
    y: CORTES_Y[indice],
    largura: LARGURA - CORTE_X,
    altura: CORTES_Y[indice + 1] - CORTES_Y[indice],
    titulo: texto,
    defs,
    corpo: `${fundo}
<rect x="${X_BOTAO + 3}" y="${y + 3}" width="${LARGURA_BOTAO}" height="${ALTURA_BOTAO}" fill="${borda}" opacity=".33"/>
<rect x="${X_BOTAO + 1}" y="${y + 1}" width="${LARGURA_BOTAO - 2}" height="${ALTURA_BOTAO - 2}" fill="${gradiente ? 'url(#fundo-botao)' : cores}" stroke="${borda}" stroke-width="2"/>
<g transform="translate(${X_BOTAO + 18} ${y + 12}) scale(.75)">${desenho}</g>
<text class="sans" x="${X_BOTAO + 46}" y="${y + 26}" font-size="15" font-weight="700" fill="${cor}">${esc(texto)}</text>`,
  });
}

export const botoes = () => CONTATO.botoes.map((dados, i) => [dados.arquivo, botao(dados, i)]);
