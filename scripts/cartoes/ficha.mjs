import { FICHA } from '../dados.mjs';
import { COR, esc, etiqueta, quadro, svg } from '../kit.mjs';

const LARGURA = 480;
const ALTURA = 352;
const QUADRADINHO = { lado: 18, vao: 5 };
const TOTAL = 10;

const corDoAtributo = (nome, valor) => {
  if (nome === 'SEGURANÇA') return COR.rosa;
  return valor >= 8 ? COR.ouro : COR.ciano;
};

function campos() {
  const largura = 139;
  return FICHA.campos
    .map(([rotulo, valor], i) => {
      const x = 22 + i * (largura + 6.5);
      const cor = rotulo === 'em treino' ? COR.rosa : COR.texto;
      return `<rect x="${x}" y="42" width="${largura}" height="46" fill="none" stroke="${COR.linha}"/>
<text x="${x + 8}" y="59" font-size="11" fill="${COR.apagado}">${esc(rotulo)}</text>
<text x="${x + 8}" y="77" font-size="11" fill="${cor}">${esc(valor)}</text>`;
    })
    .join('\n');
}

function atributos() {
  return FICHA.atributos
    .map(([nome, valor], i) => {
      const y = 104 + i * 23;
      const cor = corDoAtributo(nome, valor);
      const pontos = Array.from({ length: TOTAL }, (_, ponto) => {
        const x = 152 + ponto * (QUADRADINHO.lado + QUADRADINHO.vao);
        const preenchido = ponto < valor ? cor : COR.vazio;
        return `<rect x="${x}" y="${y}" width="${QUADRADINHO.lado}" height="${QUADRADINHO.lado}" fill="${preenchido}"/>`;
      }).join('');
      return `<text x="22" y="${y + 12.5}" font-size="11.5" fill="${COR.corpo}">${esc(nome)}</text>
${pontos}
<text x="452" y="${y + 12.5}" text-anchor="end" font-size="11.5" fill="${COR.apagado}">${valor}/${TOTAL}</text>`;
    })
    .join('\n');
}

export function ficha() {
  const corpo = `${quadro({ largura: LARGURA, altura: ALTURA, fundo: COR.painel, sombra: COR.ouro })}
${campos()}
${atributos()}
<line x1="22" x2="452" y1="297" y2="297" stroke="${COR.linha}" stroke-dasharray="4 4"/>
<text x="22" y="318" font-size="11" fill="${COR.sub}">golpe especial: <tspan fill="${COR.ouro}">${esc(FICHA.golpe)}</tspan></text>
${etiqueta({ texto: 'FICHA · ATRIBUTOS', fundo: COR.ouro })}`;

  const resumo = FICHA.atributos.map(([nome, valor]) => `${nome} ${valor}`).join(', ');
  return svg({
    largura: LARGURA,
    altura: ALTURA,
    titulo: `Ficha de RPG. Classe: Eng. de Software. Subclasse: Cientista de Dados. Em treino: Hacker Ético. Atributos de 0 a 10: ${resumo}.`,
    corpo,
  });
}
