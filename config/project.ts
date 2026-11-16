/** Only configured, absolute HTTPS URLs become actionable external links. */
function externalUrl(value: string | undefined): string {
  if (!value?.trim()) return "";
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password) return "";
    return url.href;
  } catch {
    return "";
  }
}

/** Leave these environment variables unset until the owner supplies real links. */
export const projectLinks = {
  github: externalUrl(process.env.NEXT_PUBLIC_GITHUB_URL),
  sponsor: externalUrl(process.env.NEXT_PUBLIC_SPONSOR_URL),
  /** Optional JSON endpoint that returns the visitor total, e.g. { "count": 9086 }. */
  visitorCounter: externalUrl(process.env.NEXT_PUBLIC_VISITOR_COUNTER_URL),
  coffee: externalUrl(process.env.NEXT_PUBLIC_COFFEE_URL),
  x: externalUrl(process.env.NEXT_PUBLIC_X_URL),
  npm: "https://www.npmjs.com/package/florii",
};

/** "owner/repo" parsed from the GitHub URL, used to read the public star count. */
export function githubRepo(): string {
  const match = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/.exec(projectLinks.github);
  return match ? match[1] + "/" + match[2] : "";
}
