---
name: improve
description: /improve — any agent can create, modify, and eval skills to benchmark and improve agent workflow quality
---

# /improve — Agent Skill Improvement System

Any agent (or the orchestrator on behalf of agents) can use this skill to create new skills, refine existing ones, and run evals to measure improvement.

---

## Step 1 — Identify improvement opportunity

Choose one of these entry points:

### A) Agent self-improvement (called by an agent after finishing a task)
Read the agent's own definition at `.claude/agents/{agent-name}.md` and any skills it already uses.
Identify patterns from the just-completed task:
- Repeated decisions that could be codified
- Mistakes that required retries
- Domain knowledge that had to be re-derived

### B) Orchestrator-triggered (called by orchestrator reviewing pipeline results)
Read `.claude/handoffs/` outputs from the last completed task.
Identify cross-agent patterns:
- Reviewer repeatedly flagging the same issue
- Tester failing on the same category of bug
- Content agents missing the same pedagogical rule

### C) User-triggered (/improve {agent-name} or /improve {skill-name})
User specifies which agent or skill to improve. Read the relevant files and ask the user what to improve.

### D) Token drift audit (run automatically after every 3 completed tasks, alongside C if user-triggered)

Token waste accumulates silently — no handoff file reports it. This audit catches drift before it compounds.

**Run these checks in order:**

**1. Handoff file size check**
Read all files currently in `.claude/handoffs/`. For each, count words and compare against the limits in CLAUDE-AGENTS.md:
- research-brief.md: max 400 words
- architecture-spec.md: max 600 words
- design-spec.md: max 400 words
- dialogue-draft.md: max 800 words per location
- All review/report files: max 200 words

Flag any file exceeding its limit. If a file is >20% over limit, update the agent that writes it: add a tighter word-count instruction to its definition.

**2. Index-file reference drift check**
Grep all files in `.claude/agents/` for references to `STORY.md`, `WORLD.md`, or `curriculum-map.md` as content sources (not as index explanations).
Pattern to catch: any line instructing an agent to *read* or *grep* these files for content.
Flag each match with the file and line. For each flagged match, update the agent definition to use the correct split file (`STORY-core.md`, `STORY-location-X.md`, `WORLD-location-X.md`, `curriculum-location-X.md`).

**3. New large file check**
Check git log for files added in the last 3 tasks (use `git diff --name-only HEAD~3`).
For any new `.md` file in the root or `.claude/` that exceeds 400 words: check if it will be read by multiple agents or across multiple tasks. If yes, flag it as a split candidate and apply the Token optimisation policy checklist from CLAUDE-AGENTS.md.

**4. Deprecated agent reference check**
Grep all files in `.claude/agents/`, `.claude/skills/`, and root `CLAUDE-*.md` for `dialogue-writer`.
Any match that isn't the deprecation notice in `dialogue-writer.md` itself is a stale reference — fix it.

**Report format for D:**
```
## Token drift audit — {date}
- Handoff sizes: {X files checked, Y over limit}
- Index-file drift: {X references found, Y fixed}
- New large files: {X files checked, Y flagged}
- Deprecated refs: {X found, Y fixed}
Action taken: {list of agent definitions updated, or "none needed"}
```

If no issues found: write "Token drift audit: CLEAN — {date}" to the improvement log and skip to Step 8.

---

## Step 2 — Decide: new skill or update existing

Search `.claude/skills/` for existing skills that cover the identified pattern.

- **If a matching skill exists** → read it, plan the update, go to Step 3.
- **If no matching skill** → draft a new skill, go to Step 3.

### Skill file structure

Every skill lives at `.claude/skills/{skill-name}/SKILL.md` with this format:

```markdown
---
name: {skill-name}
description: {one-line — when this skill should auto-invoke or be called}
---

# {Skill Title}

## When to apply
{Conditions that trigger this skill}

## Rules
{Numbered list of concrete, testable rules}

## Examples
{Before/after pairs showing the skill applied correctly}

## Anti-patterns
{What NOT to do — common mistakes this skill prevents}
```

---

## Step 3 — Write or update the skill

### For new skills:
1. Write the skill file to `.claude/skills/{skill-name}/SKILL.md`
2. Add the skill's `description` to `.claude/settings.local.json` under `skills` if it needs auto-invocation

### For existing skills:
1. Read the current skill file
2. Edit only the sections that need improvement
3. Preserve existing rules that are still valid
4. Add new rules with a `[added {date}]` tag in a comment

---

## Step 4 — Write eval cases

Every skill must have eval cases. Write them to `.claude/skills/{skill-name}/evals.md`:

```markdown
# Evals for {skill-name}

## Eval 1: {short description}
**Input:** {the scenario or file state before the skill is applied}
**Expected:** {what a correct application of the skill produces}
**Checks:** {specific assertions — line exists, pattern matches, value equals}

## Eval 2: ...
```

### Eval guidelines:
- Minimum 3 evals per skill (happy path, edge case, anti-pattern detection)
- Each eval must be independently verifiable by grep/read/diff
- Evals test the SKILL's rules, not general code quality
- Include at least one eval that tests the anti-pattern section

---

## Step 5 — Run evals (benchmark)

For each eval case:
1. Set up the input state (read the described file or create a temp scenario)
2. Apply the skill's rules to the input
3. Check each assertion in `Checks:`
4. Record PASS or FAIL with details

Write results to `.claude/skills/{skill-name}/eval-results.md`:

```markdown
# Eval Results — {skill-name} — {date}

| Eval | Result | Notes |
|---|---|---|
| Eval 1 | PASS | — |
| Eval 2 | FAIL | Rule 3 not applied to edge case |
| Eval 3 | PASS | Anti-pattern correctly caught |

**Score: 2/3 (67%)**

## Action items
- [ ] Update Rule 3 to cover {edge case}
```

---

## Step 6 — Iterate if score < 100%

If any eval fails:
1. Update the skill rules to address the failure
2. Re-run only the failed evals
3. Update eval-results.md
4. Repeat until all evals pass or you've made 3 attempts

After 3 attempts with remaining failures → flag to user with the specific failing evals.

---

## Step 7 — Update agent definition (optional)

If the new/updated skill should be referenced by a specific agent:
1. Read `.claude/agents/{agent-name}.md`
2. Add a line in the agent's instructions referencing the skill:
   `Read and apply .claude/skills/{skill-name}/SKILL.md before {relevant action}.`
3. Only add this reference if the skill is agent-specific. Generic skills (like pedagogy) don't need per-agent references.

---

## Step 8 — Log the improvement

Append to `.claude/skills/improvement-log.md`:

```
## {date} — {skill-name}
- **Action:** {created | updated}
- **Triggered by:** {agent-name | orchestrator | user}
- **Reason:** {one line}
- **Eval score:** {X/Y (Z%)}
- **Agents affected:** {list}
```

---

## What you never do

- Delete an existing skill without user confirmation
- Add rules that contradict CLAUDE-RULES.md or CLAUDE-STACK.md
- Create skills for one-time fixes (use the fixer agent instead)
- Skip writing evals — every skill must be testable
- Modify agent definitions without reading them first
- Create skills that duplicate what's already in scoped CLAUDE-*.md files
