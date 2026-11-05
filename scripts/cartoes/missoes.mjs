import { MISSOES, MISSOES_SECRETAS } from '../dados.mjs';
import { COR, esc, etiqueta, larguraMono, linhasDeTexto, padraoPontos, quadro, quebrar, svg } from '../kit.mjs';

const LARGURA = 480;
const ALTURA = 352;
const FAIXA = 112;

const css = `
@keyframes flutua{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.flutua{animation:flutua 2.6s ease-in-out infinite}
`;

function onomatopeia(texto) {
  const largura = Array.from(texto).length * 9.4 + 18;
  const x = LARGURA - 34 - largura;
  return `<g transform="rotate(6 ${x + largura / 2} 46)">
<rect x="${x}" y="33" width="${largura}" height="26" fill="${COR.ouro}" stroke="${COR.tinta}" stroke-width="2"/>
<text class="gibi" x="${x + largura / 2}" y="51" text-anchor="middle" font-size="13" font-weight="900" fill="${COR.tinta}">${esc(texto)}</text>
</g>`;
}

export function missao(dados) {
  const inicio = 17 + FAIXA;
  const resumo = quebrar(dados.resumo, 60);
  const resumoEn = dados.resumoEn ? quebrar(dados.resumoEn, 78) : [];
  const acao = `${dados.acao} →`;
  const larguraAcao = larguraMono(acao, 12) + 20;

  const corpo = `${quadro({ largura: LARGURA, altura: ALTURA, fundo: COR.papel, sombra: dados.cor })}
<rect x="3" y="17" width="${LARGURA - 12}" height="${FAIXA}" fill="${dados.cor}"/>
<rect x="3" y="17" width="${LARGURA - 12}" height="${FAIXA}" fill="url(#pontos-faixa)"/>
<rect x="3" y="${inicio}" width="${LARGURA - 12}" height="3" fill="${COR.tinta}"/>
<text class="emoji flutua" x="${(LARGURA - 6) / 2}" y="${17 + FAIXA / 2 + 19}" text-anchor="middle" font-size="52">${dados.emoji}</text>
${onomatopeia(dados.onomatopeia)}
<text class="sans" x="22" y="${inicio + 40}" font-size="26" font-weight="900" letter-spacing="-.8" fill="${COR.tinta}">${esc(dados.nome)}</text>
<text x="452" y="${inicio + 40}" text-anchor="end" font-size="10" font-weight="800" letter-spacing="1" fill="${COR.laranja}">${esc(dados.tipo)}</text>
${linhasDeTexto(resumo, {
  x: 22,
  y: inicio + 66,
  altura: 20,
  atributos: `class="serif" font-size="14.5" fill="${COR.tinta}"`,
})}
${linhasDeTexto(resumoEn, {
  x: 22,
  y: inicio + 66 + resumo.length * 20,
  altura: 15,
  atributos: `class="serif" font-size="11.5" font-style="italic" fill="${COR.marrom}"`,
})}
<text x="22" y="${ALTURA - 62}" font-size="11" font-weight="700" fill="${COR.marrom}">${esc(dados.stack)}</text>
<rect x="22" y="${ALTURA - 52}" width="430" height="2" fill="${COR.tinta}"/>
<text x="22" y="${ALTURA - 26}" font-size="12" font-weight="800" fill="${COR.tinta}">★ ao vivo · ${esc(dados.linguagem)}</text>
<rect x="${452 - larguraAcao}" y="${ALTURA - 43}" width="${larguraAcao}" height="26" fill="${COR.tinta}"/>
<text x="${452 - larguraAcao / 2}" y="${ALTURA - 25.5}" text-anchor="middle" font-size="12" font-weight="800" fill="${COR.papel}">${esc(acao)}</text>
${dados.etiqueta ? etiqueta({ texto: dados.etiqueta, fundo: COR.laranja, cor: COR.papel }) : ''}`;

  return svg({
    largura: LARGURA,
    altura: ALTURA,
    titulo: `${dados.nome}, ${dados.tipo.toLowerCase()}: ${dados.resumo}`,
    css,
    defs: padraoPontos({ id: 'pontos-faixa', passo: 8, raio: 1.4, cor: COR.branco, opacidade: 0.33 }),
    corpo,
  });
}

export function missoesSecretas() {
  const largura = 900;
  const altura = 54;
  const lista = MISSOES_SECRETAS.join(' · ');
  const corpo = `<rect x="1" y="1" width="${largura - 8}" height="${altura - 2}" fill="${COR.papel}" stroke="${COR.tinta}" stroke-width="2" stroke-dasharray="7 5"/>
<text x="20" y="${altura / 2 + 4.5}" font-size="13" font-weight="700" fill="${COR.tinta}"><tspan class="emoji">🔒</tspan><tspan fill="${COR.laranja}"> MISSÕES SECRETAS:</tspan> ${esc(lista)}</text>`;
  return svg({
    largura,
    altura,
    titulo: `Missões secretas, de código privado: ${MISSOES_SECRETAS.join(', ')}.`,
    corpo,
  });
}

export const missoes = () => MISSOES.map((dados) => [dados.arquivo, missao(dados)]);
