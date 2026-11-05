import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { conquistas } from './cartoes/conquistas.mjs';
import { botoes, contatos } from './cartoes/contato.mjs';
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

/**
 * As fatias ficam em linhas de 24px do GitHub: mais baixas que isso, abrem um vão.
 * 330px é a coluna do README num celular; os cards têm 900 de largura.
 */
const alturaMinima = (24 * 900) / 330;

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

  it('as fatias formam um card só: par de missões e rodapé', () => {
    const sonara = tamanho(fatias['missao-sonara']);
    const mandaChuva = tamanho(fatias['missao-mandachuva']);
    const rodape = tamanho(missoesSecretas());

    assert.equal(rodape.largura, 900);
    assert.equal(sonara.largura + mandaChuva.largura, 900);
    assert.equal(sonara.altura, mandaChuva.altura);
    assert.ok(rodape.altura >= alturaMinima);
  });

  it('a etiqueta do capítulo fica na fatia do Sonara', () => {
    assert.match(fatias['missao-sonara'], /CAP\. 2 · MISSÕES EM DESTAQUE/);
    assert.doesNotMatch(fatias['missao-mandachuva'], /CAP\. 2/);
  });
});

describe('inventário', () => {
  it('usa os ladrilhos do design, com letras só onde não existe logo', () => {
    const svg = inventario();
    assert.equal(svg.match(/<svg x="0" y="0" width="44" height="44" viewBox="0 0 44 44">/g).length, 30);
    for (const letras of ['>Nm<', '>pv<', '>C#<']) assert.ok(svg.includes(letras), letras);
    assert.ok(!svg.includes('>TS<'));
  });

  it('não deixa o quadrado do ícone vazar do canto arredondado', () => {
    assert.match(inventario(), /<clipPath id="canto">/);
  });
});

describe('conquistas', () => {
  it('usa os seis ícones em pixel art do design, sem emoji', () => {
    const svg = conquistas();
    assert.equal(svg.match(/shape-rendering="crispEdges"/g).length, 6);
    assert.doesNotMatch(svg, /🎓|🧠|🤖|🏢|🎧|🔓/);
  });
});

describe('contato', () => {
  const esquerda = contatos().map(([, svg]) => tamanho(svg));
  const direita = botoes().map(([, svg]) => tamanho(svg));

  it('cada linha é uma fatia do card mais um botão, na mesma altura', () => {
    assert.equal(esquerda.length, 3);
    esquerda.forEach((fatia, i) => {
      assert.equal(fatia.largura + direita[i].largura, 900);
      assert.equal(fatia.altura, direita[i].altura);
      assert.ok(fatia.altura >= alturaMinima);
    });
  });

  it('a chamada, o título e o inglês caem cada um numa fatia, sem texto cortado', () => {
    const [chamada, titulo, ingles] = contatos().map(([, svg]) => svg);
    assert.match(chamada, /PRESS START/);
    assert.match(titulo, /Vamos construir algo\?/);
    assert.match(ingles, /Let’s build something\./);
  });

  it('segue os botões do design, com logo e sem os rótulos de controle', () => {
    const pecas = botoes().map(([, svg]) => svg);
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

  it('explica o peso de cada coisa no nível', () => {
    assert.match(gitStatus(dados), /commits \+ PRs×5 \+ estrelas×10/);
  });

  it('não promete repositórios privados que o token do Action não enxerga', () => {
    assert.doesNotMatch(gitStatus(dados), /privados/);
  });

  it('aguenta linguagem sem cor e dia sem contribuição', () => {
    assert.doesNotMatch(gitStatus(dados), /null|undefined|NaN/);
  });
});

describe('README', () => {
  const fatiasDoReadme = [
    ['assets/missao-sonara.svg', '50%'],
    ['assets/missao-mandachuva.svg', '50%'],
    ['assets/missoes-secretas.svg', '100%'],
    ['assets/contato-1.svg', '68%'],
    ['assets/contato-2.svg', '68%'],
    ['assets/contato-3.svg', '68%'],
    ['assets/botao-linkedin.svg', '32%'],
    ['assets/botao-portfolio.svg', '32%'],
    ['assets/botao-steam.svg', '32%'],
  ];

  it('emenda as fatias na proporção certa e sem vão de linha', () => {
    for (const [arquivo, largura] of fatiasDoReadme) {
      assert.match(tagDe(arquivo), new RegExp(`width="${largura}"[^>]*align="top"`), arquivo);
    }
  });

  it('não usa align left nem right, que ganham 20px de padding no GitHub', () => {
    assert.doesNotMatch(readme, /align="(left|right)"/);
  });

  it('não deixa espaço entre as duas imagens de uma mesma linha', () => {
    assert.match(readme, /missao-sonara\.svg"[^>]*><\/a><a /);
    for (const n of [1, 2, 3]) assert.match(readme, new RegExp(`contato-${n}\\.svg"[^>]*></a><a `));
  });

  it('cada missão abre o próprio site', () => {
    assert.match(readme, /href="https:\/\/pedroa07\.github\.io\/Sonara-download\/"><img src="assets\/missao-sonara\.svg"/);
    assert.match(readme, /href="https:\/\/pedroa07\.github\.io\/Interface-Manda-Chuva-Bot\/"><img src="assets\/missao-mandachuva\.svg"/);
  });

  it('o placar fica entre o inventário e as conquistas, como no design', () => {
    const inventarioEm = readme.indexOf('assets/inventario.svg');
    const placarEm = readme.indexOf('PedroA07/output-hq/git-status.svg');
    const conquistasEm = readme.indexOf('assets/conquistas.svg');
    assert.ok(inventarioEm < placarEm && placarEm < conquistasEm);
  });
});
