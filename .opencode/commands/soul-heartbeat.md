---
description: Soul Mode heartbeat (non-interactive)
agent: soul
---

You are running Soul Mode heartbeat.

Constraints:
- Non-interactive: do not ask questions.
- Safe: no destructive actions.

Steps:
1) Get workspace path using `echo %CD%` (Windows) or `pwd` (Unix).
2) Read .opencode/soul.md (must read before any write).
3) Read .opencode/soul/heartbeat.jsonl (must read before append).
4) Read AGENTS.md and _repos/openwork/AGENTS.md if they exist.
5) Try to find opencode.db in the workspace or parent directories.
6) Query sqlite if available: recent sessions, open todos, recent transcripts. If db unavailable, continue in degraded mode.
7) Generate concise check-in output:
   - Summary (1 sentence)
   - Loose ends (1-3 bullets)
   - Next action (1 bullet)
   - Improvements (2-3 bullets)
8) Append one JSON line to .opencode/soul/heartbeat.jsonl:
   Use bash with: echo {"ts":"ISO timestamp","workspace":"path","summary":"...","loose_ends":["..."],"next_action":"..."} >> .opencode/soul/heartbeat.jsonl