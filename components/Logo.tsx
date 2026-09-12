const SIZES = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl md:text-4xl",
  xl: "text-5xl md:text-6xl",
} as const;

export default function Logo({
  size = "md",
  tone = "noir",
  className = "",
}: {
  size?: keyof typeof SIZES;
  tone?: "noir" | "ivoire";
  className?: string;
}) {
  const textColor = tone === "ivoire" ? "text-ivoire" : "text-noir";

  return (
    <span
      className={`font-brand font-bold tracking-[0.04em] ${SIZES[size]} ${textColor} ${className}`}
    >
      NEMA
    </span>
  );
}
