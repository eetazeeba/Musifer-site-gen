---
name: create-github-future-work-issue
description: 'Create a GitHub issue with gh CLI to track future work. Use when planning backlog items, migration follow-ups, and post-review tasks while enforcing repo-safe body formatting and issue-template alignment.'
argument-hint: 'Issue objective, scope, and preferred issue type (Bug or Polish)'
user-invocable: true
---

# Create GitHub Future Work Issue

Create a trackable GitHub issue for future work using repository-safe gh CLI patterns.

## When to Use
- You need to capture deferred work from implementation or review.
- You need a backlog issue that can be linked from docs, plans, or pull requests.
- You are in a chat-driven shell where multiline --body strings and heredocs are unreliable.

## Inputs
- Issue objective: what future work is being tracked.
- Scope: what is in and out of scope.
- Issue type: Bug or Polish.
- Evidence: links, file paths, screenshots, or test notes.

## Decision Flow
1. Classify the issue.
- If this is a defect or regression, use Bug.
- If this is quality, UX, cleanup, or improvement work, use Polish.
- If uncertain, default to Polish and call out uncertainty in the body.

2. Apply template-safe metadata.
- Bug: title prefix [Bug]: and labels type:bug + needs-triage.
- Polish: title prefix [Polish]: and labels type:polish + needs-triage.
- If canonical labels are missing, keep the title prefix and use the closest available fallback labels. Record the mismatch for later label reconciliation.

3. Build the body with a file-based workflow.
- Prefer --body-file over multiline --body quoting.
- Do not use heredoc input.
- Keep sections aligned with issue-template intent.

4. Create and verify the issue.
- Run gh issue create with title, labels, and --body-file.
- Capture the returned issue URL/number.
- Open the issue in GitHub and verify body completeness and labels.

## Procedure
1. Confirm gh auth and repository context.
```bash
gh auth status
```

2. Build a temporary body file without heredoc.
```bash
printf '%s\n' \
  '## Summary' \
  '- Track: <future work objective>' \
  '' \
  '## Why this matters' \
  '- <impact/risk>' \
  '' \
  '## Scope' \
  '- In scope: <items>' \
  '- Out of scope: <items>' \
  '' \
  '## Acceptance Criteria' \
  '- [ ] <criterion 1>' \
  '- [ ] <criterion 2>' \
  '' \
  '## Context' \
  '- Links: <docs/PR/issues>' \
  '- Evidence: <screenshots/tests/logs>' \
  > /tmp/future-work-issue.md
```

3. Create the issue with template-aligned title and labels.
```bash
gh issue create \
  --title '[Polish]: <short future-work title>' \
  --label 'type:polish' \
  --label 'needs-triage' \
  --body-file /tmp/future-work-issue.md
```

4. If label creation fails, retry with available fallback labels while preserving title prefix.
```bash
gh label list
gh issue create --title '[Polish]: <short future-work title>' --body-file /tmp/future-work-issue.md --label '<closest-fallback>'
```

5. Validate the created issue.
- Confirm issue URL was returned by gh.
- Confirm body sections are present and not truncated.
- Confirm labels and title prefix match intended issue type.
- If labels are non-canonical, note a follow-up to restore label parity.

## Quality Bar
- Body is complete and readable in GitHub UI.
- Issue type is explicit and consistent with title prefix.
- Labels are template-aligned or mismatch is explicitly recorded.
- Acceptance criteria are testable and scoped.

## Common Failures and Fixes
- Issue command hangs: remove heredoc usage and rerun with --body-file.
- Body is cut off: replace multiline --body quoting with --body-file.
- Wrong issue taxonomy: reclassify as Bug or Polish and align prefix + labels.
- Missing labels: use fallback labels now, then open follow-up for label reconciliation.
