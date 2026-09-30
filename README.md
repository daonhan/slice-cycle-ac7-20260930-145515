# Hello CLI

A dependency-free Node.js ESM CLI. Requires Node.js >=20.11.

Run it with no arguments:

```sh
node src/hello.mjs
```

It prints exactly `Hello, world!` followed by one newline to stdout, writes
nothing to stderr, and exits with code 0.

To greet a name, supply exactly `--name NAME`:

```sh
node src/hello.mjs --name 'Ada Lovelace'
```

It prints exactly `Hello, Ada Lovelace!` followed by one LF to stdout, writes
nothing to stderr, and exits with code 0. NAME must contain non-whitespace
content and its raw first character must not be a hyphen (`-`). Accepted names
are preserved verbatim, including surrounding whitespace, Unicode, and
shell-looking text; the CLI never evaluates or executes them. Quote names in
your shell to pass spaces or shell metacharacters literally. For example,
`--name ' Ada '` prints exactly `Hello,  Ada !` followed by one LF.

Every other argument shape writes nothing to stdout, writes exactly
`Usage: node src/hello.mjs [--name NAME]` followed by one LF to stderr, and
exits with code 2. This includes missing or blank names, names beginning with
a raw hyphen, unknown options, positional names, extra arguments, duplicate
`--name` options (even after an empty value), `--name=Ada`, `-n`, `--help`,
and `--`. Invalid input is never echoed in the diagnostic.

Run the syntax check and child-process test without installing dependencies:

```sh
npm run check
npm test
```

The tests check literal stdout, stderr, and exit codes through real CLI child
processes for no arguments, accepted names, and invalid invocations.
See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete local gate and hook setup.
