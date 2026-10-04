import type { SVGProps } from "react";

/**
 * A deliberately small icon set. Icons appear only where they carry meaning:
 * leaving the site, downloading a file, copying, theme, menu.
 */

type IconName =
  | "external"
  | "download"
  | "copy"
  | "check"
  | "mail"
  | "github"
  | "linkedin"
  | "sun"
  | "moon"
  | "menu"
  | "close"
  | "printer"
  | "spinner"
  | "alert";

const paths: Record<IconName, React.ReactNode> = {
  external: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M5 19.5h14" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2.2" />
      <path d="M15.5 8.5V6.2a2 2 0 0 0-2-2h-7.3a2 2 0 0 0-2 2v7.3a2 2 0 0 0 2 2h2.3" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </>
  ),
  github: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.47.09.65-.2.65-.46v-1.6c-2.64.57-3.2-1.27-3.2-1.27-.43-1.1-1.06-1.39-1.06-1.39-.86-.59.07-.58.07-.58.95.07 1.45.98 1.45.98.85 1.45 2.22 1.03 2.76.79.09-.62.33-1.03.6-1.27-2.11-.24-4.33-1.06-4.33-4.7 0-1.04.37-1.89.98-2.55-.1-.24-.42-1.21.09-2.52 0 0 .8-.26 2.61.97a9.05 9.05 0 0 1 4.75 0c1.81-1.23 2.61-.97 2.61-.97.52 1.31.19 2.28.1 2.52.61.66.98 1.51.98 2.55 0 3.65-2.23 4.46-4.35 4.69.34.3.65.88.65 1.77v2.63c0 .26.17.56.66.46A9.5 9.5 0 0 0 12 2.5Z"
    />
  ),
  linkedin: (
    <path
      fill="currentColor"
      stroke="none"
      d="M19.4 3H4.6A1.6 1.6 0 0 0 3 4.6v14.8A1.6 1.6 0 0 0 4.6 21h14.8a1.6 1.6 0 0 0 1.6-1.6V4.6A1.6 1.6 0 0 0 19.4 3ZM8.4 18.2H5.7V9.6h2.7v8.6ZM7.05 8.4a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12ZM18.3 18.2h-2.67v-4.18c0-1 0-2.28-1.39-2.28s-1.6 1.09-1.6 2.21v4.25H9.97V9.6h2.56v1.18h.04a2.8 2.8 0 0 1 2.52-1.39c2.7 0 3.2 1.78 3.2 4.09v4.72Z"
    />
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </>
  ),
  moon: <path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1Z" />,
  menu: (
    <>
      <path d="M4 8h16" />
      <path d="M4 16h16" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  printer: (
    <>
      <path d="M7 8.5V4h10v4.5" />
      <rect x="3.5" y="8.5" width="17" height="8" rx="2" />
      <path d="M7 14h10v6H7z" />
    </>
  ),
  spinner: <path d="M12 3a9 9 0 1 0 9 9" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.4v.1" />
    </>
  ),
};

export function Icon({
  name,
  size = 18,
  ...props
}: { name: IconName; size?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
