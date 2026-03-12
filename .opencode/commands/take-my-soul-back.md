---
description: Full Soul Mode revert
---

You are running Soul Mode full revert.

WARNING: This will delete all Soul Mode files and remove the scheduler job.

Steps:
1) Delete the scheduler job `soul-heartbeat` if it exists.
2) Remove these files/directories:
   - `.opencode/soul.md`
   - `.opencode/soul/` (entire directory)
   - `.opencode/agents/soul.md`
   - `.opencode/commands/soul-heartbeat.md`
   - `.opencode/commands/soul-status.md`
   - `.opencode/commands/steer-soul.md`
   - `.opencode/commands/take-my-soul-back.md`
3) Revert `opencode.jsonc` changes:
   - Remove `.opencode/soul.md` from `instructions` array
   - Do NOT remove `opencode-scheduler` from plugins (it may be used for other purposes)
4) Confirm exactly what was deleted/changed.

This is reversible - you can rerun the Soul Mode setup to restore.