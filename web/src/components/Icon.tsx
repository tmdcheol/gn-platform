/**
 * 라인 아이콘 모음. 아이콘 라이브러리를 쓰지 않으므로 path만 모아 둡니다.
 * 키는 API의 `icon` 필드 값과 맞춥니다.
 */
export const ICON_PATHS = {
  truck: "M3 7h11v10H3zM14 10h4l3 3v4h-7z M7 17a2 2 0 104 0 M16 17a2 2 0 104 0",
  wing: "M12 20V8 M12 8L3 4v6l9 2 M12 8l9-4v6l-9 2",
  snowflake: "M12 3v18 M4 7l16 10 M20 7L4 17",
  lift: "M4 18h16 M6 18V9h8v9 M14 12h6",
  shield: "M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z",
  car: "M4 16h16v-4l-2-4H6L4 12z M7 16a2 2 0 104 0 M13 16a2 2 0 104 0",
  pickup: "M12 3v10 M8 9l4 4 4-4 M4 17v3h16v-3",
  tow: "M4 17h9v-5H4z M13 12l5-7 M7 17a2 2 0 104 0 M15 17a2 2 0 104 0",
  phone:
    "M6.5 3.5h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 014.5 5.7 2 2 0 016.5 3.5z",
  chat: "M21 11.5c0 4-4 7-9 7a11 11 0 01-2.6-.3L4.5 20l1.2-3.3A7.6 7.6 0 013 11.5c0-4 4-7 9-7s9 3 9 7z",
  check: "M4 12.5l5 5L20 6.5",
  "arrow-right": "M5 12h14 M13 6l6 6-6 6",
  pin: "M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z M12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  square: "M12 3l9 9-9 9-9-9z",
} as const;

export type IconName = keyof typeof ICON_PATHS;

/** 알 수 없는 키(API가 새 아이콘을 보내는 경우)는 기본 도형으로 떨어집니다. */
export function iconPath(name: string) {
  return ICON_PATHS[name as IconName] ?? ICON_PATHS.square;
}

type IconProps = {
  name: string;
  className?: string;
  strokeWidth?: number;
};

export default function Icon({
  name,
  className = "h-6 w-6",
  strokeWidth = 1.6,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d={iconPath(name)} />
    </svg>
  );
}
