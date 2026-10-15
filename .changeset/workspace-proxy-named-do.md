---
"@cloudflare/computer": patch
---

Preserve Durable Object `ctx.id.name` on cold wakes through `WorkspaceProxy` and `WorkspaceServiceProxy` when `name` is supplied on `WorkspaceRef` / proxy props.
