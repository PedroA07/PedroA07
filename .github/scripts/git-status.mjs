// Busca os números do perfil no GitHub e gera o card do placar.
// Uso: GITHUB_TOKEN=... node .github/scripts/git-status.mjs <saida.svg>
// O token do Action só enxerga dados públicos, além da contagem anônima de contribuições
// privadas quando o perfil escolhe mostrá-la.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gitStatus } from '../../scripts/cartoes/gitstatus.mjs';

const API = 'https://api.github.com/graphql';
const MAXIMO_DE_LINGUAGENS = 5;
const COR_OUTRAS = '#6e7681';
const INICIAIS = 'DSTQQSS';

const CONSULTA_PERFIL = `query ($login: String!) {
  user(login: $login) {
    followers { totalCount }
    pullRequests { totalCount }
    issues { totalCount }
    contributionsCollection { contributionYears }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name color } }
        }
      }
    }
  }
}`;

const CONSULTA_ANO = `query ($login: String!, $de: DateTime!, $ate: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $de, to: $ate) {
      totalCommitContributions
      restrictedContributionsCount
      contributionCalendar {
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

/** Hoje sem contribuição não quebra a sequência: o dia ainda não acabou. */
export function sequencias(dias) {
  let recorde = 0;
  let corrente = 0;
  for (const { contributionCount } of dias) {
    corrente = contributionCount > 0 ? corrente + 1 : 0;
    recorde = Math.max(recorde, corrente);
  }

  const passados = dias.at(-1)?.contributionCount === 0 ? dias.slice(0, -1) : dias;
  let atual = 0;
  for (let i = passados.length - 1; i >= 0 && passados[i].contributionCount > 0; i -= 1) atual += 1;
  return { atual, recorde };
}

export function calcularNivel({ commits, prs, estrelas }) {
  const xp = commits + prs + estrelas;
  const nivel = Math.floor(Math.sqrt(xp));
  return { nivel, progresso: (xp - nivel ** 2) / ((nivel + 1) ** 2 - nivel ** 2) };
}

export function linguagens(repositorios) {
  const porNome = new Map();
  for (const { languages } of repositorios) {
    for (const { size, node } of languages.edges) {
      const atual = porNome.get(node.name) ?? { nome: node.name, tamanho: 0, cor: node.color ?? null };
      atual.tamanho += size;
      porNome.set(node.name, atual);
    }
  }

  const ordenadas = [...porNome.values()].sort((a, b) => b.tamanho - a.tamanho);
  const total = ordenadas.reduce((soma, l) => soma + l.tamanho, 0);
  const pct = (tamanho) => Math.round((tamanho * 100) / total);
  const principais = ordenadas.slice(0, MAXIMO_DE_LINGUAGENS).map(({ nome, tamanho, cor }) => ({ nome, pct: pct(tamanho), cor }));

  const resto = ordenadas.slice(MAXIMO_DE_LINGUAGENS).reduce((soma, l) => soma + l.tamanho, 0);
  return resto ? [...principais, { nome: 'outras', pct: pct(resto), cor: COR_OUTRAS }] : principais;
}

export const semana = (dias) =>
  dias.slice(-7).map(({ date, contributionCount }) => ({
    letra: INICIAIS[new Date(`${date}T00:00:00Z`).getUTCDay()],
    total: contributionCount,
  }));

/** `anos` vem do mais antigo para o mais novo, e o último é o ano atual. */
export function resumir(perfil, anos) {
  const repositorios = perfil.repositories.nodes;
  const dias = anos.flatMap((ano) => ano.dias);
  const atual = anos.at(-1);

  const commits = atual.commits + atual.privados;
  const prs = perfil.pullRequests.totalCount;
  const estrelas = repositorios.reduce((soma, r) => soma + r.stargazerCount, 0);

  return {
    commits,
    prs,
    issues: perfil.issues.totalCount,
    repos: perfil.repositories.totalCount,
    estrelas,
    seguidores: perfil.followers.totalCount,
    nivel: calcularNivel({ commits, prs, estrelas }),
    sequencia: sequencias(dias),
    linguagens: linguagens(repositorios),
    semana: semana(dias),
  };
}

async function consultar(query, variables, token) {
  const resposta = await fetch(API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const { data, errors } = await resposta.json();
  if (!resposta.ok || errors) throw new Error(`GitHub respondeu ${resposta.status}: ${JSON.stringify(errors)}`);
  return data.user;
}

async function buscarAno(login, ano, agora, token) {
  const fim = new Date(Date.UTC(ano, 11, 31, 23, 59, 59));
  const { contributionsCollection: c } = await consultar(
    CONSULTA_ANO,
    { login, de: new Date(Date.UTC(ano, 0, 1)).toISOString(), ate: (fim < agora ? fim : agora).toISOString() },
    token,
  );
  return {
    commits: c.totalCommitContributions,
    privados: c.restrictedContributionsCount,
    dias: c.contributionCalendar.weeks.flatMap((w) => w.contributionDays),
  };
}

async function principal() {
  const [saida] = process.argv.slice(2);
  const { GITHUB_REPOSITORY_OWNER: login, GITHUB_TOKEN: token } = process.env;

  const perfil = await consultar(CONSULTA_PERFIL, { login }, token);
  const agora = new Date();
  // O GitHub devolve os anos do mais novo para o mais antigo.
  const anosComContribuicao = perfil.contributionsCollection.contributionYears.toSorted((a, b) => a - b);
  const anos = await Promise.all(anosComContribuicao.map((ano) => buscarAno(login, ano, agora, token)));

  mkdirSync(dirname(saida), { recursive: true });
  writeFileSync(saida, gitStatus(resumir(perfil, anos)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await principal();
