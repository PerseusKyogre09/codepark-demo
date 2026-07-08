interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  presenceMode?: "online" | "away" | "offline";
  className?: string;
}

const colors: Record<string, string> = {
  A: "#2E8B57", B: "#5B9BD4", C: "#D4A84B", D: "#C0624A", E: "#6BAF82",
  F: "#5AA469", G: "#3A6EA8", H: "#A07030", I: "#4CAF7D", J: "#2E8B57",
  K: "#5B9BD4", L: "#D4A84B", M: "#C0624A", N: "#6BAF82", O: "#3A6EA8",
  P: "#A07030", Q: "#4CAF7D", R: "#2E8B57", S: "#5B9BD4", T: "#D4A84B",
  U: "#C0624A", V: "#6BAF82", W: "#3A6EA8", X: "#A07030", Y: "#4CAF7D", Z: "#2E8B57",
};

const sizes = {
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
  xl: "size-14 text-base",
};

const dotSizes = {
  sm: "size-1.5 bottom-0 right-0",
  md: "size-2 bottom-0 right-0",
  lg: "size-2.5 bottom-0.5 right-0.5",
  xl: "size-3 bottom-0.5 right-0.5",
};

export function Avatar({ name, size = "md", online, presenceMode, className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const bg = colors[initials[0]] ?? "#2E8B57";

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white`}
        style={{ backgroundColor: bg }}
        aria-label={name}
      >
        {initials}
      </div>
      {presenceMode !== undefined && (
        <span
          className={`absolute ${dotSizes[size]} rounded-full border-2 border-background ${
            presenceMode === "online"
              ? "bg-emerald-500"
              : presenceMode === "away"
              ? "bg-amber-500"
              : "bg-zinc-500"
          }`}
        />
      )}
      {presenceMode === undefined && online !== undefined && (
        <span
          className={`absolute ${dotSizes[size]} rounded-full border-2 border-background ${
            online ? "bg-success" : "bg-muted-foreground"
          }`}
        />
      )}
    </div>
  );
}
