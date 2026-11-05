// Coloca o SVG gerado pelo Platane/snk dentro de uma moldura de HQ.
// Uso: node .github/scripts/moldura-cobra.mjs <arquivo.svg> <claro|escuro>

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const LARGURA = 900;
const LARGURA_COBRA = 860;
const TOPO = 14;
const TINTA = '#17140f';
const LARANJA = '#c4471f';
const PAPEL = '#f2eee6';
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
const ETIQUETA = 'CAP. 4 · A COBRA QUE COME COMMITS';
const LEGENDA = 'paleta da revista · cobra verde-terminal com contorno de HQ';

const TEMAS = {
  claro: {
    fundo: PAPEL,
    texto: '#5c554a',
    pontos: ['#e6dfd2', '#f1c75b', '#e8794f', '#c4471f', '#17140f'],
  },
  escuro: {
    fundo: '#0d1117',
    texto: '#9198a1',
    pontos: ['#161b22', '#5c3a1e', '#a0522d', '#c4471f', '#f1c75b'],
  },
};

const RAIZ = /^\s*<svg\b[^>]*\bviewBox="([^"]+)"[^>]*>/;

function legenda(tema, y) {
  const lado = 11;
  const vao = 3;
  const inicio = LARGURA - 66 - (lado + vao) * tema.pontos.length;
  const quadrados = tema.pontos
    .map(
      (cor, i) =>
        `<rect x="${inicio + i * (lado + vao)}" y="${y - 10}" width="${lado}" height="${lado}" fill="${cor}" stroke="${TINTA}" stroke-opacity=".35"/>`,
    )
    .join('');
  const texto = `font-family="${MONO}" font-size="11" font-weight="700" fill="${tema.texto}"`;
  return `<text x="20" y="${y}" ${texto}>${LEGENDA}</text>
<text x="${inicio - 8}" y="${y}" text-anchor="end" ${texto}>menos</text>
${quadrados}
<text x="${LARGURA - 58}" y="${y}" ${texto}>mais</text>`;
}

export function emoldurar(cobra, nomeDoTema) {
  const tema = TEMAS[nomeDoTema];
  if (!tema) throw new Error(`tema desconhecido: ${nomeDoTema}`);

  const raiz = RAIZ.exec(cobra);
  if (!raiz) throw new Error('o arquivo não é um SVG com viewBox');

  const viewBox = raiz[1];
  const [, , larguraOriginal, alturaOriginal] = viewBox.trim().split(/\s+/).map(Number);
  const alturaCobra = Number(((LARGURA_COBRA * alturaOriginal) / larguraOriginal).toFixed(1));

  const y = 34;
  const yLegenda = y + Math.ceil(alturaCobra) + 14;
  const altura = yLegenda + 26;
  const conteudo = cobra.replace(RAIZ, `<svg x="17" y="${y}" width="${LARGURA_COBRA}" height="${alturaCobra}" viewBox="${viewBox}">`);
  const larguraEtiqueta = Array.from(ETIQUETA).length * 7.7;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${LARGURA}" height="${altura}" viewBox="0 0 ${LARGURA} ${altura}" role="img" aria-label="Gráfico de contribuições de Pedro Andrade sendo comido por uma cobra.">
<title>Gráfico de contribuições de Pedro Andrade sendo comido por uma cobra.</title>
<style>.s{stroke:${TINTA};stroke-width:1.2px}</style>
<rect x="6" y="${TOPO + 6}" width="${LARGURA - 6}" height="${altura - TOPO - 6}" fill="${LARANJA}"/>
<rect x="1.5" y="${TOPO + 1.5}" width="${LARGURA - 9}" height="${altura - TOPO - 9}" fill="${tema.fundo}" stroke="${TINTA}" stroke-width="3"/>
${conteudo}
${legenda(tema, yLegenda)}
<rect x="15" y="1" width="${larguraEtiqueta + 22}" height="24" fill="${LARANJA}" stroke="${TINTA}" stroke-width="2"/>
<text x="26" y="17.5" font-family="${MONO}" font-size="11" font-weight="800" fill="${PAPEL}" textLength="${larguraEtiqueta}" lengthAdjust="spacing">${ETIQUETA}</text>
</svg>
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [arquivo, tema] = process.argv.slice(2);
  writeFileSync(arquivo, emoldurar(readFileSync(arquivo, 'utf8'), tema));
}
