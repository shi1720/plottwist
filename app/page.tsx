import { ArrowUpRight, Play, Sparkles, MoveRight, Radio } from 'lucide-react';
export default function Home() {
  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="/">
          plot<span>twist</span>
          <span className="logo-dot">✳</span>
        </a>
        <nav>
          <a href="#episodes">The episodes</a>
          <a href="#cast">The cast</a>
          <a href="/about">
            Behind the scenes <ArrowUpRight size={15} />
          </a>
        </nav>
        <a className="small-button" href="/play?pack=pilot">
          Find my character <ArrowUpRight size={16} />
        </a>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="live-dot" /> NOW CASTING: YOU
            </p>
            <h1>
              Your life.
              <br />
              Questionable
              <br />
              <em>casting.</em>
              <span className="asterisk">✳</span>
            </h1>
            <p className="hero-description">
              Main character? Lovable menace? The one who brings a spreadsheet
              to brunch? Let’s find out.
            </p>
            <a className="primary-button" href="/play?pack=pilot">
              <Play size={18} fill="currentColor" /> Meet your alter ego{' '}
              <MoveRight size={22} />
            </a>
            <p className="micro-copy">
              12 little dilemmas. 16 possible yous. Zero existential guarantees.
            </p>
            <div className="hero-foot">
              <span>~ 3 MINUTES</span>
              <span>NO SIGN-UP</span>
              <span>JUST A LITTLE TOO ACCURATE</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-topline">
              <span>THE PERSONALITY SITCOM</span>
              <Radio size={20} />
            </div>
            <img
              className="cast-art"
              src="/cast-ensemble.webp"
              alt="An orange star, lavender cloud, yellow flower and mint square: our delightfully chaotic ensemble cast"
              width="1536"
              height="1024"
            />
            <div className="art-caption">
              <span>A very unofficial study of being you.</span>
              <span>VOL. 001 ↗</span>
            </div>
            <div className="sticker">
              100%
              <br />
              <em>
                main character
                <br />
                energy
              </em>
            </div>
          </div>
        </section>
        <div className="ticker">
          <span>GOOD INTENTIONS. INTERESTING DECISIONS.</span>
          <Sparkles size={21} />
          <span>A LITTLE SELF-DISCOVERY. A LOT OF PLOT.</span>
          <Sparkles size={21} />
          <span>YOUR LORE STARTS HERE.</span>
          <Sparkles size={21} />
        </div>
        <section className="episodes section" id="episodes">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PICK YOUR PILOT</p>
              <h2>Same you. Different chaos.</h2>
            </div>
            <p>
              Choose your scene. Follow your instincts.
              <br />
              Try not to overthink the group chat.
            </p>
          </div>
          <div className="episode-grid">
            {[
              {
                n: '01',
                title: 'The pilot episode',
                desc: 'A group chat. A dinner party. A perfectly normal identity crisis.',
                tag: 'THE ORIGINAL',
                color: 'peach',
                pack: 'pilot',
                icon: '✳',
              },
              {
                n: '02',
                title: 'Out of office',
                desc: 'Reply-all disasters and meetings that could have been a nap.',
                tag: 'WORKPLACE COMEDY',
                color: 'lilac',
                pack: 'office',
                icon: '↗',
              },
              {
                n: '03',
                title: 'The group chat',
                desc: 'Unread messages. Unhinged plans. Your people, in all their glory.',
                tag: 'FRIENDSHIP LORE',
                color: 'green',
                pack: 'friends',
                icon: '✺',
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
                <div className="episode-symbol">{e.icon}</div>
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
                <div className="card-bottom">
                  <span>12 SCENES · ~3 MIN</span>
                  <ArrowUpRight size={24} />
                </div>
              </a>
            ))}
          </div>
        </section>
        <section className="cast-teaser section" id="cast">
          <p className="eyebrow">AN ENSEMBLE OF ABSOLUTE INDIVIDUALS</p>
          <h2>16 characters. No background extras.</h2>
          <a className="text-link" href="/cast">
            Meet the whole cast <ArrowUpRight size={20} />
          </a>
        </section>
      </main>
      <footer>
        <a className="wordmark" href="/">
          plot<span>twist</span>✳
        </a>
        <p>For the plot. Not a psychological assessment.</p>
        <a href="/about">
          How it works <ArrowUpRight size={16} />
        </a>
      </footer>
    </>
  );
}
