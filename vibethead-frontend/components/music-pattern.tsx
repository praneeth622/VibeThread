export function MusicPattern({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="musicPattern"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M1 1 L9 9 M9 1 L1 9"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#musicPattern)" />
      </svg>
    </div>
  );
}