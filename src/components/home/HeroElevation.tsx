interface HeroElevationProps {
  className?: string;
}

const FLOOR_Y = [30, 136, 242, 348, 454, 560];
const WINDOW_X = [172, 214, 288, 330];

/**
 * The page's signature: a fine single-weight architectural elevation of a
 * stacked multi-storey building — storeys, window mullions, a centre portion
 * split, a ground line and a left dimension line. Gold hairlines, deliberately
 * abstract so it never reads as a specific building. Decorative.
 */
export function HeroElevation({ className }: HeroElevationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 620"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <g vectorEffect="non-scaling-stroke">
        {/* building envelope */}
        <rect x="150" y="30" width="220" height="530" vectorEffect="non-scaling-stroke" />
        {/* roof cap */}
        <line x1="138" y1="22" x2="382" y2="22" vectorEffect="non-scaling-stroke" />
        <line x1="138" y1="22" x2="150" y2="30" vectorEffect="non-scaling-stroke" />
        <line x1="382" y1="22" x2="370" y2="30" vectorEffect="non-scaling-stroke" />

        {/* storey lines */}
        {FLOOR_Y.map((y) => (
          <line
            key={`floor-${y}`}
            x1="150"
            y1={y}
            x2="370"
            y2={y}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* centre portion split */}
        <line x1="260" y1="30" x2="260" y2="560" vectorEffect="non-scaling-stroke" />

        {/* windows — upper four storeys */}
        {FLOOR_Y.slice(0, 4).map((top) =>
          WINDOW_X.map((x) => (
            <rect
              key={`win-${top}-${x}`}
              x={x}
              y={top + 26}
              width="22"
              height="52"
              vectorEffect="non-scaling-stroke"
            />
          )),
        )}

        {/* ground storey: two windows + a doorway */}
        <rect x="180" y="480" width="22" height="50" vectorEffect="non-scaling-stroke" />
        <rect x="320" y="480" width="22" height="50" vectorEffect="non-scaling-stroke" />
        <rect x="246" y="506" width="28" height="54" vectorEffect="non-scaling-stroke" />

        {/* balcony ticks */}
        {FLOOR_Y.slice(1, 5).map((y) => (
          <line
            key={`bal-${y}`}
            x1="370"
            y1={y}
            x2="392"
            y2={y}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* ground + plinth lines */}
        <line x1="36" y1="560" x2="452" y2="560" vectorEffect="non-scaling-stroke" />
        <line x1="146" y1="566" x2="374" y2="566" vectorEffect="non-scaling-stroke" />

        {/* left dimension line with floor ticks */}
        <line x1="110" y1="30" x2="110" y2="560" vectorEffect="non-scaling-stroke" />
        {FLOOR_Y.map((y) => (
          <line
            key={`tick-${y}`}
            x1="104"
            y1={y}
            x2="116"
            y2={y}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}
