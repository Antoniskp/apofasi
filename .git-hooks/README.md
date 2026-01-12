# Git Hooks

This directory contains example git hooks that can help maintain code quality.

## Pre-commit Hook

A pre-commit hook can automatically check your code before committing.

### Installation

1. Make the hook executable:
```bash
chmod +x .git-hooks/pre-commit.example
```

2. Copy to git hooks directory:
```bash
cp .git-hooks/pre-commit.example .git/hooks/pre-commit
```

Or configure git to use this hooks directory:
```bash
git config core.hooksPath .git-hooks
```

### What it does

The pre-commit hook:
- Prevents committing `.env` files
- Runs linters on changed files
- Checks for console.log statements (optional)
- Checks for merge conflict markers

### Bypassing the hook

In exceptional cases, you can bypass the hook:
```bash
git commit --no-verify -m "your message"
```

**Note:** Only bypass when absolutely necessary!
