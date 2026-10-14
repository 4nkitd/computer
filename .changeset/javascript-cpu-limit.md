---
"@cloudflare/computer": minor
---

`WorkerJavaScriptBackend` takes a `maxCpuMs` option. Each execution's CPU limit is now the smaller of its timeout and `maxCpuMs`, instead of always being the timeout, so a long timeout no longer asks for the same amount of CPU. It defaults to `maxTimeoutMs`, which keeps the previous behavior.
