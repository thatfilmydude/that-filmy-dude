export default function BlogEntry(props) {
  return (
    <a href={"/blogs/" + props.slug} className="block relative pl-7 py-6 border-l-2 border-brandred border-b border-cream/10">
      <span className="absolute -left-[6px] top-8 w-2.5 h-2.5 rounded-full bg-brandred ring-4 ring-backdrop" />
      <span className="block font-mono text-[11px] tracking-widest uppercase text-muted mb-2">{props.date}</span>
      <h4 className="font-body italic font-semibold text-xl text-cream mb-2">{props.title}</h4>
      <p className="text-sm leading-relaxed text-muted">{props.excerpt}</p>
      <span className="inline-block mt-3 font-mono text-[11px] tracking-widest uppercase text-gold">Keep Reading</span>
    </a>
  );
}
