/** Insanjo icon mark (official asset). */
export function InsanjoMark({ size = 32, className = '' }) {
  return (
    <img
      src="/insanjo-icon.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    />
  );
}

/** Full Insanjo wordmark + mark (official asset). */
export default function Logo({ className = '', height = 28 }) {
  return (
    <a
      href="#top"
      className={`inline-flex items-center ${className}`}
      aria-label="Insanjo home"
    >
      <img
        src="/insanjo-logo.svg"
        alt="Insanjo"
        height={height}
        style={{ height }}
        className="w-auto"
      />
    </a>
  );
}
