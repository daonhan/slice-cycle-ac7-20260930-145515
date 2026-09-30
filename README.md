# Hello CLI

A dependency-free Node.js ESM CLI. Requires Node.js >=20.11.

Run it with no arguments:

```sh
node src/hello.mjs
```

It prints exactly `Hello, world!` followed by one newline to stdout, writes
nothing to stderr, and exits with code 0.

Run the syntax check and child-process test without installing dependencies:

```sh
npm run check
npm test
```

The test checks stdout, stderr, and the exit code of the no-argument CLI.
See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete local gate and hook setup.
