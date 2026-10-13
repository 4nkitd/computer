---
"@cloudflare/computer": patch
---

`WorkerJavaScriptBackend` now lazily reads each host module's description; see [module documentation](https://github.com/cloudflare/computer/blob/main/docs/17_isolate_javascript.md#modules).
