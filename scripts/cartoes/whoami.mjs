import { WHOAMI } from '../dados.mjs';
import { COR, esc, etiqueta, linhasDeTexto, quadro, quebrar, svg } from '../kit.mjs';

const LARGURA = 480;
const ALTURA = 352;
const BARRA = { x: 22, y: 277, largura: 430, altura: 11 };

// A barra sobe e desce até 70%, o mesmo progresso de "Hacker Ético" nas conquistas.
const recuoCheio = BARRA.largura * 0.3;
const recuoVazio = BARRA.largura * 0.88;

const css = `
@keyframes pisca{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes progresso{from{transform:translateX(-${recuoVazio}px)}to{transform:translateX(-${recuoCheio}px)}}
.cursor{animation:pisca 1s steps(1) infinite}
.progresso{animation:progresso 6s ease-in-out infinite alternate}
`;

const defs = `<pattern id="listras" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="8" height="10" fill="${COR.ambar}"/><rect x="8" width="2" height="10" fill="#b08a2a"/></pattern>
<clipPath id="trilho"><rect x="${BARRA.x}" y="${BARRA.y}" width="${BARRA.largura}" height="${BARRA.altura}"/></clipPath>`;

// Posições fixas: a seta vem de uma fonte de reserva, com largura diferente em cada sistema.
const prompt = (y, comando = '') =>
  `<text x="22" y="${y}" font-size="13" fill="${COR.verde}">➜</text><text x="42" y="${y}" font-size="13" fill="${COR.azul}">~</text><text x="56" y="${y}" font-size="13" fill="${COR.apagado}">${esc(comando)}</text>`;

function habilidades(y) {
  return WHOAMI.habilidades
    .map(([estado, nome], i) => {
      const cor = estado === 'OK' ? COR.verde : COR.ambar;
      return `<text x="22" y="${y + i * 19}" font-size="13" fill="${COR.corpo}"><tspan fill="${cor}">[ ${estado} ]</tspan>  ${esc(nome)}</text>`;
    })
    .join('\n');
}

export function whoami() {
  const sobre = quebrar(WHOAMI.sobre, 60);
  const sobreEn = quebrar(WHOAMI.sobreEn, 66);

  const corpo = `${quadro({ largura: LARGURA, altura: ALTURA, fundo: COR.terminal, sombra: COR.verde })}
${prompt(50, 'cat sobre.txt')}
${linhasDeTexto(sobre, {
  x: 22,
  y: 72,
  altura: 19,
  atributos: `class="sans" font-size="14" fill="${COR.texto}"`,
})}
${linhasDeTexto(sobreEn, {
  x: 22,
  y: 136,
  altura: 16,
  atributos: `class="sans" font-size="12.5" fill="${COR.sub}"`,
})}
${prompt(180, './boot --skills')}
${habilidades(201)}
<rect x="${BARRA.x}" y="${BARRA.y}" width="${BARRA.largura}" height="${BARRA.altura}" fill="${COR.painel}" stroke="${COR.linha}"/>
<g clip-path="url(#trilho)"><rect class="progresso" x="${BARRA.x}" y="${BARRA.y}" width="${BARRA.largura}" height="${BARRA.altura}" fill="url(#listras)"/></g>
${prompt(316)}
<rect class="cursor" x="56" y="305" width="8" height="14" fill="${COR.apagado}"/>
${etiqueta({ texto: 'CAP. 1 · WHOAMI', fundo: COR.verde })}`;

  return svg({
    largura: LARGURA,
    altura: ALTURA,
    titulo: 'Terminal: engenheiro de software e dev full stack, formado em ADS, com Ciência de Dados e Machine Learning concluídos e Cyber Segurança em andamento.',
    css,
    defs,
    corpo,
  });
}
