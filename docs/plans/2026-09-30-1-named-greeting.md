# Plan: Named greeting with deterministic argument errors

> Source PRD: [Named greeting](../prds/2026-09-30-1-named-greeting.md)

Approved work item: [Issue #2](https://github.com/daonhan/slice-cycle-ac7-20260930-145515/issues/2), the single ready issue for phase 1. No blockers or additional implementation issues.

## Architectural decisions

- Retain the existing dependency-free Node.js ESM CLI and real child-process test boundary.
- Accept zero arguments, or exactly `--name NAME` with non-whitespace content and no raw leading hyphen. Validate without changing accepted NAME.
- Success has literal greeting stdout plus LF, empty stderr, exit 0. Invalid arguments have empty stdout, the PRD's exact usage diagnostic plus LF on stderr, exit 2.
- Read the complete invocation before emitting success. NAME is data and is never executed.
- No persistence, migrations, external integrations, secrets, or new configuration are required.

## Scope and baseline

The current executable prints the fixed greeting regardless of arguments. The current child-process test proves only no-argument compatibility. The source PRD supplies the sole product requirements and the complete acceptance matrix.

Ralph implements all changes to `src/hello.mjs`, `tests/hello.test.mjs`, and `README.md`. Preserve package scripts, CI, repository instructions, hooks, runtime exclusions, and unrelated files. There is no prerequisite prefactor. This entire plan is one independently shippable issue and one PR.

## Phase 1: Ship the complete named greeting contract

**User stories:** PRD stories 1-5.

### What to build

Deliver the named greeting and all deterministic argument failures together with real child-process regression coverage and README usage/error documentation.

1. Extend the existing child-process test boundary with the PRD's complete matrix while preserving the original no-argument test. Surface process launch errors. Run `node --test tests/hello.test.mjs` in the foreground before changing CLI behavior, recording the new cases' red result and the compatibility control's green result in the work report. Do not commit a red tree.
2. Implement the public contract and re-run `node --test tests/hello.test.mjs` and `node --check src/hello.mjs` in the foreground. All matrix rows must be green. Expected values are literals, never imported parser outputs or shared implementation constants.
3. Update README in the same change: retain no-argument usage, add named usage, preserve accepted NAME literally, and document the exact generic diagnostic and exit 2 for every invalid argument shape. Ralph's reviewer gives documentation its own pass against implementation and tests. Commit the complete green slice; record commands, exits, red/green evidence, and any handover gaps.

### Acceptance criteria

- [ ] Preserve the original no-argument child-process test and exact greeting contract.
- [ ] Pass every row of the source PRD's child-process contract matrix, including ` Ada ` producing exactly `Hello,  Ada !` plus LF.
- [ ] Demonstrate real new-behavior red/green evidence through the CLI process boundary.
- [ ] Reject missing, blank, option-looking, duplicate, unknown, extra, and unsupported forms with the single exact diagnostic, empty stdout, and exit 2.
- [ ] Preserve accepted NAME without evaluation or normalization.
- [ ] Document the implemented invocation and error contracts in README.
- [ ] Targeted child-process tests and syntax checking pass before the implementation commit; no source-layout or private-seam tests.

## Verification and publication boundaries

BUILD uses `node --test tests/hello.test.mjs` and `node --check src/hello.mjs`. Run them synchronously in the foreground; do not yield on a background gate or leave the finished draft uncommitted.

REVIEW owns the complete gate from CONTRIBUTING: `npm run check`, `npm test`, and `git diff --check`. It also verifies the complete diff, separate independent code/security/docs reports, current issue state, and ordinary Ubuntu/Node.js 22 PR CI. BUILD runs no REVIEW-owned mutation or external probe.

Planning itself contains only this PRD and plan. One scoped ready issue authorizes the complete slice. One bounded Ralph workload has at most two iterations, including its queue-derived spare. A failure needing an additional workload or product repair is a stop for the coordinator, not authorization to extend BUILD. Public artifacts contain no private machine paths, model identifiers, or private execution logs.

## Rollback and owner checklist

Revert the complete merged slice to restore the original CLI, test contract, and README. No migration or feature flag is required. No product setup or owner dashboard action is needed. The coordinator supplies independent reviews and handles publication after the gate clears. No unresolved product decision blocks this plan.
