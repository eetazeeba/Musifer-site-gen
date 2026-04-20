# Bugfix

Task: Fix [bug name]

Goal:
Resolve [specific bug] without changing intended behavior elsewhere.

Current issue:
[What is happening]
[What should happen instead]

Files to inspect first:
- [path]
- [path]

Scope:
- In scope: targeted fix and minimal nearby support changes.
- Out of scope: unrelated cleanup and broad refactors.

Constraints:
- Keep the fix small and reliable.
- Preserve structure and naming when reasonable.
- Avoid side-effect changes outside the bug path.

Validation:
- Verify the bug no longer reproduces.
- Verify adjacent behavior still works.

Report back with:
- root cause
- files changed
- validation performed
- remaining risks