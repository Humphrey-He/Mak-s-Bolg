const required = [
  "NEXT_PUBLIC_TINA_CLIENT_ID",
  "TINA_TOKEN",
  "NEXT_PUBLIC_TINA_BRANCH",
  "NEXT_PUBLIC_SITE_URL",
];

const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  console.warn("Tina environment variables are incomplete.");
  console.warn("Skipping Tina admin build and continuing with plain Next.js static export.");
  console.warn("Missing variables:");
  for (const key of missing) {
    console.warn(`- ${key}`);
  }
  process.exit(2);
}

console.log("Tina environment variables look complete.");
