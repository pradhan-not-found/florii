import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { NextRequest, NextResponse } from "next/server.js";

// Load the route with a Redis double so tests never touch production data.
const calls = [];
let configured = true;
let unavailable = false;
const redis = {
  pfcount: async () => { if (unavailable) throw new Error("offline"); return 42; },
  eval: async (...args) => { calls.push(args); return 1; },
};
const source = ts.transpileModule(readFileSync(new URL("../app/api/visitors/route.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exports = {};
vm.runInNewContext(source, {
  exports,
  require: name => {
    if (name === "next/server") return { NextRequest, NextResponse };
    if (name === "@/lib/analytics") return {
      analyticsKey: "florii:analytics", analyticsRedis: () => configured ? redis : null,
      recordVisit: "atomic-script", retentionSeconds: 7776000,
    };
    throw new Error(`Unexpected import: ${name}`);
  },
});
const visitorId = "12345678-1234-4123-8123-123456789012";
const eventId = "12345678-1234-4123-8123-123456789013";
const request = (body = JSON.stringify({ visitorId, eventId }), headers = {}) => new NextRequest("https://florii.test/api/visitors", {
  method: "POST", headers: { origin: "https://florii.test", "content-type": "application/json", ...headers }, body,
});

assert.equal((await exports.POST(request(undefined, { origin: "https://other.test" }))).status, 403);
assert.equal((await exports.POST(request(undefined, { "content-type": "text/plain" }))).status, 415);
assert.equal((await exports.POST(request("{"))).status, 400);
assert.equal((await exports.POST(request("null"))).status, 400);
assert.equal((await exports.POST(request(JSON.stringify({ visitorId: [visitorId], eventId })))).status, 400);
assert.equal((await exports.POST(request("x".repeat(513)))).status, 413);
assert.equal((await exports.POST(request(undefined, { dnt: "1" }))).status, 204);
assert.equal((await exports.POST(request(undefined, { "sec-gpc": "1" }))).status, 204);
assert.equal(calls.length, 0, "Rejected and opted-out requests never write to Redis");

configured = false;
assert.equal((await exports.GET()).status, 503);
assert.equal((await exports.POST(request())).status, 503);
configured = true;
const result = await exports.POST(request());
assert.deepEqual(await result.json(), { count: 42 });
assert.equal(result.headers.get("cache-control"), "no-store");
assert.equal(calls.length, 1);
assert.equal(calls[0][1][0], `florii:analytics:event:${eventId}`);
assert.equal(calls[0][1][3], `florii:analytics:${new Date().toISOString().slice(0, 10)}:views`);
assert.equal(calls[0][2][0], visitorId);
assert.equal(calls[0][2][1], 7776000);
assert.deepEqual(await (await exports.GET()).json(), { count: 42 });
unavailable = true;
assert.equal((await exports.GET()).status, 503);
assert.equal((await exports.POST(request())).status, 503);
console.log("Visitor API checks passed (validation, privacy signals, missing configuration, Redis arguments, outage handling). Redis is mocked; live writes require credentials.");
