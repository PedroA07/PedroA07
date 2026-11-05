import { CONTATO } from '../dados.mjs';
import { COR, esc, fatia, icone, quadro } from '../kit.mjs';

// Card único com os três botões empilhados à direita. Cada botão tem o próprio link, e o README
// só emenda imagens linha a linha: cada linha é uma fatia do card mais um botão, na mesma altura.
// Os cortes passam entre os textos, para nenhuma letra ficar dividida entre duas imagens.
const LARGURA = 900;
const ALTURA = 204;
const CORTE_X = 612;
const CORTES_Y = [0, 68, 136, ALTURA];
const X_BOTAO = 627;
const Y_BOTOES = [11, 77, 143];
const LARGURA_BOTAO = 236;
const ALTURA_BOTAO = 44;
const LOGO_NEXUS = 'M4 20V4l16 16V4';

const fundo = quadro({ largura: LARGURA, altura: ALTURA, topo: 0, fundo: COR.tinta, sombra: COR.verde });

const css = `
@keyframes pisca{0%,49%{opacity:1}50%,100%{opacity:0}}
.pisca{animation:pisca 1.2s steps(1) infinite}
`;

const LINHAS = [
  {
    titulo: 'Press start para conectar.',
    css,
    texto: `<text class="pisca" x="30" y="54" font-size="13" font-weight="800" letter-spacing="1.8" fill="${COR.ouro}">${esc(CONTATO.chamada)}</text>`,
  },
  {
    titulo: CONTATO.titulo,
    texto: `<text class="sans" x="30" y="114" font-size="38" font-weight="900" letter-spacing="-1.2" fill="${COR.papel}">${esc(CONTATO.titulo)}</text>`,
  },
  {
    titulo: CONTATO.tituloEn,
    texto: `<text class="serif" x="30" y="160" font-size="20" font-style="italic" fill="#cfc8bb">${esc(CONTATO.tituloEn)}</text>`,
  },
];

const janela = (indice) => ({ y: CORTES_Y[indice], altura: CORTES_Y[indice + 1] - CORTES_Y[indice] });

export const contatos = () =>
  LINHAS.map(({ titulo, css: estilo, texto }, i) => [
    `contato-${i + 1}`,
    fatia({ ...janela(i), largura: CORTE_X, titulo, css: estilo, corpo: `${fundo}\n${texto}` }),
  ]);

export function botao({ texto, logo, fundo: cores, cor, borda }, indice) {
  const y = Y_BOTOES[indice];
  const gradiente = Array.isArray(cores);
  const defs = gradiente
    ? `<linearGradient id="fundo-botao"><stop offset="0" stop-color="${cores[0]}"/><stop offset="1" stop-color="${cores[1]}"/></linearGradient>`
    : '';
  const desenho = logo
    ? icone(logo, { x: X_BOTAO + 18, y: y + 13, tamanho: 18 })
    : `<g transform="translate(${X_BOTAO + 18} ${y + 13}) scale(.75)"><path fill="none" stroke="${cor}" stroke-width="3" stroke-linejoin="round" d="${LOGO_NEXUS}"/></g>`;

  return fatia({
    ...janela(indice),
    x: CORTE_X,
    largura: LARGURA - CORTE_X,
    titulo: texto,
    defs,
    corpo: `${fundo}
<rect x="${X_BOTAO + 3}" y="${y + 3}" width="${LARGURA_BOTAO}" height="${ALTURA_BOTAO}" fill="${borda}" opacity=".33"/>
<rect x="${X_BOTAO + 1}" y="${y + 1}" width="${LARGURA_BOTAO - 2}" height="${ALTURA_BOTAO - 2}" fill="${gradiente ? 'url(#fundo-botao)' : cores}" stroke="${borda}" stroke-width="2"/>
${desenho}
<text class="sans" x="${X_BOTAO + 46}" y="${y + 27}" font-size="15" font-weight="700" fill="${cor}">${esc(texto)}</text>`,
  });
}

export const botoes = () => CONTATO.botoes.map((dados, i) => [dados.arquivo, botao(dados, i)]);
