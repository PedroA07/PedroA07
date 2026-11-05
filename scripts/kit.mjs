// Peças comuns dos SVGs do perfil. Nada aqui usa imagem externa nem JavaScript,
// porque o GitHub exibe tudo dentro de <img>: só CSS e fontes do sistema.

export const COR = {
  tinta: '#17140f',
  papel: '#f2eee6',
  branco: '#ffffff',
  laranja: '#c4471f',
  ouro: '#f1c75b',
  ambar: '#e3b341',
  verde: '#56d364',
  vermelho: '#f85149',
  azul: '#4493f8',
  ciano: '#5ccfe6',
  rosa: '#f07fb0',
  terminal: '#0a0d12',
  painel: '#11141b',
  vazio: '#1e242d',
  linha: '#2a313c',
  texto: '#f0f6fc',
  corpo: '#c9d1d9',
  sub: '#9198a1',
  apagado: '#6e7681',
  marrom: '#5c554a',
};

export const FONTE = {
  mono: "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace",
  sans: "'Helvetica Neue',Helvetica,Arial,sans-serif",
  serif: "Georgia,'Times New Roman',serif",
  gibi: "'Comic Sans MS','Comic Neue',cursive",
  emoji: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif",
};

/** Altura acima do card para a etiqueta atravessar a borda, como um adesivo. */
export const TOPO = 14;

export function esc(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Largura de um texto mono: 0,6em por caractere, mais o espaçamento. */
export const larguraMono = (texto, tamanho, espaco = 0) => Array.from(texto).length * (tamanho * 0.6 + espaco);

export function svg({ largura, altura, titulo, css = '', defs = '', corpo }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}" role="img" aria-label="${esc(titulo)}">
<title>${esc(titulo)}</title>
<style>
text{font-family:${FONTE.mono}}
.sans{font-family:${FONTE.sans}}
.serif{font-family:${FONTE.serif}}
.gibi{font-family:${FONTE.gibi}}
.emoji{font-family:${FONTE.emoji}}
${css}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
${defs ? `<defs>${defs}</defs>\n` : ''}${corpo}
</svg>
`;
}

/** Card: borda preta de 3px, sombra dura sem blur e cantos retos. */
export function quadro({ largura, altura, fundo, sombra, topo = TOPO, deslocamento = 6 }) {
  const d = deslocamento;
  return `<rect x="${d}" y="${topo + d}" width="${largura - d}" height="${altura - topo - d}" fill="${sombra}"/>
<rect x="1.5" y="${topo + 1.5}" width="${largura - d - 3}" height="${altura - topo - d - 3}" fill="${fundo}" stroke="${COR.tinta}" stroke-width="3"/>`;
}

/** Etiqueta do topo esquerdo: mono, caixa alta, fundo colorido. */
export function etiqueta({ texto, fundo, cor = '#0d1117' }) {
  const largura = larguraMono(texto, 11, 1.1);
  return `<rect x="15" y="1" width="${largura + 22}" height="24" fill="${fundo}" stroke="${COR.tinta}" stroke-width="2"/>
<text x="26" y="17.5" font-size="11" font-weight="800" fill="${cor}" textLength="${largura}" lengthAdjust="spacing">${esc(texto)}</text>`;
}

/** Pontos regulares de retícula, para usar como preenchimento. */
export function padraoPontos({ id, passo = 8, raio = 1.5, cor, opacidade = 1 }) {
  return `<pattern id="${id}" width="${passo}" height="${passo}" patternUnits="userSpaceOnUse"><circle cx="${passo / 2}" cy="${passo / 2}" r="${raio}" fill="${cor}" opacity="${opacidade}"/></pattern>`;
}

/** Retícula de gibi: grade a 45° com pontos que encolhem conforme se afastam do centro. */
export function reticula({ cx, cy, alcance, passo = 12, raioMaximo = 5, cor, dentro = () => true }) {
  const diagonal = passo * Math.SQRT1_2;
  const passos = Math.ceil(alcance / diagonal);
  const pontos = [];
  for (let i = -passos; i <= passos; i += 1) {
    for (let j = -passos; j <= passos; j += 1) {
      if ((i + j) % 2 !== 0) continue;
      const x = cx + i * diagonal;
      const y = cy + j * diagonal;
      const distancia = Math.hypot(x - cx, y - cy) / alcance;
      const raio = raioMaximo * (1 - distancia);
      if (raio > 0.45 && dentro(x, y)) {
        pontos.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${raio.toFixed(2)}"/>`);
      }
    }
  }
  return `<g fill="${cor}">${pontos.join('')}</g>`;
}

/** Quebra de linha gulosa por palavras: SVG não quebra texto sozinho. */
export function quebrar(texto, porLinha) {
  const linhas = [];
  let atual = '';
  for (const palavra of texto.split(/\s+/)) {
    if (atual && atual.length + 1 + palavra.length > porLinha) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = atual ? `${atual} ${palavra}` : palavra;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

export function linhasDeTexto(linhas, { x, y, altura, atributos = '' }) {
  return linhas
    .map((linha, i) => `<text x="${x}" y="${y + i * altura}" ${atributos}>${esc(linha)}</text>`)
    .join('\n');
}
