# How to undo the last push

## Quickest undo — revert the last commit

This creates a new commit that undoes the last one. Safe for shared history.

```bash
git revert HEAD
git push origin main
```

## Go back to a specific backup tag

Each build cycle creates a backup tag before pushing. To restore to a tag:

```bash
git checkout backup/pre-build-{timestamp}
git checkout -b recovery-branch
git push origin recovery-branch
```

Replace `{timestamp}` with the exact tag name from the build log in IMPROVEMENTS.md.

## List all backup tags

```bash
git tag | grep backup/
```

## Find the tag for a specific build

Look in IMPROVEMENTS.md under `## Done` — each entry includes the backup tag name and timestamp.

## Emergency: discard all local changes and reset to remote

Only use this if local state is broken and you have not pushed the bad state:

```bash
git fetch origin
git reset --hard origin/main
```

**Warning:** This permanently discards any uncommitted local work.

## Check what changed in the last commit

```bash
git show --stat HEAD
```

## Verify remote is in sync

```bash
git status
git log --oneline -5
```
