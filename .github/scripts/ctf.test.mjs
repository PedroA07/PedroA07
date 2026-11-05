import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { extrairFlag, nivelDaFlag, processarIssue } from './ctf.mjs';
import { blocoDoHall, lerHall, loginValido, registrarNoHall } from './hall.mjs';

const svgCom = (hall = {}) => `<svg><text>antes</text>\n${blocoDoHall(hall)}\n<text>depois</text></svg>`;

// Flags montadas em pedaços: nem o teste guarda a resposta inteira em texto puro.
const flag = (...partes) => `flag{${partes.join('_')}}`;
const NIVEL_1 = flag('curioso', 'eh', 'elogio');
const NIVEL_2 = flag('comentario', 'tambem', 'e', 'codigo');
const NIVEL_3 = flag('o', 'git', 'nunca', 'esquece');

function palco({ titulo, login = 'visitante', tipo = 'User', hall = {} }) {
  const chamadas = { comentarios: [], fechamentos: [], publicacoes: [] };
  let svg = svgCom(hall);
  return {
    chamadas,
    svg: () => svg,
    contexto: {
      issue: { number: 7, title: titulo, user: { login, type: tipo } },
      lerSvg: async () => svg,
      escreverSvg: async (novo) => {
        svg = novo;
      },
      publicarHall: async (quem, nivel) => chamadas.publicacoes.push([quem, nivel]),
      comentar: async (numero, texto) => chamadas.comentarios.push([numero, texto]),
      fechar: async (numero, dados) => chamadas.fechamentos.push([numero, dados]),
    },
  };
}

describe('extrairFlag', () => {
  it('lê a flag do título', () => {
    assert.equal(extrairFlag('flag: flag{abc}'), 'flag{abc}');
  });

  it('aceita variações de caixa e espaço', () => {
    assert.equal(extrairFlag('FLAG:flag{abc}'), 'flag{abc}');
    assert.equal(extrairFlag('  flag:    flag{abc}  '), 'flag{abc}');
  });

  it('ignora títulos que não seguem o formato', () => {
    assert.equal(extrairFlag('bug no README'), null);
    assert.equal(extrairFlag('flag:'), null);
  });
});

describe('nivelDaFlag', () => {
  it('reconhece os três níveis', () => {
    assert.equal(nivelDaFlag(NIVEL_1), 1);
    assert.equal(nivelDaFlag(NIVEL_2), 2);
    assert.equal(nivelDaFlag(NIVEL_3), 3);
  });

  it('recusa quase-acertos', () => {
    assert.equal(nivelDaFlag(NIVEL_1.toUpperCase()), null);
    assert.equal(nivelDaFlag(`${NIVEL_1} `), null);
    assert.equal(nivelDaFlag('flag{}'), null);
    assert.equal(nivelDaFlag(''), null);
  });
});

describe('segredos no código', () => {
  const fontes = ['ctf.mjs', 'hall.mjs'].map((nome) => readFileSync(new URL(nome, import.meta.url), 'utf8'));

  it('as flags não aparecem em texto puro na Action', () => {
    for (const fonte of fontes) {
      for (const resposta of [NIVEL_1, NIVEL_2, NIVEL_3]) assert.equal(fonte.includes(resposta), false);
    }
  });

  it('o workflow não interpola dados da issue em comandos de shell', () => {
    const workflow = readFileSync(new URL('../workflows/ctf.yml', import.meta.url), 'utf8');
    const execucoes = workflow.split('\n').filter((linha) => linha.trim().startsWith('run:'));
    assert.ok(execucoes.length > 0);
    for (const linha of execucoes) assert.equal(linha.includes('${{'), false);
  });

  it('o workflow só roda em issue nova com título de flag e em fila', () => {
    const workflow = readFileSync(new URL('../workflows/ctf.yml', import.meta.url), 'utf8');
    assert.match(workflow, /issues:\s+types: \[opened\]/);
    assert.match(workflow, /startsWith\(github\.event\.issue\.title, 'flag:'\)/);
    assert.match(workflow, /concurrency:/);
  });
});

describe('processarIssue', () => {
  it('acertou: entra no hall, publica, comenta e fecha como concluída', async () => {
    const { chamadas, svg, contexto } = palco({ titulo: `flag: ${NIVEL_1}` });
    await processarIssue(contexto);
    assert.deepEqual(lerHall(svg()), { visitante: 1 });
    assert.deepEqual(chamadas.publicacoes, [['visitante', 1]]);
    assert.equal(chamadas.comentarios.length, 1);
    assert.match(chamadas.comentarios[0][1], /nível 1/);
    assert.equal(chamadas.fechamentos[0][1].state, 'closed');
    assert.equal(chamadas.fechamentos[0][1].state_reason, 'completed');
  });

  it('acertou: esconde a flag do título para não entregar a resposta aos próximos', async () => {
    const { chamadas, contexto } = palco({ titulo: `flag: ${NIVEL_2}` });
    await processarIssue(contexto);
    const { title } = chamadas.fechamentos[0][1];
    assert.ok(title.startsWith('flag:'));
    assert.equal(title.includes('{'), false);
  });

  it('errou: comenta, fecha e não mexe no hall', async () => {
    const { chamadas, svg, contexto } = palco({ titulo: 'flag: flag{chute}' });
    await processarIssue(contexto);
    assert.deepEqual(lerHall(svg()), {});
    assert.deepEqual(chamadas.publicacoes, []);
    assert.match(chamadas.comentarios[0][1], /não confere/);
    assert.equal(chamadas.fechamentos[0][1].state_reason, 'not_planned');
    assert.equal(chamadas.fechamentos[0][1].title, undefined);
  });

  it('nunca repete a tentativa no comentário', async () => {
    const injecao = 'flag: <img src=x> @todo-mundo $(rm -rf /) `id`';
    const { chamadas, contexto } = palco({ titulo: injecao });
    await processarIssue(contexto);
    for (const trecho of ['<img', '@todo-mundo', 'rm -rf', '`id`']) {
      assert.equal(chamadas.comentarios[0][1].includes(trecho), false);
    }
  });

  it('nível repetido: agradece sem publicar de novo', async () => {
    const { chamadas, contexto } = palco({ titulo: `flag: ${NIVEL_1}`, hall: { visitante: 1 } });
    await processarIssue(contexto);
    assert.deepEqual(chamadas.publicacoes, []);
    assert.match(chamadas.comentarios[0][1], /já/);
    assert.equal(chamadas.fechamentos[0][1].state_reason, 'completed');
  });

  it('nível maior atualiza a mesma pessoa', async () => {
    const { svg, contexto } = palco({ titulo: `flag: ${NIVEL_3}`, hall: { visitante: 1 } });
    await processarIssue(contexto);
    assert.deepEqual(lerHall(svg()), { visitante: 3 });
  });

  it('nível menor não rebaixa quem já foi além', async () => {
    const { chamadas, svg, contexto } = palco({ titulo: `flag: ${NIVEL_1}`, hall: { visitante: 3 } });
    await processarIssue(contexto);
    assert.deepEqual(lerHall(svg()), { visitante: 3 });
    assert.deepEqual(chamadas.publicacoes, []);
  });

  it('robôs não entram no hall', async () => {
    const { chamadas, svg, contexto } = palco({
      titulo: `flag: ${NIVEL_1}`,
      login: 'dependabot[bot]',
      tipo: 'Bot',
    });
    await processarIssue(contexto);
    assert.deepEqual(lerHall(svg()), {});
    assert.deepEqual(chamadas.publicacoes, []);
    assert.deepEqual(chamadas.comentarios, []);
    assert.deepEqual(chamadas.fechamentos, []);
  });

  it('se publicar falhar, a execução falha e a issue fica aberta para tentar de novo', async () => {
    const { chamadas, contexto } = palco({ titulo: `flag: ${NIVEL_1}` });
    contexto.publicarHall = async () => {
      throw new Error('push recusado');
    };
    await assert.rejects(processarIssue(contexto), /push recusado/);
    assert.deepEqual(chamadas.fechamentos, []);
  });
});

describe('hall da fama', () => {
  it('valida logins do GitHub', () => {
    assert.equal(loginValido('Pedro-A07'), true);
    assert.equal(loginValido('dependabot[bot]'), false);
    assert.equal(loginValido("x'><script>"), false);
    assert.equal(loginValido('-comeca-com-hifen'), false);
    assert.equal(loginValido('a'.repeat(40)), false);
  });

  it('recusa login inválido mesmo se chamado direto', () => {
    assert.throws(() => registrarNoHall(svgCom(), "x'><script>", 1), /login inválido/);
  });

  it('mostra um convite quando está vazio', () => {
    assert.match(blocoDoHall({}), /@ninguém-ainda/);
  });

  it('mantém o resto do SVG intacto', () => {
    const { svg } = registrarNoHall(svgCom(), 'visitante', 2);
    assert.match(svg, /<text>antes<\/text>/);
    assert.match(svg, /<text>depois<\/text>/);
  });

  it('mostra os mais recentes primeiro, com estrelas por nível', () => {
    let { svg } = registrarNoHall(svgCom(), 'primeira', 1);
    ({ svg } = registrarNoHall(svg, 'segunda', 3));
    assert.match(svg, /@segunda ★★★ · @primeira ★/);
  });

  it('resume quem não cabe', () => {
    let svg = svgCom();
    for (let i = 0; i < 12; i += 1) ({ svg } = registrarNoHall(svg, `jogador-numero-${i}`, 1));
    assert.match(svg, /\+\d+/);
    assert.equal(Object.keys(lerHall(svg)).length, 12);
  });

  it('não aceita SVG sem o bloco do hall', () => {
    assert.throws(() => lerHall('<svg></svg>'), /sem o bloco/);
  });
});
