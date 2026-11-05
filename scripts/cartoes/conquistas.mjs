import { CONQUISTAS } from '../dados.mjs';
import { COR, esc, etiqueta, icone, quadro, svg } from '../kit.mjs';

const LARGURA = 900;
const COLUNAS = 3;
const CELULA = { largura: 278, altura: 78, vao: 10 };
const TOPO_GRADE = 42;

function conquista(dados, indice) {
  const coluna = indice % COLUNAS;
  const linha = Math.floor(indice / COLUNAS);
  const x = 22 + coluna * (CELULA.largura + CELULA.vao);
  const y = TOPO_GRADE + linha * (CELULA.altura + CELULA.vao);
  const bloqueada = dados.progresso !== undefined;
  const moldura = bloqueada ? COR.apagado : COR.ambar;
  const texto = x + 66;

  const progresso = bloqueada
    ? `<rect x="${texto}" y="${y + 58}" width="150" height="7" fill="${COR.vazio}"/>
<rect x="${texto}" y="${y + 58}" width="${(150 * dados.progresso) / 100}" height="7" fill="${COR.apagado}"/>
<text x="${texto + 158}" y="${y + 65}" font-size="10" fill="${COR.sub}">${dados.progresso}%</text>`
    : `<text x="${texto}" y="${y + 62}" font-size="9.5" fill="${COR.apagado}">${esc(dados.textoEn)}</text>`;

  return `<g${bloqueada ? ' opacity=".55"' : ''}>
<rect x="${x}" y="${y}" width="${CELULA.largura}" height="${CELULA.altura}" fill="${COR.terminal}" stroke="${COR.linha}"/>
<rect x="${x + 12}" y="${y + 19}" width="40" height="40" fill="#1a1f27" stroke="${moldura}" stroke-width="2"/>
${icone(dados.icone, { x: x + 19, y: y + 26, tamanho: 26 })}
<text x="${texto}" y="${y + 28}" font-size="12.5" font-weight="800" fill="${COR.texto}">${esc(dados.titulo)}</text>
<text x="${texto}" y="${y + 45}" font-size="10.5" fill="${COR.sub}">${esc(dados.texto)}</text>
${progresso}
</g>`;
}

export function conquistas() {
  const linhas = Math.ceil(CONQUISTAS.length / COLUNAS);
  const altura = TOPO_GRADE + linhas * (CELULA.altura + CELULA.vao) + 14;
  const corpo = `${quadro({ largura: LARGURA, altura, fundo: COR.painel, sombra: COR.ambar })}
${CONQUISTAS.map(conquista).join('\n')}
${etiqueta({ texto: 'CONQUISTAS DESBLOQUEADAS', fundo: COR.ambar })}`;

  const resumo = CONQUISTAS.map((c) => (c.progresso === undefined ? c.titulo : `${c.titulo} (bloqueada, ${c.progresso}%)`)).join(', ');
  return svg({ largura: LARGURA, altura, titulo: `Conquistas: ${resumo}.`, corpo });
}
