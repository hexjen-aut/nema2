import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <Image
        src="/nema-logo.png"
        alt="Nema — un sac, une âme"
        width={160}
        height={160}
        priority
        className="h-12 w-12 rounded-full object-cover ring-1 ring-ink/10"
      />
    </span>
  );
}
