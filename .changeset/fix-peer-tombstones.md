---
"@cloudflare/dofs": patch
"@cloudflare/computer-rpc": patch
---

Deletes made in the container now reach the Durable Object, and pushed deletes reach computerd; see [replay and idempotency documentation](https://github.com/cloudflare/computer/blob/main/docs/02_sync_protocol.md#replay-and-idempotency).
