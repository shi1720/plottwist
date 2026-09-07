import { notFound } from 'next/navigation';
import { CHARACTER_STORIES } from '@/lib/content/stories';
import { CHARACTERS } from '@/lib/content/characters';
import { Header, Footer, CharacterArt } from '@/components/plot/chrome';
import { ArrowRight, ArrowLeft } from 'lucide-react';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const c = CHARACTERS.find((c) => c.code === code);
  return {
    title: c ? `${c.name} · Plot Twist` : 'Character not found · Plot Twist',
    description: c?.tagline,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const c = CHARACTERS.find((c) => c.code === code);
  if (!c) notFound();
  return (
    <>
      <Header />
      <main id="main-content" className="character-page">
        <a className="icon-text" href="/cast">
          <ArrowLeft size={17} /> Back to the cast
        </a>
        <div className="character-detail">
          <div className={`result-poster ${c.color}`}>
            <div className="poster-top">
              <span>Plot Twist character</span>
              <span>{parseInt(c.code, 2) + 1}/16</span>
            </div>
            <CharacterArt code={c.code} eager />
            <h1>{c.name}</h1>
            <p>{c.tagline}</p>
            <div className="character-tags">
              {c.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          <div className="character-copy">
            <p className="eyebrow">About this character</p>
            <h2>{c.tagline}</h2>
            <p>{c.description}</p>
            <details className="character-cold-open">
              <summary>A scene with this character · Fiction, for fun</summary>
              <p>{CHARACTER_STORIES[c.code].coldOpen}</p>
            </details>
            <blockquote>“{c.quote}”</blockquote>
            <div className="roast-box">
              <p className="eyebrow">An affectionate observation</p>
              <p>{c.roast}</p>
            </div>
            <h3>What they bring</h3>
            <p>{c.strength}</p>
            <h3>Something to try</h3>
            <p>{c.growth}</p>
            <a className="primary-button" href={`/chemistry?a=${c.code}`}>
              Find their co-star <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
