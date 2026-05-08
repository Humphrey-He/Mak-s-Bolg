import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

const checks = [
  {
    name: "globals.css uses Tailwind v4 import",
    pass: () => read("styles/globals.css").includes('@import "tailwindcss";')
  },
  {
    name: "globals.css no longer uses legacy @tailwind directives",
    pass: () => !/@tailwind\s+(base|components|utilities);/.test(read("styles/globals.css"))
  },
  {
    name: "copy.ts contains repaired Chinese navigation",
    pass: () => {
      const content = read("data/copy.ts");
      return content.includes('label: "首页"') && content.includes('label: "文章"') && content.includes('heroTitle: "书鸿"');
    }
  },
  {
    name: "header keeps mobile navigation and correct site name",
    pass: () => {
      const content = read("components/layout/Header.tsx");
      return content.includes("mobile-nav-scroll") && content.includes("书鸿");
    }
  },
  {
    name: "blog carousel supports touch interaction",
    pass: () => {
      const content = read("components/blog/BlogList.tsx");
      return content.includes("onTouchStart") && content.includes("onTouchEnd");
    }
  },
  {
    name: "message page placeholders are repaired",
    pass: () => {
      const content = read("app/message/page.tsx");
      return content.includes('placeholder="你的称呼"') && content.includes('placeholder="邮箱或联系方式"');
    }
  }
];

let failures = 0;

for (const check of checks) {
  const passed = check.pass();
  if (passed) {
    console.log(`PASS: ${check.name}`);
  } else {
    failures += 1;
    console.error(`FAIL: ${check.name}`);
  }
}

if (failures > 0) {
  process.exitCode = 1;
}
