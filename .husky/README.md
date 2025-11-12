# Husky Git Hooks

This directory contains Git hooks managed by Husky.

## Available Hooks

### pre-push

Runs before pushing to remote repository:

- 📦 Builds the web project
- 🎭 Runs E2E tests

If either check fails, the push is aborted.

## Bypassing Hooks

If you need to bypass the pre-push hook in an emergency:

```bash
git push --no-verify
```

⚠️ Use this sparingly - the hooks are there to maintain code quality!
