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
