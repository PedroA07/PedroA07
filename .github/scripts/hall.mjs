// Hall da fama que vive dentro de assets/ctf.svg. O bloco guarda os dados no próprio SVG,
// assim a Action e o gerador de SVGs enxergam a mesma lista sem precisar de banco.

const BLOCO = /<g id="hall" data-hall='([^']*)'>[\s\S]*?<\/g>/;
const LOGIN_VALIDO = /^[a-z\d](?:[a-z\d-]{0,38})$/i;

const POR_LINHA = 42;
const LINHAS = 2;
const AREA = { x: 556, y: 184, altura: 16 };
const COR_NOME = '#f0f6fc';
const COR_RESTO = '#9198a1';

export const loginValido = (login) => LOGIN_VALIDO.test(login);

export function lerHall(svg) {
  const achado = BLOCO.exec(svg);
  if (!achado) throw new Error('ctf.svg sem o bloco do hall da fama');
  return JSON.parse(achado[1]);
}

const estrelas = (nivel) => '★'.repeat(nivel);

/** Os mais recentes aparecem primeiro; quem não couber vira "+N". */
function linhasDoHall(hall) {
  const nomes = Object.entries(hall)
    .reverse()
    .map(([login, nivel]) => `@${login} ${estrelas(nivel)}`);
  if (nomes.length === 0) return ['@ninguém-ainda'];

  const linhas = [''];
  let exibidos = 0;
  for (const nome of nomes) {
    const atual = linhas.at(-1);
    const cabe = (atual ? atual.length + 3 : 0) + nome.length <= POR_LINHA - 4;
    if (cabe) {
      linhas[linhas.length - 1] = atual ? `${atual} · ${nome}` : nome;
    } else if (linhas.length < LINHAS) {
      linhas.push(nome);
    } else {
      break;
    }
    exibidos += 1;
  }
  const resto = nomes.length - exibidos;
  if (resto > 0) linhas[linhas.length - 1] += ` +${resto}`;
  return linhas;
}

export function blocoDoHall(hall) {
  const textos = linhasDoHall(hall)
    .map((linha, i) => {
      const cor = Object.keys(hall).length ? COR_NOME : COR_RESTO;
      return `<text x="${AREA.x}" y="${AREA.y + i * AREA.altura}" font-size="11.5" fill="${cor}">${linha}</text>`;
    })
    .join('\n');
  return `<g id="hall" data-hall='${JSON.stringify(hall)}'>\n${textos}\n</g>`;
}

/** Registra o maior nível de cada pessoa. Devolve o SVG e se algo mudou. */
export function registrarNoHall(svg, login, nivel) {
  if (!loginValido(login)) throw new Error('login inválido');
  const hall = lerHall(svg);
  if ((hall[login] ?? 0) >= nivel) return { svg, mudou: false };

  // Reinsere no fim para a pessoa subir ao topo da lista dos mais recentes.
  delete hall[login];
  hall[login] = nivel;
  return { svg: svg.replace(BLOCO, () => blocoDoHall(hall)), mudou: true };
}
