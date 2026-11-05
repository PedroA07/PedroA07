import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { emoldurar } from './moldura-cobra.mjs';

// Trechos reais do SVG publicado pelo Platane/snk v3, inclusive a barra de progresso (classe u).
const cobra =
  '<svg viewBox="-16 -32 880 192" width="880" height="192" xmlns="http://www.w3.org/2000/svg"><desc>Generated with https://github.com/Platane/snk</desc><style>:root{--cb:#1b1f230a;--cs:#56d364;--ce:#e6dfd2}.s{shape-rendering:geometricPrecision;fill:var(--cs);animation:none linear 71300ms infinite}@keyframes s0{0%,99.86%{transform:translate(0px,-16px)}0.98%{transform:translate(96px,112px)}}</style><rect class="u u0" height="12" width="502.6" x="0.0" y="144"/><rect class="s s0" x="0.8" y="0.8" width="14.4" height="14.4" rx="4.5" ry="4.5"/></svg>';

const janela = (svg) => {
  const [x, y, largura, altura] = /<svg x="\d+" y="\d+" width="\d+" height="[\d.]+" viewBox="([^"]+)">/
    .exec(svg)[1]
    .split(' ')
    .map(Number);
  return { x, y, largura, altura };
};

describe('emoldurar', () => {
  it('põe a etiqueta do capítulo e mantém a cobra original dentro', () => {
    const svg = emoldurar(cobra);
    assert.match(svg, /CAP\. 4 · A COBRA QUE COME COMMITS/);
    assert.match(svg, /<desc>Generated with https:\/\/github\.com\/Platane\/snk<\/desc>/);
    assert.match(svg, /<rect class="s s0"/);
  });

  it('aninha a cobra mantendo a proporção da janela', () => {
    const svg = emoldurar(cobra);
    const [, largura, altura] = /<svg x="\d+" y="\d+" width="(\d+)" height="([\d.]+)" viewBox=/.exec(svg);
    const { largura: l, altura: a } = janela(svg);
    assert.ok(Math.abs(Number(largura) / Number(altura) - l / a) < 0.01);
  });

  it('o SVG externo tem tamanho próprio e só um xmlns', () => {
    const svg = emoldurar(cobra);
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="900" height="\d+" viewBox="0 0 900 \d+"/);
    assert.equal(svg.match(/xmlns=/g).length, 1);
  });

  it('dá contorno de HQ à cobra', () => {
    assert.match(emoldurar(cobra), /\.s\{stroke:#17140f/);
  });

  it('é um card de papel com a paleta da revista, como no design', () => {
    const svg = emoldurar(cobra);
    assert.match(svg, /fill="#f2eee6" stroke="#17140f"/);
    for (const cor of ['#e6dfd2', '#f1c75b', '#e8794f', '#c4471f', '#17140f']) assert.ok(svg.includes(cor));
    assert.ok(!svg.includes('#0d1117'), 'o card não pode ter fundo escuro');
  });

  it('deixa de fora a barra de progresso do snk', () => {
    const { y, altura } = janela(emoldurar(cobra));
    assert.ok(y + altura <= 144, 'a barra começa em y=144');
  });

  it('não corta o trajeto da cobra, de uma célula acima a uma abaixo da grade', () => {
    const { x, y, altura } = janela(emoldurar(cobra));
    assert.equal(x, -16);
    assert.ok(y <= -16);
    assert.ok(y + altura >= 112 + 16);
  });

  it('acompanha a largura da grade quando o ano tem mais semanas', () => {
    const maior = cobra.replace('viewBox="-16 -32 880 192"', 'viewBox="-16 -32 896 192"');
    assert.equal(janela(emoldurar(maior)).largura, 896);
  });

  it('recusa arquivo que não parece um SVG da cobra', () => {
    assert.throws(() => emoldurar('<html></html>'), /SVG/);
  });
});

describe('workflow da cobra', () => {
  const workflow = readFileSync(new URL('../workflows/main.yml', import.meta.url), 'utf8');
  const readme = readFileSync(new URL('../../README.md', import.meta.url), 'utf8');

  it('gera uma cobra só, com a paleta da revista', () => {
    assert.ok(
      workflow.includes('dist/github-contribution-grid-snake.svg?color_snake=#56d364&color_dots=#e6dfd2,#f1c75b,#e8794f,#c4471f,#17140f'),
    );
    assert.ok(!workflow.includes('snake-dark'));
  });

  it('coloca a moldura antes de publicar na branch output', () => {
    assert.ok(workflow.indexOf('moldura-cobra.mjs') < workflow.indexOf('target_branch: output'));
    assert.ok(workflow.indexOf('Platane/snk') < workflow.indexOf('moldura-cobra.mjs'));
  });

  it('uma falha no placar não impede a cobra de ser publicada', () => {
    const passoDoPlacar = workflow.slice(workflow.indexOf('gerar o placar de git status'), workflow.indexOf('target_branch: output'));
    assert.match(passoDoPlacar, /continue-on-error: true/);
    assert.match(passoDoPlacar, /test -f dist\/git-status\.svg/, 'precisa manter o placar anterior');
  });

  it('publica numa branch própria, sem tocar na output do perfil atual', () => {
    assert.match(workflow, /target_branch: output-hq/);
    assert.doesNotMatch(workflow, /target_branch: output$/m);
    assert.match(workflow, /- perfil-hq-09/);
  });

  it('o README mostra o arquivo que o workflow publica', () => {
    assert.ok(readme.includes('PedroA07/output-hq/github-contribution-grid-snake.svg'));
    assert.ok(!readme.includes('snake-dark'));
  });
});
