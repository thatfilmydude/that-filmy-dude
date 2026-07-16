import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-16 py-5 border-b border-cream/10 bg-backdrop/95 backdrop-blur-sm">
      <a href="#" className="flex items-center gap-3">
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full border border-gold/40">
          <Image src="/logo.png" alt="That Filmy Dude" width={40} height={40} className="w-9 h-auto" />
        </span>
        <span className="flex flex-col leading-none">
          <span className="font-display text-xl tracking-wide text-cream">
            THAT FILMY DUDE
          </span>
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-gold mt-1">
            Reel Talk · No Filter
          </span>
        </span>
      </a>

      <nav className="hidden md:flex gap-8">
        <a href="#reviews" className="font-mono text-xs tracking-widest uppercase text-muted hover:text-gold transition">
          Reviews
        </a>
        <a href="#articles" className="font-mono text-xs tracking-widest uppercase text-muted hover:text-gold transition">
          Articles
        </a>
        <a href="#blogs" className="font-mono text-xs tracking-widest uppercase text-muted hover:text-gold transition">
          Blogs
        </a>
        <a href="#gallery" className="font-mono text-xs tracking-widest uppercase text-muted hover:text-gold transition">
          Galleries
        </a>
      </nav>
    </header>
  );
}
