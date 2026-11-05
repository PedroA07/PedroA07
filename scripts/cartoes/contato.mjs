import { CONTATO } from '../dados.mjs';
import { COR, esc, quadro, svg } from '../kit.mjs';

/** Controle desenhado à mão: os botões A, B e X são os três botões de link logo abaixo no README. */
function controle(x, y) {
  const botaoRedondo = (cx, cy, letra, cor) =>
    `<circle cx="${cx}" cy="${cy}" r="14" fill="${cor}" stroke="${COR.tinta}" stroke-width="3"/><text x="${cx}" y="${cy + 4.5}" text-anchor="middle" font-size="13" font-weight="900" fill="${COR.tinta}">${letra}</text>`;
  return `<g transform="translate(${x} ${y})">
<rect x="5" y="5" width="232" height="104" fill="${COR.verde}"/>
<rect x="1.5" y="1.5" width="229" height="101" fill="${COR.papel}" stroke="${COR.tinta}" stroke-width="3"/>
<rect x="44" y="26" width="16" height="52" fill="${COR.tinta}"/>
<rect x="26" y="44" width="52" height="16" fill="${COR.tinta}"/>
<rect x="96" y="58" width="24" height="8" fill="${COR.marrom}"/>
<text x="108" y="50" text-anchor="middle" font-size="8" font-weight="800" letter-spacing=".6" fill="${COR.marrom}">START</text>
${botaoRedondo(146, 66, 'X', '#66c0f4')}
${botaoRedondo(172, 38, 'B', COR.ouro)}
${botaoRedondo(198, 66, 'A', COR.verde)}
</g>`;
}

export function contato() {
  const largura = 900;
  const altura = 150;
  const css = `
@keyframes pisca{0%,49%{opacity:1}50%,100%{opacity:0}}
.pisca{animation:pisca 1.2s steps(1) infinite}
`;
  const corpo = `${quadro({ largura, altura, topo: 0, fundo: COR.tinta, sombra: COR.verde })}
<text class="pisca" x="30" y="40" font-size="13" font-weight="800" letter-spacing="1.8" fill="${COR.ouro}">${esc(CONTATO.chamada)}</text>
<text class="sans" x="30" y="84" font-size="34" font-weight="900" letter-spacing="-1" fill="${COR.papel}">${esc(CONTATO.titulo)}</text>
<text class="serif" x="30" y="116" font-size="20" font-style="italic" fill="#cfc8bb">${esc(CONTATO.tituloEn)}</text>
${controle(622, 18)}`;
  return svg({ largura, altura, titulo: `Press start. ${CONTATO.titulo} ${CONTATO.tituloEn}`, css, corpo });
}

export function botao({ texto, fundo, cor, sombra }) {
  const largura = 290;
  const altura = 56;
  const corpo = `<rect x="4" y="4" width="${largura - 4}" height="${altura - 4}" fill="${sombra}"/>
<rect x="1.5" y="1.5" width="${largura - 7}" height="${altura - 7}" fill="${fundo}" stroke="${COR.tinta}" stroke-width="3"/>
<text x="${(largura - 4) / 2}" y="${altura / 2 + 2.5}" text-anchor="middle" font-size="14" font-weight="800" fill="${cor}">${esc(texto)}</text>`;
  return svg({ largura, altura, titulo: texto.replace(/^\[.\]\s*/, ''), corpo });
}

export const botoes = () => CONTATO.botoes.map((dados) => [dados.arquivo, botao(dados)]);
