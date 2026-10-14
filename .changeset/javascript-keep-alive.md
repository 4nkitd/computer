---
"@cloudflare/computer": minor
---

`WorkerJavaScriptBackend` now keeps its Durable Object in memory while any execution is running, by scheduling a timer every `keepAliveIntervalMs` (60 seconds by default, `0` turns it off). From compatibility date 2026-10-01, each piece of pending work keeps a Durable Object in memory for up to 15 minutes, so an execution that made no host calls and printed nothing was evicted 15 minutes after it started. With the timer, an execution can run for as long as its timeout allows. Earlier compatibility dates are unaffected and still need the host to keep the object in memory.
