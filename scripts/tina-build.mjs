import { spawnSync } from "node:child_process";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    shell: process.platform === "win32",
    env: options.env ?? process.env,
    stdio: options.capture ? "pipe" : "inherit",
    encoding: options.capture ? "utf8" : undefined,
  });

  if (options.capture) {
    if (result.stdout) {
      process.stdout.write(result.stdout);
    }
    if (result.stderr) {
      process.stderr.write(result.stderr);
    }
  }

  return {
    status: typeof result.status === "number" ? result.status : 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function isRecoverableTinaFailure(output) {
  return [
    "Branch is not on TinaCloud",
    "is not on TinaCloud",
    "Please make sure that branch",
    "The local GraphQL schema doesn't match the remote GraphQL schema",
    "The local GraphQL schema does not match the remote GraphQL schema",
    "Please push up your changes to GitHub to update your remote GraphQL schema",
  ].some((needle) => output.includes(needle));
}

function getSkippedReason(output) {
  if (output.includes("remote GraphQL schema")) {
    return "remote-schema-not-ready";
  }

  return "branch-not-on-tinacloud";
}

let buildEnv = { ...process.env };

const envResult = run("node", ["scripts/check-tina-env.mjs"], { env: buildEnv });

if (envResult.status === 0) {
  const tinaResult = run("npx", ["tinacms", "build"], { env: buildEnv, capture: true });

  if (tinaResult.status !== 0) {
    const tinaOutput = `${tinaResult.stdout}\n${tinaResult.stderr}`;
    if (isRecoverableTinaFailure(tinaOutput)) {
      console.warn("WARN: Tina build failed because TinaCloud branch/schema synchronization is not ready.");
      console.warn("Falling back to plain Next.js static export so the public site can continue deploying.");
      buildEnv = {
        ...buildEnv,
        TINA_BUILD_SKIPPED_REASON: getSkippedReason(tinaOutput),
      };
    } else {
      process.exit(tinaResult.status);
    }
  }
} else if (envResult.status === 2) {
  buildEnv = {
    ...buildEnv,
    TINA_BUILD_SKIPPED_REASON: "missing-env",
  };
} else {
  process.exit(envResult.status);
}

const nextResult = run("npx", ["next", "build"], { env: buildEnv });
if (nextResult.status !== 0) {
  process.exit(nextResult.status);
}

const verifyResult = run("node", ["scripts/verify-tina-admin.mjs"], { env: buildEnv });
process.exit(verifyResult.status);
