const required = [
  "NEXT_PUBLIC_TINA_CLIENT_ID",
  "TINA_TOKEN",
  "NEXT_PUBLIC_TINA_BRANCH",
  "NEXT_PUBLIC_SITE_URL",
];

const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  console.error("Missing Tina environment variables:");
  for (const key of missing) {
    console.error(`- ${key}`);
  }
  console.error("");
  console.error("Create .env.local for local Tina builds, or configure these in Cloudflare Pages.");
  process.exit(1);
}

console.log("Tina environment variables look complete.");
