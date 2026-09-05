import { ArrowUpRight, Play, MoveRight, Sparkles } from 'lucide-react';
import { Header, Footer, CharacterArt } from '@/components/plot/chrome';
import { CHARACTERS } from '@/lib/content/characters';
import { CHARACTER_STORIES } from '@/lib/content/stories';
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero season-two">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="live-dot" /> A 3-MINUTE PERSONALITY QUIZ
            </p>
            <h1>
              Your life.
              <br />
              But make it
              <br />
              <em>a sitcom.</em>
            </h1>
            <p className="hero-description">
              Play through 12 everyday dilemmas. Find out which of our 16
              original sitcom characters you are—and what happens when your
              friends join the cast.
            </p>
            <a className="primary-button" href="/play?pack=pilot">
              <Play size={18} fill="currentColor" /> Find my character{' '}
              <MoveRight size={22} />
            </a>
            <p className="micro-copy">
              No sign-up. Just you and some revealing dinner plans.
            </p>
            <div className="hero-foot">
              <span>12 SCENES</span>
              <span>16 CHARACTERS</span>
              <span>ONE QUESTIONABLE ENSEMBLE</span>
            </div>
          </div>
          <div className="casting-stage">
            <div className="stage-topline">
              <span>TONIGHT’S EPISODE</span>
              <span>01 / THE PILOT</span>
            </div>
            <h2>
              Six friends.
              <br />
              Zero reservations.
            </h2>
            <p>
              Someone has a backup. Someone has a theory.
              <br />
              Someone has already ordered karaoke.
            </p>
            <div className="stage-cast">
              {['0110', '1001', '0000'].map((code) => {
                const c = CHARACTERS.find((c) => c.code === code)!;
                return (
                  <a
                    href={`/cast/${code}`}
                    className={`stage-character ${c.color}`}
                    key={code}
                  >
                    <CharacterArt code={code} eager />
                    <span>{c.name.replace('The ', '')}</span>
                  </a>
                );
              })}
            </div>
            <div className="stage-punchline">
              <span>YOUR ROLE?</span>
              <strong>That’s what we’re here to find out.</strong>
              <ArrowUpRight size={22} />
            </div>
          </div>
        </section>
        <div className="ticker">
          <span>GOOD INTENTIONS. INTERESTING DECISIONS.</span>
          <Sparkles size={21} />
          <span>EVERY FRIEND GROUP IS A WRITERS’ ROOM.</span>
          <Sparkles size={21} />
          <span>YOU’RE IN THE CREDITS.</span>
        </div>
        <section className="episodes section" id="episodes">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CHOOSE YOUR EPISODE</p>
              <h2>Same you. Different stakes.</h2>
            </div>
            <p>
              Each is a complete 12-scene quiz.
              <br />
              Pick the situation that knows you best.
            </p>
          </div>
          <div className="episode-grid">
            {[
              {
                n: '01',
                title: 'The pilot episode',
                desc: 'The group chat wakes up. The weekend falls apart. Someone steals your oat milk.',
                tag: 'START HERE',
                color: 'peach',
                pack: 'pilot',
                icon: '✳',
                line: '“Did anyone actually book the table?”',
              },
              {
                n: '02',
                title: 'Out of office',
                desc: 'A canceled meeting gives you hope. A moved deadline immediately takes it back.',
                tag: 'WORKPLACE COMEDY',
                color: 'lilac',
                pack: 'office',
                icon: '↗',
                line: '“Quick sync” is how the trouble starts.',
              },
              {
                n: '03',
                title: 'The group chat',
                desc: 'One voice note becomes a weekend away. Three extra people become your problem.',
                tag: 'FRIENDSHIP LORE',
                color: 'green',
                pack: 'friends',
                icon: '✺',
                line: '“Who added these people?”',
              },
            ].map((e) => (
              <a
                className={`episode-card ${e.color}`}
                key={e.n}
                href={`/play?pack=${e.pack}`}
              >
                <div className="card-top">
                  <span>{e.tag}</span>
                  <span>EP. {e.n}</span>
                </div>
                <div className="episode-symbol" aria-hidden="true">
                  {e.icon}
                </div>
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
                <p className="episode-line">{e.line}</p>
                <div className="card-bottom">
                  <span>12 SCENES · ~3 MIN</span>
                  <ArrowUpRight size={24} />
                </div>
              </a>
            ))}
          </div>
        </section>
        <section className="cast-preview section" id="cast">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A FEW PEOPLE YOU MIGHT BE</p>
              <h2>Recognize anyone?</h2>
            </div>
            <a className="text-link" href="/cast">
              Meet all 16 characters <ArrowUpRight size={20} />
            </a>
          </div>
          <div className="preview-cast-grid">
            {['0100', '0101', '1010', '1100'].map((code) => {
              const c = CHARACTERS.find((c) => c.code === code)!;
              return (
                <a
                  className={`preview-cast-card ${c.color}`}
                  href={`/cast/${code}`}
                  key={code}
                >
                  <CharacterArt code={code} />
                  <div>
                    <h3>{c.name}</h3>
                    <p>{CHARACTER_STORIES[code].entrance}</p>
                  </div>
                  <ArrowUpRight size={20} />
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
