import Link from "next/link";

export default function ReviewCard(props) {
  return (
    <Link href={"/reviews/" + props.slug} className="block">
      <article className="relative bg-surface border border-cream/10 rounded-lg overflow-hidden hover:-translate-y-1.5 hover:border-gold/40 transition">
        <div className="h-48 relative flex items-center justify-center bg-gradient-to-br from-branddark via-[#341018] to-surface">
          <span className="font-display text-sm tracking-widest uppercase text-cream/50">
            {props.genre} - {props.duration}
          </span>
        </div>

        <div className="px-6 pt-6">
          <span className="block font-mono text-[11px] tracking-widest uppercase text-gold mb-2">
            Feature Review
          </span>
          <h3 className="font-display text-2xl text-cream mb-2">{props.title}</h3>
          <p className="text-sm leading-relaxed text-muted">{props.excerpt}</p>
        </div>

        <div className="relative mx-6 mt-5 border-t border-dashed border-cream/15">
          <span className="absolute -top-2 -left-[38px] w-4 h-4 rounded-full bg-backdrop" />
          <span className="absolute -top-2 -right-[38px] w-4 h-4 rounded-full bg-backdrop" />
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <span className="font-mono text-sm text-gold font-bold">{props.rating}</span>
          <span className="font-mono text-[11px] text-muted">- {props.author}</span>
        </div>
      </article>
    </Link>
  );
}
