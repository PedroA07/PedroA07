// Valida as flags enviadas por issue. O título é escrito por qualquer pessoa, então ele só
// entra aqui pelo arquivo do evento, nunca passa por um shell e nunca volta em comentário.

import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { loginValido, registrarNoHall } from './hall.mjs';

const CAMINHO_SVG = 'assets/ctf.svg';
const TITULO_RESOLVIDO = 'flag: ✔ resolvida';

/** SHA-256 de cada flag. A resposta em texto puro não existe neste repositório. */
const HASHES = new Map([
  ['a7d6af8d0506475150998a9f1806053e747072ebf9b1894ba76dbbff730ccef3', 1],
  ['44711c030eb2e9dfc116957ddf73e6a5998e6952121b19faed958fb72cf5868d', 2],
  ['9261ea8b7e4444734886b80a6f6f2839688cf3b6bbf37254b4be0df56f882fcb', 3],
]);

const COMENTARIOS = {
  acerto: (login, nivel) =>
    `🏴 Flag do nível ${nivel} certa, @${login}! Seu @ entrou no hall da fama.\n\nCorrect flag for level ${nivel}! You are in the hall of fame.`,
  repetido: (nivel) =>
    `🏴 Flag do nível ${nivel} certa, mas você já tinha chegado até aqui. Falta alguma?\n\nCorrect, but you already reached this level. Any left?`,
  erro: () =>
    'Essa flag não confere. Confira o formato do título, `flag: flag{...}`, e tente de novo.\n\nThat flag does not match. Check the title format and try again.',
};

export function extrairFlag(titulo) {
  const achado = /^flag:\s*(\S.*)$/is.exec(titulo.trim());
  return achado ? achado[1].trim() : null;
}

export function nivelDaFlag(tentativa) {
  const hash = createHash('sha256').update(tentativa).digest('hex');
  return HASHES.get(hash) ?? null;
}

export async function processarIssue({ issue, lerSvg, escreverSvg, publicarHall, comentar, fechar }) {
  const login = issue.user.login;
  if (issue.user.type !== 'User' || !loginValido(login)) return;

  const tentativa = extrairFlag(issue.title);
  const nivel = tentativa ? nivelDaFlag(tentativa) : null;

  if (!nivel) {
    await comentar(issue.number, COMENTARIOS.erro());
    await fechar(issue.number, { state: 'closed', state_reason: 'not_planned' });
    return;
  }

  const { svg, mudou } = registrarNoHall(await lerSvg(), login, nivel);
  if (mudou) {
    await escreverSvg(svg);
    await publicarHall(login, nivel);
  }

  await comentar(issue.number, mudou ? COMENTARIOS.acerto(login, nivel) : COMENTARIOS.repetido(nivel));
  // O título sai da lista de issues para a resposta não ficar exposta aos próximos jogadores.
  await fechar(issue.number, { state: 'closed', state_reason: 'completed', title: TITULO_RESOLVIDO });
}

const git = promisify(execFile).bind(null, 'git');

async function publicarHall(login, nivel) {
  await git(['config', 'user.name', 'github-actions[bot]']);
  await git(['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
  await git(['add', CAMINHO_SVG]);
  await git(['commit', '-m', `ctf: @${login} chegou ao nível ${nivel}`]);

  for (let tentativa = 1; ; tentativa += 1) {
    try {
      await git(['pull', '--rebase', 'origin', 'main']);
      await git(['push', 'origin', 'HEAD:main']);
      return;
    } catch (erro) {
      if (tentativa === 3) throw erro;
    }
  }
}

function clienteGitHub(repositorio, token) {
  const chamar = async (metodo, caminho, corpo) => {
    const resposta = await fetch(`https://api.github.com/repos/${repositorio}${caminho}`, {
      method: metodo,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify(corpo),
    });
    if (!resposta.ok) throw new Error(`GitHub respondeu ${resposta.status} em ${caminho}`);
  };
  return {
    comentar: (numero, texto) => chamar('POST', `/issues/${numero}/comments`, { body: texto }),
    fechar: (numero, dados) => chamar('PATCH', `/issues/${numero}`, dados),
  };
}

async function principal() {
  const { GITHUB_EVENT_PATH, GITHUB_REPOSITORY, GITHUB_TOKEN } = process.env;
  const { issue } = JSON.parse(await readFile(GITHUB_EVENT_PATH, 'utf8'));
  await processarIssue({
    issue,
    lerSvg: () => readFile(CAMINHO_SVG, 'utf8'),
    escreverSvg: (svg) => writeFile(CAMINHO_SVG, svg),
    publicarHall,
    ...clienteGitHub(GITHUB_REPOSITORY, GITHUB_TOKEN),
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await principal();
