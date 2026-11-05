import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { botoes, contato } from './cartoes/contato.mjs';
import { gitStatus } from './cartoes/gitstatus.mjs';
import { inventario } from './cartoes/inventario.mjs';
import { missoes, missoesSecretas } from './cartoes/missoes.mjs';

const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');

const tamanho = (svg) => {
  const [, largura, altura] = /<svg [^>]*width="(\d+)" height="(\d+)"/.exec(svg);
  return { largura: Number(largura), altura: Number(altura) };
};

/** Tag <img> do README que aponta para um arquivo. */
const tagDe = (arquivo) => new RegExp(`<img src="${arquivo.replace('.', '\\.')}"[^>]*>`).exec(readme)?.[0] ?? '';

describe('capítulo 2: missões', () => {
  const fatias = Object.fromEntries(missoes());

  it('não sobrou texto provisório do design', () => {
    const tudo = Object.values(fatias).join('');
    assert.doesNotMatch(tudo, /descrição curta|stack do projeto aqui/);
  });

  it('cada missão traz a foto real embutida e nenhuma imagem externa', () => {
    for (const nome of ['missao-sonara', 'missao-mandachuva']) {
      assert.match(fatias[nome], /<image href="data:image\/jpeg;base64,/, nome);
      assert.doesNotMatch(fatias[nome], /href="http/, nome);
    }
  });

  it('o Manda Chuva descreve o bot de verdade', () => {
    assert.match(fatias['missao-mandachuva'], /Manda Chuva/);
    assert.match(fatias['missao-mandachuva'], /discord\.js/);
  });

  it('as fatias formam um card só: topo, par de missões e rodapé', () => {
    const topo = tamanho(fatias['missoes-topo']);
    const sonara = tamanho(fatias['missao-sonara']);
    const mandaChuva = tamanho(fatias['missao-mandachuva']);
    const rodape = tamanho(missoesSecretas());

    assert.equal(topo.largura, 900);
    assert.equal(rodape.largura, 900);
    assert.equal(sonara.largura + mandaChuva.largura, 900);
    assert.equal(sonara.altura, mandaChuva.altura);
  });

  it('a etiqueta do capítulo fica na fatia de cima', () => {
    assert.match(fatias['missoes-topo'], /CAP\. 2 · MISSÕES EM DESTAQUE/);
  });
});

describe('inventário', () => {
  it('usa os logos reais, deixando letras só onde não existe logo', () => {
    const svg = inventario();
    assert.ok(svg.match(/<path /g).length >= 28);
    for (const letras of ['>Nm<', '>pv<', '>C#<']) assert.ok(svg.includes(letras), letras);
    assert.ok(!svg.includes('>TS<'));
  });
});

describe('contato', () => {
  const pecas = botoes().map(([, svg]) => svg);

  it('o card e os três botões empilhados fecham a mesma altura e largura', () => {
    const card = tamanho(contato());
    const medidas = pecas.map(tamanho);
    assert.equal(card.largura + medidas[0].largura, 900);
    assert.ok(medidas.every((m) => m.largura === medidas[0].largura));
    assert.equal(medidas.reduce((soma, m) => soma + m.altura, 0), card.altura);
  });

  it('segue os botões do design, com logo e sem os rótulos de controle', () => {
    assert.match(pecas[0], /LinkedIn/);
    assert.match(pecas[1], /Nexus · Portfólio/);
    assert.match(pecas[2], /Steam/);
    for (const svg of pecas) assert.match(svg, /<path /);
    assert.doesNotMatch(pecas.join(''), /\[A\]|\[B\]|\[X\]/);
  });
});

describe('placar de git status', () => {
  const dados = {
    commits: 1234,
    prs: 48,
    issues: 23,
    repos: 17,
    estrelas: 42,
    seguidores: 8,
    nivel: { nivel: 36, progresso: 0.37 },
    sequencia: { atual: 12, recorde: 34 },
    linguagens: [
      { nome: 'TypeScript', pct: 70, cor: '#3178c6' },
      { nome: 'C#', pct: 30, cor: null },
    ],
    semana: [
      { letra: 'S', total: 4 },
      { letra: 'T', total: 0 },
    ],
  };

  it('mostra a etiqueta, os números recebidos e o nível seguinte', () => {
    const svg = gitStatus(dados);
    assert.match(svg, /PLACAR · GIT STATUS/);
    assert.match(svg, />1\.2k</);
    assert.match(svg, />★ 42</);
    assert.match(svg, />LV 36</);
    assert.match(svg, /XP → LV 37/);
    assert.match(svg, />12</);
    assert.match(svg, />34</);
  });

  it('não promete repositórios privados que o token do Action não enxerga', () => {
    assert.doesNotMatch(gitStatus(dados), /privados/);
  });

  it('aguenta linguagem sem cor e dia sem contribuição', () => {
    assert.doesNotMatch(gitStatus(dados), /null|undefined|NaN/);
  });
});

describe('README', () => {
  it('emenda as fatias na proporção certa, sem vão entre elas', () => {
    assert.match(tagDe('assets/missoes-topo.svg'), /width="100%"[^>]*align="left"/);
    assert.match(tagDe('assets/missao-sonara.svg'), /width="50%"[^>]*align="left"/);
    assert.match(tagDe('assets/missao-mandachuva.svg'), /width="50%"[^>]*align="left"/);
    assert.match(tagDe('assets/missoes-secretas.svg'), /width="100%"[^>]*align="left"/);
    assert.match(tagDe('assets/contato.svg'), /width="68%"[^>]*align="left"/);
    for (const botao of ['linkedin', 'portfolio', 'steam']) {
      assert.match(tagDe(`assets/botao-${botao}.svg`), /width="32%"[^>]*align="left"/);
    }
  });

  it('solta o fluxo depois de cada grupo de fatias', () => {
    assert.equal(readme.match(/<br clear="all">/g).length, 2);
  });

  it('cada missão abre o próprio site', () => {
    assert.match(readme, /href="https:\/\/pedroa07\.github\.io\/Sonara-download\/"><img src="assets\/missao-sonara\.svg"/);
    assert.match(readme, /href="https:\/\/pedroa07\.github\.io\/Interface-Manda-Chuva-Bot\/"><img src="assets\/missao-mandachuva\.svg"/);
  });

  it('o placar fica entre o inventário e as conquistas, como no design', () => {
    const inventarioEm = readme.indexOf('assets/inventario.svg');
    const placarEm = readme.indexOf('PedroA07/output/git-status.svg');
    const conquistasEm = readme.indexOf('assets/conquistas.svg');
    assert.ok(inventarioEm < placarEm && placarEm < conquistasEm);
  });
});
