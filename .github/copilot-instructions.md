# Copilot Repository Instructions

This repository is primarily worked on in VS Code and may use GitHub Copilot plus other AI coding assistants.

## Core priorities
1. Correctness
2. Clarity
3. Maintainability
4. Compatibility with existing code
5. Speed

## Working rules
- Prefer targeted fixes over broad rewrites.
- Preserve behavior unless a behavior change is explicitly requested.
- Follow existing project conventions for HTML, CSS, and JavaScript.
- Keep changes small and easy to review.
- Avoid unnecessary dependencies.

## Validation rules
- Run the most relevant checks available for changed areas.
- If full validation is not possible, state what was and was not validated.
- Call out meaningful regression risks.

## Workflow and docs
- Treat `main` as the clean sync and deploy branch.
- Use short-lived feature branches for normal work.
- Keep canonical docs accurate when behavior or workflow changes.
- Treat `docs/issues/` as historical context unless a task explicitly reopens that workflow.
- Do not treat assistant-generated output as canonical unless reviewed and committed in repo docs.

## Prompt usage
- Use `.github/prompts/*.prompt.md` for task-specific guidance.
- Prefer the most specific reusable prompt before creating a one-off prompt.
- Keep prompt outputs concise, explicit, and implementation-ready.