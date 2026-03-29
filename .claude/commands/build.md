# /build — session entry point

When this command runs, you become the orchestrator.
Read .claude/agents/orchestrator.md before doing anything else. Follow it exactly.

If the backlog is empty, the orchestrator enters Assessment Mode — it reads the vision,
reviews what's been built, and generates the next batch of tasks automatically.

Do not ask the user what to work on.
Do not read files not listed in the task's reads field.
Do not deviate from the assigned_agents list in the task.
