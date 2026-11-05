import { INVENTARIO } from '../dados.mjs';
import { COR, esc, etiqueta, icone, quadro, svg } from '../kit.mjs';

const LARGURA = 900;
const ALTURA_LINHA = 80;
const TOPO_LISTA = 42;
const LADRILHO = 44;
const COLUNA_ITENS = 212;
const PASSO_ITEM = 76;

/** Quem não tem logo vira letras sobre a cor da tecnologia. */
function desenhoDoLadrilho({ icone: arquivo, marca, fundo }) {
  if (arquivo) return icone(arquivo, { x: 0, y: 0, tamanho: LADRILHO });
  return `<rect width="${LADRILHO}" height="${LADRILHO}" fill="${fundo}"/>
<text x="${LADRILHO / 2}" y="28" text-anchor="middle" font-size="16" font-weight="900" letter-spacing="-.6" fill="${COR.branco}">${esc(marca)}</text>`;
}

function ladrilho(item, x, y) {
  return `<rect x="${x + 3}" y="${y + 3}" width="${LADRILHO}" height="${LADRILHO}" rx="8" fill="${COR.tinta}"/>
<g transform="translate(${x} ${y})">
<g clip-path="url(#canto)">${desenhoDoLadrilho(item)}</g>
<rect width="${LADRILHO}" height="${LADRILHO}" rx="8" fill="none" stroke="${COR.tinta}" stroke-width="2.5"/>
</g>
<text x="${x + LADRILHO / 2 + 1.5}" y="${y + LADRILHO + 15}" text-anchor="middle" font-size="9" font-weight="700" fill="${COR.marrom}">${esc(item.nome)}</text>`;
}

function linhaDoGrupo(grupo, indice) {
  const y = TOPO_LISTA + indice * ALTURA_LINHA;
  const itens = grupo.itens.map((item, i) => ladrilho(item, COLUNA_ITENS + i * PASSO_ITEM, y)).join('\n');
  const divisoria =
    indice < INVENTARIO.length - 1
      ? `<rect x="26" y="${y + ALTURA_LINHA - 12}" width="${LARGURA - 58}" height="2" fill="${COR.tinta}" opacity=".13"/>`
      : '';
  return `<text x="26" y="${y + 20}" font-size="13" font-weight="900" fill="${grupo.cor}">${esc(grupo.grupo)}</text>
<text class="serif" x="26" y="${y + 37}" font-size="12" font-style="italic" fill="${COR.marrom}">${esc(grupo.nota)}</text>
${itens}
${divisoria}`;
}

export function inventario() {
  const altura = TOPO_LISTA + INVENTARIO.length * ALTURA_LINHA + 6;
  const corpo = `${quadro({ largura: LARGURA, altura, fundo: COR.papel, sombra: COR.tinta })}
${INVENTARIO.map(linhaDoGrupo).join('\n')}
${etiqueta({ texto: 'INVENTÁRIO · STACK', fundo: COR.tinta, cor: COR.papel })}`;

  const resumo = INVENTARIO.map((g) => `${g.grupo}: ${g.itens.map((i) => i.nome).join(', ')}`).join('. ');
  const defs = `<clipPath id="canto"><rect width="${LADRILHO}" height="${LADRILHO}" rx="8"/></clipPath>`;
  return svg({ largura: LARGURA, altura, titulo: `Inventário de tecnologias. ${resumo}.`, defs, corpo });
}
