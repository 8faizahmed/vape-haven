/** Keeps category navigation instant while Next.js resolves the route params. */
export default function CategoryLoading() {
  return (
    <div role="status" aria-label="Loading collection" className="motion-safe:animate-pulse">
      <span className="sr-only">Loading collection…</span>
      <div aria-hidden="true" className="border-b hairline">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="mb-10 h-3 w-40 bg-ink-700" />
          <div className="h-3 w-28 bg-ink-700" />
          <div className="mt-5 h-14 w-3/4 max-w-lg bg-ink-700" />
          <div className="mt-6 h-12 max-w-xl bg-ink-800" />
        </div>
      </div>
      <div aria-hidden="true" className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="mb-10 h-11 w-full bg-ink-800" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => <div key={item} className="aspect-[3/4] bg-ink-800" />)}
        </div>
      </div>
    </div>
  );
}
