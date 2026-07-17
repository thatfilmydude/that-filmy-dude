export default function SectionSkeleton() {
  return (
    <div className="px-8 md:px-16 py-24">
      <div className="h-4 w-24 bg-cream/5 rounded mb-4 animate-pulse" />
      <div className="h-10 w-64 bg-cream/5 rounded mb-10 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="h-64 bg-cream/5 rounded-lg animate-pulse" />
        <div className="h-64 bg-cream/5 rounded-lg animate-pulse hidden md:block" />
        <div className="h-64 bg-cream/5 rounded-lg animate-pulse hidden md:block" />
      </div>
    </div>
  );
}
