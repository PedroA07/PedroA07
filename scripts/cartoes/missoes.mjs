import { readFileSync } from 'node:fs';
import { MISSOES, MISSOES_SECRETAS } from '../dados.mjs';
import { COR, esc, etiqueta, fatia, larguraMono, linhasDeTexto, quadro, quebrar } from '../kit.mjs';

// O capítulo é um card de papel só, com as duas missões e a faixa de secretas dentro.
// Cada missão tem o próprio link, por isso ele sai em quatro fatias: topo, duas missões e rodapé.
const LARGURA = 900;
const CORTE_X = 450;
const CORTE_TOPO = 46;
const LARGURA_MISSAO = 409;
const X_MISSOES = [29, 456];
const RECUO = 18;
const ALTURA_FOTO = 202;
const Y_RESUMO = 270;
const LINHA_RESUMO = 20;
const LINHA_INGLES = 15;
const ALTURA_FAIXA = 44;

const textoDe = ({ resumo, resumoEn }) => ({ resumo: quebrar(resumo, 52), ingles: quebrar(resumoEn, 66) });

/** As duas missões têm a mesma altura: a do texto mais longo. */
const ALTURA_TEXTO = Math.max(
  ...MISSOES.map(textoDe).map(({ resumo, ingles }) => resumo.length * LINHA_RESUMO + ingles.length * LINHA_INGLES),
);
const ALTURA_MISSAO = Y_RESUMO + ALTURA_TEXTO + 72;
const CORTE_BASE = CORTE_TOPO + ALTURA_MISSAO + 10;
const Y_FAIXA = CORTE_BASE + 6;
const ALTURA_CARD = Y_FAIXA + ALTURA_FAIXA + 31;

const fundo = quadro({ largura: LARGURA, altura: ALTURA_CARD, fundo: COR.papel, sombra: COR.tinta });

const foto = (arquivo) =>
  `data:image/jpeg;base64,${readFileSync(new URL(`../imagens/${arquivo}`, import.meta.url)).toString('base64')}`;

function onomatopeia(texto, direita, y) {
  const largura = Array.from(texto).length * 9.4 + 18;
  const x = direita - 12 - largura;
  return `<g transform="rotate(6 ${x + largura / 2} ${y + 13})">
<rect x="${x}" y="${y}" width="${largura}" height="26" fill="${COR.ouro}" stroke="${COR.tinta}" stroke-width="2"/>
<text class="gibi" x="${x + largura / 2}" y="${y + 18}" text-anchor="middle" font-size="13" font-weight="900" fill="${COR.tinta}">${esc(texto)}</text>
</g>`;
}

function cartao(dados, x) {
  const y = CORTE_TOPO;
  const direita = x + LARGURA_MISSAO;
  const fim = y + ALTURA_MISSAO;
  const { resumo, ingles } = textoDe(dados);
  const acao = `${dados.acao} →`;
  const larguraAcao = larguraMono(acao, 12) + 20;

  return `<rect x="${x + 1.5}" y="${y + 1.5}" width="${LARGURA_MISSAO - 3}" height="${ALTURA_MISSAO - 3}" fill="${COR.branco}" stroke="${COR.tinta}" stroke-width="3"/>
<image href="${foto(dados.imagem)}" x="${x + 3}" y="${y + 3}" width="${LARGURA_MISSAO - 6}" height="${ALTURA_FOTO}" preserveAspectRatio="xMidYMid slice"/>
<rect x="${x + 3}" y="${y + 3 + ALTURA_FOTO}" width="${LARGURA_MISSAO - 6}" height="3" fill="${COR.tinta}"/>
${onomatopeia(dados.onomatopeia, direita, y + 14)}
<text class="sans" x="${x + RECUO}" y="${y + 244}" font-size="26" font-weight="900" letter-spacing="-.8" fill="${COR.tinta}">${esc(dados.nome)}</text>
<text x="${direita - RECUO}" y="${y + 244}" text-anchor="end" font-size="10" font-weight="800" letter-spacing="1" fill="${COR.laranja}">${esc(dados.tipo)}</text>
${linhasDeTexto(resumo, {
  x: x + RECUO,
  y: y + Y_RESUMO,
  altura: LINHA_RESUMO,
  atributos: `class="serif" font-size="14.5" fill="${COR.tinta}"`,
})}
${linhasDeTexto(ingles, {
  x: x + RECUO,
  y: y + Y_RESUMO + resumo.length * LINHA_RESUMO - 2,
  altura: LINHA_INGLES,
  atributos: `class="serif" font-size="11.5" font-style="italic" fill="${COR.marrom}"`,
})}
<text x="${x + RECUO}" y="${fim - 60}" font-size="11" font-weight="700" fill="${COR.marrom}">${esc(dados.stack)}</text>
<rect x="${x + RECUO}" y="${fim - 50}" width="${LARGURA_MISSAO - RECUO * 2}" height="2" fill="${COR.tinta}"/>
<text x="${x + RECUO}" y="${fim - 24}" font-size="12" font-weight="800" fill="${COR.tinta}">★ ao vivo · ${esc(dados.linguagem)}</text>
<rect x="${direita - RECUO - larguraAcao}" y="${fim - 41}" width="${larguraAcao}" height="26" fill="${COR.tinta}"/>
<text x="${direita - RECUO - larguraAcao / 2}" y="${fim - 23.5}" text-anchor="middle" font-size="12" font-weight="800" fill="${COR.papel}">${esc(acao)}</text>`;
}

function topo() {
  return fatia({
    largura: LARGURA,
    altura: CORTE_TOPO,
    titulo: 'Capítulo 2: missões em destaque.',
    corpo: `${fundo}
${etiqueta({ texto: 'CAP. 2 · MISSÕES EM DESTAQUE', fundo: COR.laranja, cor: COR.papel })}`,
  });
}

function missao(dados, indice) {
  const x = indice * CORTE_X;
  return fatia({
    x,
    y: CORTE_TOPO,
    largura: CORTE_X,
    altura: CORTE_BASE - CORTE_TOPO,
    titulo: `${dados.nome}, ${dados.tipo.toLowerCase()}: ${dados.resumo}`,
    corpo: `${fundo}
${cartao(dados, X_MISSOES[indice])}`,
  });
}

export function missoesSecretas() {
  const lista = MISSOES_SECRETAS.join(' · ');
  const [x] = X_MISSOES;
  const largura = X_MISSOES[1] + LARGURA_MISSAO - x;
  return fatia({
    y: CORTE_BASE,
    largura: LARGURA,
    altura: ALTURA_CARD - CORTE_BASE,
    titulo: `Missões secretas, de código privado: ${MISSOES_SECRETAS.join(', ')}.`,
    corpo: `${fundo}
<rect x="${x + 1}" y="${Y_FAIXA + 1}" width="${largura - 2}" height="${ALTURA_FAIXA - 2}" fill="none" stroke="${COR.tinta}" stroke-width="2" stroke-dasharray="7 5"/>
<text x="${x + 18}" y="${Y_FAIXA + ALTURA_FAIXA / 2 + 4.5}" font-size="13" font-weight="700" fill="${COR.tinta}"><tspan class="emoji">🔒</tspan><tspan fill="${COR.laranja}"> MISSÕES SECRETAS:</tspan> ${esc(lista)}</text>`,
  });
}

export const missoes = () => [['missoes-topo', topo()], ...MISSOES.map((dados, i) => [dados.arquivo, missao(dados, i)])];
