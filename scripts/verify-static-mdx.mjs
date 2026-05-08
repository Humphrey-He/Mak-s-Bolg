import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

const checks = [
  {
    name: "next.config.js enables static export",
    pass: () => /output:\s*["']export["']/.test(read("next.config.js"))
  },
  {
    name: "MDX content directory exists",
    pass: () => existsSync(join(root, "content", "posts"))
  },
  {
    name: "blog detail route exists",
    pass: () => existsSync(join(root, "app", "blog", "[slug]", "page.tsx"))
  },
  {
    name: "home page reads blog data from content layer",
    pass: () => read("app/page.tsx").includes("getAllPosts")
  },
  {
    name: "blog page reads blog data from content layer",
    pass: () => read("app/blog/page.tsx").includes("getAllPosts")
  }
];

let failures = 0;

for (const check of checks) {
  if (check.pass()) {
    console.log(`PASS: ${check.name}`);
  } else {
    failures += 1;
    console.error(`FAIL: ${check.name}`);
  }
}

if (failures > 0) {
  process.exitCode = 1;
}
