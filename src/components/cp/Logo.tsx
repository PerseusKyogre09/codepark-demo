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
        <div className="flex items-center gap-1.5">
          <span
            className="text-foreground tracking-tight font-semibold text-[15px] leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CodePark
          </span>
          {/* Demo badge — small pill shown beside the logo exactly once */}
          <span className="text-[9px] font-bold uppercase tracking-wider text-primary/70 border border-primary/30 rounded px-1 py-0.5 leading-none">
            demo
          </span>
        </div>
      )}
    </div>
  );
}
