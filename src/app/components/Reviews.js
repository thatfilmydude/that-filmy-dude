import ReviewCard from "./ReviewCard";

export default function Reviews() {
  const reviews = [
    {
      genre: "DRAMA",
      duration: "2H 18M",
      title: "Monsoon Diaries",
      excerpt: "A slow-burn family drama that trusts silence more than dialogue - and mostly earns it.",
      rating: "4 out of 5 stars",
      author: "R. NAIR",
    },
    {
      genre: "ACTION",
      duration: "2H 41M",
      title: "Ember Road",
      excerpt: "All spectacle, thin script - but the chase through the salt flats alone is worth a ticket.",
      rating: "3 out of 5 stars",
      author: "A. MENON",
    },
    {
      genre: "THRILLER",
      duration: "2H 05M",
      title: "Kaalpurush",
      excerpt: "A twisty, atmospheric noir that finally gives its lead actress a role worth her talent.",
      rating: "5 out of 5 stars",
      author: "S. IYER",
    },
  ];

  return (
    <section id="reviews" className="px-8 md:px-16 py-24">
      <div className="flex items-end justify-between border-b border-cream/10 pb-5 mb-12 flex-wrap gap-4">
        <div>
          <span className="block font-mono text-xs tracking-[0.2em] uppercase text-gold mb-2">
            In Theatres
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-cream">Latest Reviews</h2>
        </div>
        <a href="#" className="font-mono text-xs tracking-widest uppercase text-muted border-b border-cream/20 pb-1 hover:text-gold hover:border-gold transition">
          All Reviews
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map(function (r, i) {
          return <ReviewCard key={i} {...r} />;
        })}
      </div>
    </section>
  );
}
