import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const cliPath = fileURLToPath(new URL('../src/hello.mjs', import.meta.url));

test('CLI greets the world with no arguments and exits successfully', () => {
  const result = spawnSync(process.execPath, [cliPath], { encoding: 'utf8' });

  assert.ifError(result.error);
  assert.deepEqual(
    { stdout: result.stdout, stderr: result.stderr, exitCode: result.status },
    { stdout: 'Hello, world!\n', stderr: '', exitCode: 0 },
  );
});

const namedCases = [
  ['simple name', ['--name', 'Ada'], 'Hello, Ada!\n'],
  ['name with spaces', ['--name', 'Ada Lovelace'], 'Hello, Ada Lovelace!\n'],
  ['Unicode name', ['--name', 'Đào'], 'Hello, Đào!\n'],
  ['surrounding whitespace', ['--name', ' Ada '], 'Hello,  Ada !\n'],
  ['shell-looking text', ['--name', '$(echo injected)'], 'Hello, $(echo injected)!\n'],
];

for (const [description, args, stdout] of namedCases) {
  test(`CLI greets a ${description} literally and exits successfully`, () => {
    const result = spawnSync(process.execPath, [cliPath, ...args], { encoding: 'utf8' });

    assert.ifError(result.error);
    assert.deepEqual(
      { stdout: result.stdout, stderr: result.stderr, exitCode: result.status },
      { stdout, stderr: '', exitCode: 0 },
    );
  });
}

const invalidCases = [
  ['missing name', ['--name']],
  ['empty name', ['--name', '']],
  ['whitespace-only name', ['--name', '   ']],
  ['option-looking name', ['--name', '--other']],
  ['name beginning with a raw hyphen', ['--name', '-Ada']],
  ['unknown option', ['--other']],
  ['positional name', ['Ada']],
  ['extra argument', ['--name', 'Ada', 'extra']],
  ['duplicate name option', ['--name', 'Ada', '--name', 'Bob']],
  ['duplicate name option after an empty value', ['--name', '', '--name', 'Ada']],
  ['equals syntax', ['--name=Ada']],
  ['short option', ['-n', 'Ada']],
  ['help option', ['--help']],
  ['option terminator', ['--']],
];

for (const [description, args] of invalidCases) {
  test(`CLI rejects ${description} with the fixed usage diagnostic and exit 2`, () => {
    const result = spawnSync(process.execPath, [cliPath, ...args], { encoding: 'utf8' });

    assert.ifError(result.error);
    assert.deepEqual(
      { stdout: result.stdout, stderr: result.stderr, exitCode: result.status },
      { stdout: '', stderr: 'Usage: node src/hello.mjs [--name NAME]\n', exitCode: 2 },
    );
  });
}
