// Coloca o SVG gerado pelo Platane/snk dentro de uma moldura de HQ.
// Uso: node .github/scripts/moldura-cobra.mjs <arquivo.svg>

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const LARGURA = 900;
const LARGURA_COBRA = 860;
const TOPO = 14;
const TINTA = '#17140f';
const LARANJA = '#c4471f';
const PAPEL = '#f2eee6';
const TEXTO = '#5c554a';
const PONTOS = ['#e6dfd2', '#f1c75b', '#e8794f', '#c4471f', '#17140f'];
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
const ETIQUETA = 'CAP. 4 · A COBRA QUE COME COMMITS';
const LEGENDA = 'paleta da revista · cobra verde-terminal com contorno de HQ';

/**
 * A cobra anda de uma célula acima a uma abaixo das 7 linhas da grade, com 16px cada.
 * Logo abaixo disso o snk desenha uma barra de progresso, que fica de fora do card.
 */
const CORTE_TOPO = -20;
const CORTE_ALTURA = 152;

const RAIZ = /^\s*<svg\b[^>]*\bviewBox="([^"]+)"[^>]*>/;

function legenda(y) {
  const lado = 11;
  const vao = 3;
  const inicio = LARGURA - 66 - (lado + vao) * PONTOS.length;
  const quadrados = PONTOS.map(
    (cor, i) =>
      `<rect x="${inicio + i * (lado + vao)}" y="${y - 10}" width="${lado}" height="${lado}" fill="${cor}" stroke="${TINTA}" stroke-opacity=".35"/>`,
  ).join('');
  const texto = `font-family="${MONO}" font-size="11" font-weight="700" fill="${TEXTO}"`;
  return `<text x="20" y="${y}" ${texto}>${LEGENDA}</text>
<text x="${inicio - 8}" y="${y}" text-anchor="end" ${texto}>menos</text>
${quadrados}
<text x="${LARGURA - 58}" y="${y}" ${texto}>mais</text>`;
}

export function emoldurar(cobra) {
  const raiz = RAIZ.exec(cobra);
  if (!raiz) throw new Error('o arquivo não é um SVG com viewBox');

  const [xOriginal, , larguraOriginal] = raiz[1].trim().split(/\s+/).map(Number);
  const viewBox = `${xOriginal} ${CORTE_TOPO} ${larguraOriginal} ${CORTE_ALTURA}`;
  const alturaCobra = Number(((LARGURA_COBRA * CORTE_ALTURA) / larguraOriginal).toFixed(1));

  const y = 34;
  const yLegenda = y + Math.ceil(alturaCobra) + 14;
  const altura = yLegenda + 26;
  const conteudo = cobra.replace(RAIZ, `<svg x="17" y="${y}" width="${LARGURA_COBRA}" height="${alturaCobra}" viewBox="${viewBox}">`);
  const larguraEtiqueta = Array.from(ETIQUETA).length * 7.7;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${LARGURA}" height="${altura}" viewBox="0 0 ${LARGURA} ${altura}" role="img" aria-label="Gráfico de contribuições de Pedro Andrade sendo comido por uma cobra.">
<title>Gráfico de contribuições de Pedro Andrade sendo comido por uma cobra.</title>
<style>.s{stroke:${TINTA};stroke-width:1.2px}</style>
<rect x="6" y="${TOPO + 6}" width="${LARGURA - 6}" height="${altura - TOPO - 6}" fill="${LARANJA}"/>
<rect x="1.5" y="${TOPO + 1.5}" width="${LARGURA - 9}" height="${altura - TOPO - 9}" fill="${PAPEL}" stroke="${TINTA}" stroke-width="3"/>
${conteudo}
${legenda(yLegenda)}
<rect x="15" y="1" width="${larguraEtiqueta + 22}" height="24" fill="${LARANJA}" stroke="${TINTA}" stroke-width="2"/>
<text x="26" y="17.5" font-family="${MONO}" font-size="11" font-weight="800" fill="${PAPEL}" textLength="${larguraEtiqueta}" lengthAdjust="spacing">${ETIQUETA}</text>
</svg>
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [arquivo] = process.argv.slice(2);
  writeFileSync(arquivo, emoldurar(readFileSync(arquivo, 'utf8')));
}
