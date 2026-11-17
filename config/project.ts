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

/** The repository is this checkout's origin; other integrations are optional. */
export const projectLinks = {
  github: externalUrl(process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/pradhan-not-found/florii"),
  sponsor: externalUrl(process.env.NEXT_PUBLIC_SPONSOR_URL),
  coffee: externalUrl(process.env.NEXT_PUBLIC_COFFEE_URL),
  x: externalUrl(process.env.NEXT_PUBLIC_X_URL),
  npm: "https://www.npmjs.com/package/florii",
};

/** "owner/repo" parsed from the GitHub URL, used to read the public star count. */
export function githubRepo(): string {
  const match = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/.exec(projectLinks.github);
  return match ? match[1] + "/" + match[2] : "";
}
