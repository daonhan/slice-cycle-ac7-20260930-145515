# Repository instructions

- Keep changes focused and preserve unrelated files.
- The default branch is `master`; Codex branches use the `codex/` prefix.
- Implement all product code, tests, and product documentation through Ralph.
- Never hand-edit runtime state. Keep runtime history, logs, credentials, and
  learning records untracked, preserving the runtime exclusions in `.gitignore`.
- Each PR contains one independently reviewed slice.
- Before publication, run the complete gate documented in `CONTRIBUTING.md`:
  `npm run check`, `npm test`, and `git diff --check`.
