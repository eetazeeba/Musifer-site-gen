export default function AboutPageWireframe() {
  const childCards = [
    "Team",
    "Mission",
    "History",
    "Portfolio",
    "Client List",
    "FAQ",
  ];

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="rounded-3xl border-2 border-dashed border-zinc-500 bg-white p-4 md:p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">Low-fidelity wireframe</div>
          <h1 className="mt-2 text-2xl md:text-4xl font-semibold">About page parent-route structure</h1>
          <p className="mt-2 max-w-3xl text-sm md:text-base text-zinc-600">
            Built as a landing page that introduces Musifer, frames the brand story,
            and routes visitors into the six existing About child pages.
          </p>
        </header>

        <section className="rounded-3xl border-2 border-dashed border-zinc-500 bg-white p-5 md:p-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs font-mono text-zinc-500">01 / HERO</div>
              <h2 className="mt-1 text-xl md:text-3xl font-semibold">Who Musifer is</h2>
              <p className="mt-2 max-w-2xl text-sm md:text-base text-zinc-600">
                Intro copy block for independence, artist support, and the platform's
                purpose. This is the emotional anchor for the page.
              </p>
            </div>
            <div className="w-full md:w-56 rounded-2xl border-2 border-dashed border-zinc-400 bg-zinc-50 p-4 text-sm text-zinc-500">
              Optional visual block<br />
              logo / motif / abstract image
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border-2 border-dashed border-zinc-400 p-4 bg-zinc-50 text-sm">Quick stat / value point</div>
            <div className="rounded-2xl border-2 border-dashed border-zinc-400 p-4 bg-zinc-50 text-sm">Quick stat / value point</div>
            <div className="rounded-2xl border-2 border-dashed border-zinc-400 p-4 bg-zinc-50 text-sm">Quick stat / value point</div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border-2 border-dashed border-zinc-500 bg-white p-5 md:p-8">
            <div className="text-xs font-mono text-zinc-500">02 / BRAND STORY</div>
            <h2 className="mt-1 text-xl md:text-2xl font-semibold">Why this exists</h2>
            <div className="mt-4 space-y-3 text-sm md:text-base text-zinc-600">
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
                Paragraph block: independent-artist focus, practical support, and long-term platform vision.
              </div>
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
                Paragraph block: current phase, what Musifer offers now, and how the mission expands over time.
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-dashed border-zinc-500 bg-white p-5 md:p-8">
            <div className="text-xs font-mono text-zinc-500">03 / GUIDING PILLARS</div>
            <h2 className="mt-1 text-xl md:text-2xl font-semibold">Core values</h2>
            <div className="mt-4 space-y-3">
              {[
                "Independent by default",
                "Artist-first support",
                "Practical resources",
                "Future-facing platform",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border-2 border-dashed border-zinc-500 bg-white p-5 md:p-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs font-mono text-zinc-500">04 / ABOUT INDEX</div>
              <h2 className="mt-1 text-xl md:text-2xl font-semibold">Explore the About section</h2>
              <p className="mt-2 max-w-2xl text-sm md:text-base text-zinc-600">
                Card grid that previews the child pages already present in navigation.
              </p>
            </div>
            <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">6 child routes</div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {childCards.map((title, index) => (
              <div key={title} className="rounded-2xl border-2 border-dashed border-zinc-400 bg-zinc-50 p-5 min-h-36 flex flex-col">
                <div className="text-xs font-mono text-zinc-500">0{index + 1}</div>
                <div className="mt-2 text-lg font-medium">{title}</div>
                <div className="mt-3 text-sm text-zinc-500 flex-1">
                  Short summary teaser for this child page.
                </div>
                <div className="mt-4 rounded-xl border border-dashed border-zinc-300 px-3 py-2 text-xs uppercase tracking-[0.2em] text-zinc-500 w-fit">
                  Link out
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-3xl border-2 border-dashed border-zinc-500 bg-white p-5 md:p-8">
            <div className="text-xs font-mono text-zinc-500">05 / TRUST + PROOF</div>
            <h2 className="mt-1 text-xl md:text-2xl font-semibold">Selected work / credibility layer</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border-2 border-dashed border-zinc-400 bg-zinc-50 p-5 text-sm text-zinc-600 min-h-24">
                Portfolio preview or featured project card
              </div>
              <div className="rounded-2xl border-2 border-dashed border-zinc-400 bg-zinc-50 p-5 text-sm text-zinc-600 min-h-24">
                Client/community proof or quote block
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-dashed border-zinc-500 bg-white p-5 md:p-8">
            <div className="text-xs font-mono text-zinc-500">06 / FAQ + NEXT STEP</div>
            <h2 className="mt-1 text-xl md:text-2xl font-semibold">Common questions and where to go next</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-700">
                FAQ teaser accordion/list block
              </div>
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-700">
                CTA row: Services / Contact / Blog
              </div>
            </div>
          </div>
        </section>

        <footer className="rounded-3xl border-2 border-dashed border-zinc-500 bg-white p-4 md:p-6 text-sm text-zinc-600">
          Mobile order should remain linear: Hero → Brand Story → Core Values → About Index → Trust/Proof → FAQ/CTA.
        </footer>
      </div>
    </div>
  );
}
