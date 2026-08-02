export default function ArticleCard(props) {
  const slateHeight = props.featured ? "h-64 md:h-72" : "h-44";
  const titleSize = props.featured ? "text-3xl md:text-4xl" : "text-2xl";

  return (
    <a href={"/articles/" + props.slug} className="block">
      <div className={"relative rounded-lg mb-4 overflow-hidden flex items-end " + slateHeight}>
        {props.coverUrl ? (
          <img src={props.coverUrl} alt={props.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(28,20,22,0.9) 0 26px, rgba(28,20,22,0.78) 26px 52px)" }} />
        )}
        <div className="absolute inset-x-0 top-0 h-8 bg-[#1C1416] rounded-t-lg" />
        <span className="relative z-10 font-mono text-xs text-paper px-4 py-3">{props.tag}</span>
      </div>

      <span className="block font-mono text-[11px] tracking-widest uppercase text-branddark mb-2">{props.kicker}</span>
      <h3 className={"font-display leading-tight text-[#1C1416] mb-2 " + titleSize}>{props.title}</h3>
      <p className="text-sm leading-relaxed text-[#1C1416]/65">{props.excerpt}</p>
      <span className="block font-mono text-[11px] text-[#1C1416]/50 mt-4">{props.meta}</span>
    </a>
  );
}
