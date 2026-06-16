import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const required = [
  "NEXT_PUBLIC_TINA_CLIENT_ID",
  "TINA_TOKEN",
  "NEXT_PUBLIC_TINA_BRANCH",
  "NEXT_PUBLIC_SITE_URL",
];

const missing = required.filter((key) => !process.env[key]?.trim());
const skippedReason = process.env.TINA_BUILD_SKIPPED_REASON?.trim() || "";
const outAdminPath = resolve("out", "admin", "index.html");

if (!existsSync(outAdminPath)) {
  console.error("FAIL: out/admin/index.html was not generated.");
  process.exit(1);
}

const html = readFileSync(outAdminPath, "utf8");
const isFallback = html.includes('data-admin-mode="fallback"');

if (missing.length === 0) {
  if (skippedReason === "branch-not-on-tinacloud" || skippedReason === "remote-schema-not-ready") {
    if (!isFallback) {
      console.error("FAIL: Tina build was skipped for a TinaCloud synchronization issue, but fallback admin marker is missing.");
      process.exit(1);
    }

    if (skippedReason === "remote-schema-not-ready") {
      console.warn("WARN: Tina production variables are present, but TinaCloud has not indexed the latest GraphQL schema yet.");
      console.warn("/admin will keep showing the fallback setup page until TinaCloud finishes indexing the current branch.");
    } else {
      console.warn("WARN: Tina production variables are present, but TinaCloud does not recognize the configured branch yet.");
      console.warn("/admin will keep showing the fallback setup page until the branch is available in TinaCloud.");
    }
    process.exit(0);
  }

  if (isFallback) {
    console.error("FAIL: Tina environment variables are complete, but /admin is still the fallback page.");
    console.error("Check whether `tinacms build` actually wrote the admin bundle before `next build`.");
    process.exit(1);
  }

  console.log("PASS: Tina admin built; /admin should open the TinaCloud login flow.");
  process.exit(0);
}

if (!isFallback) {
  console.error("FAIL: Tina environment variables are incomplete, but fallback admin marker is missing.");
  console.error("This means /admin no longer has a predictable setup page.");
  process.exit(1);
}

console.warn("WARN: Tina admin was not built because environment variables are incomplete.");
console.warn("/admin will show the fallback setup page until Tina production variables are configured.");
console.warn("Missing variables:");
for (const key of missing) {
  console.warn(`- ${key}`);
}
