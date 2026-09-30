# Contributing

Use Node.js >=20.11. This project has no dependencies and no lockfile;
no dependency installation is needed.

With prek available, install the local pre-push hooks:

```sh
prek install
```

The hooks run `npm run check` and `npm test`. Before publication, run the
complete local gate:

```sh
npm run check
npm test
git diff --check
```

Ordinary CI runs on Ubuntu with Node.js 22 for pushes to `master` and pull
requests. It runs the same syntax check and tests without an installation step.

Keep each change focused and use Ralph to implement product code, tests, and
product documentation. Each PR contains one independently reviewed slice.
Follow [AGENTS.md](AGENTS.md) for repository conventions.
