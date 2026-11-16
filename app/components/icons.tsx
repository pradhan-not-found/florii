type IconName = "arrow" | "copy" | "check" | "github" | "star" | "heart" | "search" | "external" | "download" | "visitors";

const paths: Record<IconName, string> = {
  arrow: "M4 12h15m-6-6 6 6-6 6",
  copy: "M9 8h11v13H9zM15 8V3H4v13h5",
  check: "m5 12 4 4L19 6",
  github: "M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .1-2-.5-2.5 3.5-.4 7-1.7 7-7.5 0-1.5-.5-3-1.5-4 .2-1 .2-2-.2-3-2 0-3 1-4 1a15 15 0 0 0-7 0C7 1 6 1 4 1c-.4 1-.4 2-.2 3-1 1-1.5 2.5-1.5 4 0 5.8 3.5 7.1 7 7.5C8.7 16 9 17 9 18v4",
  star: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z",
  heart: "M12 20s-7-4.4-9-9c-1.3-3 .7-6.5 4-6.5 2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.3 0 5.3 3.5 4 6.5-2 4.6-9 9-9 9Z",
  search: "m16 16 5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  external: "M14 4h6v6m0-6-9 9M10 6H5v13h13v-5",
  download: "M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4",
  visitors: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
};

export function Icon({ name, size = 16, filled = false }: { name: IconName; size?: number; filled?: boolean }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
