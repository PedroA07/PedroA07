import { blocoDoHall } from '../../.github/scripts/hall.mjs';
import { CTF } from '../dados.mjs';
import { COR, esc, etiqueta, linhasDeTexto, padraoPontos, quadro, quebrar, svg } from '../kit.mjs';

const LARGURA = 900;
const ALTURA = 306;
const TERMINAL = { x: 536, y: 42, largura: 338, altura: 238 };

function balao() {
  return `<g transform="rotate(-3 112 62)">
<path d="M42 40 H182 Q198 40 198 54 V72 Q198 86 182 86 H96 L70 108 L74 86 H42 Q26 86 26 72 V54 Q26 40 42 40 Z" fill="${COR.branco}" stroke="${COR.tinta}" stroke-width="3" stroke-linejoin="round"/>
<text class="gibi" x="112" y="71" text-anchor="middle" font-size="21" font-weight="900" fill="${COR.tinta}">PSST! <tspan class="emoji">👀</tspan></text>
</g>`;
}

function terminal(hall) {
  const { x, y, largura, altura } = TERMINAL;
  const texto = x + 20;
  return `<rect x="${x + 6}" y="${y + 6}" width="${largura}" height="${altura}" fill="${COR.tinta}"/>
<rect x="${x}" y="${y}" width="${largura}" height="${altura}" fill="${COR.terminal}" stroke="${COR.tinta}" stroke-width="3"/>
<text x="${texto}" y="${y + 30}" font-size="12.5" fill="${COR.vermelho}">[!] nível 1/3</text>
<text x="${texto}" y="${y + 56}" font-size="13" font-weight="700" fill="${COR.ambar}">${esc(CTF.nivel1Base64)}</text>
<text x="${texto}" y="${y + 80}" font-size="12" fill="${COR.apagado}">${esc(CTF.dica)}</text>
<line x1="${texto}" x2="${x + largura - 20}" y1="${y + 98}" y2="${y + 98}" stroke="${COR.linha}" stroke-dasharray="4 4"/>
<text x="${texto}" y="${y + 120}" font-size="12" fill="${COR.corpo}"><tspan class="emoji">🏆</tspan> hall da fama</text>
${blocoDoHall(hall)}
<rect x="${texto}" y="${y + 186}" width="124" height="30" fill="${COR.vermelho}"/>
<text x="${texto + 62}" y="${y + 206}" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0d1117">enviar flag ↗</text>`;
}

export function ctf(hall = {}) {
  const texto = quebrar(CTF.texto, 62);
  const titulo = CTF.titulo
    .map(
      (linha, i) =>
        `<text class="sans" x="26" y="${146 + i * 34}" font-size="29" font-weight="900" letter-spacing="-.9" fill="${COR.tinta}">${esc(linha)}</text>`,
    )
    .join('\n');

  const corpo = `${quadro({ largura: LARGURA, altura: ALTURA, fundo: COR.vermelho, sombra: COR.tinta })}
<rect x="3" y="17" width="${LARGURA - 12}" height="${ALTURA - 26}" fill="url(#pontos-ctf)"/>
${balao()}
${titulo}
${linhasDeTexto(texto, {
  x: 26,
  y: 210,
  altura: 20,
  atributos: `class="serif" font-size="14.5" fill="${COR.tinta}"`,
})}
<text class="serif" x="26" y="${210 + texto.length * 20 + 2}" font-size="12" font-style="italic" fill="${COR.tinta}">${esc(CTF.textoEn)}</text>
${terminal(hall)}
${etiqueta({ texto: 'CAP. 3 · CAPTURE A FLAG', fundo: COR.tinta, cor: COR.vermelho })}`;

  return svg({
    largura: LARGURA,
    altura: ALTURA,
    titulo: `Capture a flag: nível 1 em base64, ${CTF.nivel1Base64}. Clique para enviar sua resposta.`,
    defs: padraoPontos({ id: 'pontos-ctf', passo: 8, raio: 1.5, cor: COR.tinta, opacidade: 0.2 }),
    corpo,
  });
}
