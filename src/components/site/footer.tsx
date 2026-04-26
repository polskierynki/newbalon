import Image from "next/image";

const year = new Date().getFullYear();

type FooterProps = {
  footerText?: string;
};

export function Footer({ footerText }: FooterProps) {
  const resolvedFooterText = (footerText ?? "© 2025 Nazwa Firmy").replace(/2025/g, String(year));

  return (
    <footer className="relative z-20 border-t border-slate-900 bg-black py-8 md:py-10 text-center">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="o!balon"
            width={120}
            height={44}
            className="h-8 w-auto md:h-10"
          />
        </div>
        <p className="text-xs text-slate-400 md:text-sm">
          {resolvedFooterText}
        </p>
        <div className="flex w-full justify-center md:w-[150px] md:justify-end" />
      </div>
    </footer>
  );
}
