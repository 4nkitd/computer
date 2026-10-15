// Workerd test harness for WorkspaceProxy.
//
// Three exports in one worker:
//
//   - WorkspaceProxy — the class under test, re-exported so the
//     runtime can wrap it into a loopback WorkerEntrypoint that
//     ctx.exports can call.
//   - TestStorageDO — a Durable Object whose fetch() answers /api
//     with a stable marker so the test can verify routing landed.
//   - TestDriver (default export) — a tiny WorkerEntrypoint whose
//     fetch() reads `x-test-binding` and `x-test-id` from the
//     incoming request, constructs a WorkspaceProxy stub via
//     ctx.exports.WorkspaceProxy({ props }), and forwards the
//     request. Lets the test fix props per-call without standing
//     up a fresh worker per case.

import { DurableObject, WorkerEntrypoint } from "cloudflare:workers";

export { WorkspaceProxy } from "../src/proxy.js";

export interface Env {
  COMPUTERD: DurableObjectNamespace;
}

export class TestStorageDO extends DurableObject<Env> {
  override async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const egressToken = request.headers.get("x-workspace-egress-token");
    if (url.pathname === "/api" && egressToken !== null) {
      return Response.json({
        callbackUrl: request.url,
        originalUrl: request.headers.get("x-workspace-egress-url"),
        egressToken,
        method: request.method,
        body: await request.text(),
      });
    }
    if (url.pathname === "/api") {
      if (url.searchParams.has("token")) {
        return new Response(`from-do:${url.searchParams.get("token")}`, { status: 200 });
      }
      if (this.ctx.id.name !== undefined) {
        return new Response(`from-do:${this.ctx.id.name}`, { status: 200 });
      }
      return new Response("from-do", { status: 200 });
    }
    if (egressToken !== null) {
      return Response.json({
        callbackUrl: request.url,
        originalUrl: request.headers.get("x-workspace-egress-url"),
        egressToken,
        method: request.method,
        body: await request.text(),
      });
    }
    return new Response("DO unknown path", { status: 404 });
  }
}

export default class TestDriver extends WorkerEntrypoint<Env> {
  override async fetch(request: Request): Promise<Response> {
    const binding = request.headers.get("x-test-binding") ?? "COMPUTERD";
    const id = request.headers.get("x-test-id") ?? "";
    const name = request.headers.get("x-test-name") ?? undefined;
    const egressToken = request.headers.get("x-test-egress-token") ?? undefined;
    // oxlint-disable-next-line typescript/no-explicit-any -- ctx.exports isn't in @cloudflare/workers-types yet
    const proxy = (this.ctx as any).exports.WorkspaceProxy({
      props: { binding, id, name, egressToken },
    });
    return proxy.fetch(request);
  }
}
