export default function Footer() {
  return (
    <footer className="flex items-center justify-between px-8 md:px-16 py-10 border-t border-cream/10 flex-wrap gap-5">
      <div className="flex items-center gap-3">
        <span className="relative flex items-center justify-center w-10 h-10 rounded-full border border-brandred/50">
          <img src="/logo.png" alt="That Filmy Dude" className="w-6 h-auto" />
        </span>
        <span className="font-mono text-xs text-muted tracking-wide">
          COPYRIGHT 2026 - BUILT FOR PEOPLE WHO WATCH THE CREDITS
        </span>
      </div>
      <div className="flex gap-6">
        <a href="#" className="font-mono text-xs tracking-widest uppercase text-muted hover:text-gold transition">Instagram</a>
        <a href="#" className="font-mono text-xs tracking-widest uppercase text-muted hover:text-gold transition">X</a>
        <a href="#" className="font-mono text-xs tracking-widest uppercase text-muted hover:text-gold transition">YouTube</a>
      </div>
    </footer>
  );
}
