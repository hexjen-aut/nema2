// Aiguille de crochet stylisée — écho discret du savoir-faire NEMA,
// toujours accolée aux lettres du nom (jamais de logo image).
function NeedleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 40" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 2c-3 3-3 6 0 8s3 5 0 8-3 6 0 8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="2" r="1.6" fill="currentColor" />
    </svg>
  );
}

const SIZES = {
  sm: { text: "text-lg", icon: "h-5 w-3.5" },
  md: { text: "text-xl", icon: "h-6 w-4" },
  lg: { text: "text-3xl md:text-4xl", icon: "h-9 w-6 md:h-10 md:w-7" },
  xl: { text: "text-5xl md:text-6xl", icon: "h-14 w-9 md:h-16 md:w-10" },
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
  const { text, icon } = SIZES[size];
  const textColor = tone === "ivoire" ? "text-ivoire" : "text-noir";
  const iconColor = tone === "ivoire" ? "text-ivoire" : "text-orange";

  return (
    <span className={`inline-flex items-center gap-2 md:gap-3 ${className}`}>
      <NeedleIcon className={`${icon} ${iconColor}`} />
      <span className={`font-display tracking-[0.08em] ${text} ${textColor}`}>NEMA</span>
    </span>
  );
}
