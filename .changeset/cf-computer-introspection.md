---
"@cloudflare/computer": minor
---

JavaScript backend code can import `cf:computer` for each module's TypeScript declarations, and `console.log` prints a host export's declaration. Configured modules can no longer use `cf:*` specifiers, and `ws:git` rejects calls that pass anything other than one options object; see [`cf:computer`](https://github.com/cloudflare/computer/blob/main/docs/17_isolate_javascript.md#cfcomputer).
