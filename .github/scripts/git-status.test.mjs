import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calcularNivel, linguagens, resumir, semana, sequencias } from './git-status.mjs';

const dias = (...totais) =>
  totais.map((contributionCount, i) => ({
    date: `2026-03-${String(i + 1).padStart(2, '0')}`,
    contributionCount,
  }));

describe('sequencias', () => {
  it('conta os dias seguidos até hoje', () => {
    assert.equal(sequencias(dias(1, 0, 2, 3, 1)).atual, 3);
  });

  it('não zera a sequência só porque hoje ainda não teve commit', () => {
    assert.equal(sequencias(dias(1, 2, 3, 0)).atual, 3);
  });

  it('zera quando ontem também ficou em branco', () => {
    assert.equal(sequencias(dias(1, 2, 0, 0)).atual, 0);
  });

  it('guarda a maior sequência da história', () => {
    assert.equal(sequencias(dias(1, 1, 1, 1, 0, 2, 0, 1)).recorde, 4);
  });

  it('aguenta perfil sem nenhuma contribuição', () => {
    assert.deepEqual(sequencias([]), { atual: 0, recorde: 0 });
  });
});

describe('calcularNivel', () => {
  it('sobe de nível pela raiz quadrada de commits + PRs×5 + estrelas×10', () => {
    assert.deepEqual(calcularNivel({ commits: 21, prs: 16, estrelas: 2 }), { nivel: 11, progresso: 0 });
  });

  it('mostra quanto falta para o próximo nível', () => {
    const { nivel, progresso } = calcularNivel({ commits: 110, prs: 0, estrelas: 0 });
    assert.equal(nivel, 10);
    assert.ok(Math.abs(progresso - 10 / 21) < 0.001);
  });

  it('começa do zero', () => {
    assert.deepEqual(calcularNivel({ commits: 0, prs: 0, estrelas: 0 }), { nivel: 0, progresso: 0 });
  });
});

describe('linguagens', () => {
  const repo = (...pares) => ({
    stargazerCount: 0,
    languages: { edges: pares.map(([name, size, color]) => ({ size, node: { name, color } })) },
  });

  it('soma o tamanho entre repositórios e ordena da maior para a menor', () => {
    const lista = linguagens([repo(['TypeScript', 60, '#3178c6'], ['CSS', 10, '#563d7c']), repo(['TypeScript', 20, '#3178c6'], ['C#', 10, null])]);
    assert.deepEqual(lista.map((l) => l.nome), ['TypeScript', 'CSS', 'C#']);
    assert.equal(lista[0].pct, 80);
  });

  it('junta o que passar de cinco linguagens em "outras"', () => {
    const lista = linguagens([repo(['A', 50], ['B', 20], ['C', 10], ['D', 10], ['E', 5], ['F', 3], ['G', 2])]);
    assert.equal(lista.length, 6);
    assert.deepEqual(lista.at(-1), { nome: 'outras', pct: 5, cor: '#6e7681' });
  });

  it('fica vazia quando nenhum repositório tem código', () => {
    assert.deepEqual(linguagens([repo()]), []);
  });
});

describe('semana', () => {
  it('pega os últimos sete dias com a inicial de cada um', () => {
    const lista = semana(dias(9, 1, 2, 3, 4, 5, 6, 7));
    assert.deepEqual(lista.map((d) => d.total), [1, 2, 3, 4, 5, 6, 7]);
    // 2 de março de 2026 caiu numa segunda.
    assert.deepEqual(lista.map((d) => d.letra), ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']);
  });
});

describe('resumir', () => {
  const perfil = {
    followers: { totalCount: 8 },
    pullRequests: { totalCount: 48 },
    issues: { totalCount: 23 },
    repositories: {
      totalCount: 2,
      nodes: [
        { stargazerCount: 40, languages: { edges: [{ size: 10, node: { name: 'Python', color: '#3572A5' } }] } },
        { stargazerCount: 2, languages: { edges: [] } },
      ],
    },
  };
  const anos = [
    { commits: 500, privados: 0, dias: dias(1, 1) },
    { commits: 700, privados: 34, dias: dias(0, 2, 3) },
  ];

  it('junta o perfil com o ano atual, que é o último da lista', () => {
    const r = resumir(perfil, anos);
    assert.equal(r.commits, 734);
    assert.equal(r.prs, 48);
    assert.equal(r.issues, 23);
    assert.equal(r.repos, 2);
    assert.equal(r.estrelas, 42);
    assert.equal(r.seguidores, 8);
  });

  it('calcula a sequência com a história inteira', () => {
    const r = resumir(perfil, anos);
    assert.deepEqual(r.sequencia, { atual: 2, recorde: 2 });
  });

  it('o nível usa os mesmos números que aparecem no card', () => {
    assert.deepEqual(resumir(perfil, anos).nivel, calcularNivel({ commits: 734, prs: 48, estrelas: 42 }));
  });
});
