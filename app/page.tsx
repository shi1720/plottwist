import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Header, Footer, CharacterArt } from '@/components/plot/chrome';
import { CHARACTERS } from '@/lib/content/characters';
export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="home-opening">
          <div className="home-intro">
            <p className="eyebrow">A personality quiz, for fun</p>
            <h1>
              Who are you
              <br />
              in the <em>group chat?</em>
            </h1>
            <p className="home-description">
              The one who makes the plans? The one who changes them? Answer 12
              everyday questions and meet your match among 16 original
              characters.
            </p>
            <a className="primary-button" href="/play?pack=pilot">
              Take the quiz <ArrowRight size={19} />
            </a>
            <p className="home-details">About 3 minutes · No account needed</p>
          </div>
          <a className="featured-character" href="/cast/0110">
            <span className="feature-kicker">Meet one of the characters</span>
            <CharacterArt code="0110" eager />
            <div className="feature-caption">
              <div>
                <span>07 / 16</span>
                <h2>The Spreadsheet Sage</h2>
                <p>“I made a quick sheet.”</p>
              </div>
              <ArrowUpRight size={24} />
            </div>
          </a>
        </section>
        <section className="episodes section" id="episodes">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Three ways to play</p>
              <h2>Choose your setting.</h2>
            </div>
            <p>
              Each quiz has 12 questions and the same 16 possible characters.
            </p>
          </div>
          <div className="episode-grid">
            {[
              {
                id: 'pilot',
                n: '01',
                title: 'The pilot episode',
                subtitle: 'Everyday life',
                description:
                  'Dinner plans, small favors, and a roommate who keeps borrowing your oat milk.',
              },
              {
                id: 'office',
                n: '02',
                title: 'Out of office',
                subtitle: 'At work',
                description:
                  'A canceled meeting, a tight deadline, and a colleague who needs your help.',
              },
              {
                id: 'friends',
                n: '03',
                title: 'The group chat',
                subtitle: 'With friends',
                description:
                  'Weekend trips, unsolicited advice, and three people nobody mentioned inviting.',
              },
            ].map((e) => (
              <a
                className="episode-card"
                href={`/play?pack=${e.id}`}
                key={e.id}
              >
                <span className="episode-number">{e.n}</span>
                <div className="episode-title">
                  <span>{e.subtitle}</span>
                  <h3>{e.title}</h3>
                </div>
                <p>{e.description}</p>
                <ArrowRight size={24} />
              </a>
            ))}
          </div>
        </section>
        <section className="cast-preview section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The characters</p>
              <h2>You probably know someone like this.</h2>
            </div>
            <a className="text-link" href="/cast">
              Meet all 16 <ArrowRight size={18} />
            </a>
          </div>
          <div className="preview-cast-grid">
            {['0000', '0101', '1001'].map((code) => {
              const c = CHARACTERS.find((c) => c.code === code)!;
              return (
                <a
                  className="preview-cast-card"
                  key={code}
                  href={`/cast/${code}`}
                >
                  <CharacterArt code={code} />
                  <h3>{c.name}</h3>
                  <p>{c.tagline}</p>
                  <span className="text-link">
                    Meet this character <ArrowUpRight size={16} />
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
