# PRD: Named greeting with deterministic argument errors

## Problem Statement

The CLI always greets the world, even when a caller supplies a name or malformed arguments. Callers need a literal named greeting and a predictable failure contract while retaining the existing no-argument behavior.

## Solution

Accept no arguments, or exactly two arguments: `--name` followed by NAME. An accepted NAME contains at least one non-whitespace character and does not begin with a raw hyphen. Preserve the accepted argument verbatim, including surrounding whitespace. Every other argument shape fails with one fixed usage diagnostic.

## User Stories

1. As a caller, I want the existing no-argument greeting to remain unchanged so current invocations keep working.
2. As a caller, I want to supply a name so the CLI greets that name.
3. As a caller, I want spaces, Unicode, and shell-looking text preserved literally so my name is not transformed or executed.
4. As a caller, I want malformed arguments to fail consistently so scripts can distinguish success from usage errors.
5. As a reader, I want usage and error behavior documented so I can invoke the CLI correctly.

## Implementation Decisions

- Retain the dependency-free Node.js ESM executable and its existing public command boundary.
- The only accepted nonempty argument form is `--name NAME`; no aliases, equals syntax, positional name, or help/version form.
- NAME is checked for non-whitespace content without normalizing the emitted value. The leading-hyphen check applies to the raw first character, not a trimmed copy.
- Success writes exactly the greeting below followed by LF to stdout, writes nothing to stderr, and exits 0.
- Failure writes no stdout, writes exactly `Usage: node src/hello.mjs [--name NAME]` followed by LF to stderr, and exits 2. Use the same diagnostic for every invalid shape and do not echo invalid arguments.
- Parse the complete invocation before printing a greeting. Duplicate options and extra arguments are failures, even if an earlier name was empty.
- Treat NAME as data; no evaluation, shell invocation, network, persistence, or subprocess based on its contents.
- Keep implementation choices small; no prerequisite refactor or new dependencies are needed.

## Testing Decisions

Use the established real child-process seam. Pass arguments as an array to the current Node executable running the CLI; assert literal stdout, stderr, and exit status, with launch errors surfaced. Keep the original no-argument test. Do not test source layout or private parser functions, and do not derive expected values from implementation constants.

Each successful greeting in this table has one terminating LF; quotes show argument boundaries and are not supplied as characters. Blank stderr means the empty string. Every failure has the fixed usage diagnostic above plus LF, empty stdout, and exit 2.

### Child-process contract matrix

| Arguments | Expected stdout before terminating LF | stderr | Exit |
|---|---|---|---|
| none | `Hello, world!` | empty | 0 |
| `--name`, `Ada` | `Hello, Ada!` | empty | 0 |
| `--name`, `Ada Lovelace` | `Hello, Ada Lovelace!` | empty | 0 |
| `--name`, `Đào` | `Hello, Đào!` | empty | 0 |
| `--name`, ` Ada ` | `Hello,  Ada !` | empty | 0 |
| `--name`, `$(echo injected)` | `Hello, $(echo injected)!` | empty | 0 |
| `--name` | empty | fixed usage plus LF | 2 |
| `--name`, empty string | empty | fixed usage plus LF | 2 |
| `--name`, three spaces | empty | fixed usage plus LF | 2 |
| `--name`, `--other` | empty | fixed usage plus LF | 2 |
| `--name`, `-Ada` | empty | fixed usage plus LF | 2 |
| `--other` | empty | fixed usage plus LF | 2 |
| `Ada` | empty | fixed usage plus LF | 2 |
| `--name`, `Ada`, `extra` | empty | fixed usage plus LF | 2 |
| `--name`, `Ada`, `--name`, `Bob` | empty | fixed usage plus LF | 2 |
| `--name`, empty string, `--name`, `Ada` | empty | fixed usage plus LF | 2 |
| `--name=Ada` | empty | fixed usage plus LF | 2 |
| `-n`, `Ada` | empty | fixed usage plus LF | 2 |
| `--help` | empty | fixed usage plus LF | 2 |
| `--` | empty | fixed usage plus LF | 2 |

The new named and invalid-input cases must demonstrate red before the CLI behavior changes and green afterward. A test that trims NAME must fail the surrounding-whitespace row. The no-argument case is the compatibility control and already passes on the baseline.

## Out of Scope

Aliases, help/version, equals syntax, positional names, environment defaults, installable packaging, parser frameworks, dependencies, normalization, execution of input, unrelated cleanup, CI expansion, and changes to runtime exclusions or hooks.

## Dependencies, Risks, and Rollback

The executable, existing child-process test, ready label, and ordinary Ubuntu/Node.js 22 CI are present. There is no persisted state or migration. The intentional compatibility change is rejection of previously ignored nonempty invocations. Revert the slice's merged change to restore the fixed greeting, original test contract, and README; no data rollback is needed.

## Further Notes

Baseline inspection and real CLI probes showed that no arguments, `--name Ada`, `--name`, and `--other` all produced the fixed greeting, empty stderr, and exit 0. The syntax check, existing test, and whitespace gate passed. No previous PRD or plan covers this work.

### Plan-adversary review

Pass 1 verdict: go. Effective verdict: go. Critical: none. New failure mode: none. Route: separate read-only Codex app review bridge, with a same-vendor deviation. The reviewer ran outside the planning session's context.

Folded warning: add the ` Ada ` child-process row to catch accidental trimming. Verified reasoning: this argument contains non-whitespace content and has no raw leading hyphen, so the selected grammar accepts it; the original no-argument test does not guard literal whitespace preservation. Expected stdout is exactly `Hello,  Ada !` plus LF, empty stderr, exit 0. No second pass is required.

Ralph owns product implementation, tests, and README updates. One bounded workload with at most two iterations is available; no further repair workload is authorized. Targeted verification must run in the foreground. Independent code, security, and documentation passes precede publication; the full repository gate and ordinary CI precede merge.
