import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { emoldurar } from './moldura-cobra.mjs';

const cobra =
  '<svg viewBox="-16 -32 880 192" width="880" height="192" xmlns="http://www.w3.org/2000/svg"><desc>Generated with https://github.com/Platane/snk</desc><style>:root{--cs:purple}.s{fill:var(--cs)}</style><rect class="s s0" x="0.8" y="0.8" width="14.4" height="14.4"/></svg>';

describe('emoldurar', () => {
  it('põe a etiqueta do capítulo e mantém a cobra original dentro', () => {
    const svg = emoldurar(cobra, 'claro');
    assert.match(svg, /CAP\. 4 · A COBRA QUE COME COMMITS/);
    assert.match(svg, /<desc>Generated with https:\/\/github\.com\/Platane\/snk<\/desc>/);
    assert.match(svg, /<rect class="s s0"/);
  });

  it('aninha a cobra preservando o viewBox e mantendo a proporção', () => {
    const svg = emoldurar(cobra, 'claro');
    const aninhado = /<svg x="\d+" y="\d+" width="(\d+)" height="([\d.]+)" viewBox="-16 -32 880 192">/.exec(svg);
    assert.ok(aninhado, 'esperava um <svg> aninhado');
    assert.ok(Math.abs(Number(aninhado[1]) / Number(aninhado[2]) - 880 / 192) < 0.01);
  });

  it('o SVG externo tem tamanho próprio e só um xmlns', () => {
    const svg = emoldurar(cobra, 'claro');
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="900" height="\d+" viewBox="0 0 900 \d+"/);
    assert.equal(svg.match(/xmlns=/g).length, 1);
  });

  it('dá contorno de HQ à cobra', () => {
    assert.match(emoldurar(cobra, 'claro'), /\.s\{stroke:#17140f/);
  });

  it('usa a paleta certa em cada tema', () => {
    const claro = emoldurar(cobra, 'claro');
    const escuro = emoldurar(cobra, 'escuro');
    assert.match(claro, /fill="#f2eee6" stroke="#17140f"/);
    for (const cor of ['#e6dfd2', '#f1c75b', '#e8794f', '#c4471f', '#17140f']) assert.ok(claro.includes(cor));
    for (const cor of ['#161b22', '#5c3a1e', '#a0522d', '#c4471f', '#f1c75b']) assert.ok(escuro.includes(cor));
    assert.match(escuro, /fill="#0d1117" stroke="#17140f"/);
  });

  it('funciona com o SVG real no formato do Platane/snk', () => {
    const svg = emoldurar(cobra.replace('width="880"', 'width="896"'), 'escuro');
    assert.match(svg, /viewBox="-16 -32 880 192"/);
  });

  it('recusa arquivo que não parece um SVG da cobra', () => {
    assert.throws(() => emoldurar('<html></html>', 'claro'), /SVG/);
    assert.throws(() => emoldurar(cobra, 'azul'), /tema/);
  });
});

describe('workflow da cobra', () => {
  const workflow = readFileSync(new URL('../workflows/main.yml', import.meta.url), 'utf8');

  it('usa exatamente as paletas pedidas', () => {
    assert.ok(
      workflow.includes('dist/github-contribution-grid-snake.svg?color_snake=#56d364&color_dots=#e6dfd2,#f1c75b,#e8794f,#c4471f,#17140f'),
    );
    assert.ok(
      workflow.includes(
        'dist/github-contribution-grid-snake-dark.svg?color_snake=#56d364&color_dots=#161b22,#5c3a1e,#a0522d,#c4471f,#f1c75b',
      ),
    );
  });

  it('coloca a moldura antes de publicar na branch output', () => {
    assert.ok(workflow.indexOf('moldura-cobra.mjs') < workflow.indexOf('target_branch: output'));
    assert.ok(workflow.indexOf('Platane/snk') < workflow.indexOf('moldura-cobra.mjs'));
  });
});
