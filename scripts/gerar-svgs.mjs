// Gera todos os SVGs de assets/ a partir de scripts/dados.mjs.
// Uso: node scripts/gerar-svgs.mjs

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerHall } from '../.github/scripts/hall.mjs';
import { capa } from './cartoes/capa.mjs';
import { conquistas } from './cartoes/conquistas.mjs';
import { botoes, contatos } from './cartoes/contato.mjs';
import { ctf } from './cartoes/ctf.mjs';
import { ficha } from './cartoes/ficha.mjs';
import { inventario } from './cartoes/inventario.mjs';
import { missoes, missoesSecretas } from './cartoes/missoes.mjs';
import { whoami } from './cartoes/whoami.mjs';

const ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const CAMINHO_CTF = join(ASSETS, 'ctf.svg');

/** Quem já entrou no hall da fama continua lá quando os SVGs são gerados de novo. */
const hallAtual = () => (existsSync(CAMINHO_CTF) ? lerHall(readFileSync(CAMINHO_CTF, 'utf8')) : {});

const arquivos = [
  ['capa', capa()],
  ['whoami', whoami()],
  ['ficha', ficha()],
  ...missoes(),
  ['missoes-secretas', missoesSecretas()],
  ['ctf', ctf(hallAtual())],
  ['inventario', inventario()],
  ['conquistas', conquistas()],
  ...contatos(),
  ...botoes(),
];

mkdirSync(ASSETS, { recursive: true });
for (const [nome, conteudo] of arquivos) writeFileSync(join(ASSETS, `${nome}.svg`), conteudo);
console.log(`${arquivos.length} SVGs gerados em assets/`);
