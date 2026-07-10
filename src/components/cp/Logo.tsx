interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 30, showText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <img
        src="/logo.svg"
        alt="CodePark Logo"
        style={{ width: `${size}px`, height: "auto" }}
        className="object-contain logo-svg-invert"
      />
      {showText && (
        <span
          className="text-foreground tracking-tight font-semibold text-[15px] leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          CodePark
        </span>
      )}
    </div>
  );
}
