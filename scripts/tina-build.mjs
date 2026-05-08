import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });

  if (typeof result.status === "number") {
    return result.status;
  }

  return 1;
}

const envStatus = run("node", ["scripts/check-tina-env.mjs"]);

if (envStatus === 0) {
  const tinaStatus = run("npx", ["tinacms", "build"]);
  if (tinaStatus !== 0) {
    process.exit(tinaStatus);
  }
} else if (envStatus !== 2) {
  process.exit(envStatus);
}

const nextStatus = run("npx", ["next", "build"]);
if (nextStatus !== 0) {
  process.exit(nextStatus);
}

const verifyStatus = run("node", ["scripts/verify-tina-admin.mjs"]);
process.exit(verifyStatus);
