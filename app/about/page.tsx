import { Header, Footer } from '@/components/plot/chrome';
import Privacy from '@/components/plot/privacy';
import { ArrowUpRight } from 'lucide-react';
export const metadata = { title: 'Behind the scenes · Plot Twist' };
export default function Page() {
  return (
    <>
      <Header />
      <main className="about-page">
        <div className="page-intro">
          <p className="eyebrow">THE DIRECTOR’S COMMENTARY</p>
          <h1>
            A little self-discovery.
            <br />
            <em>Absolutely no diagnosis.</em>
          </h1>
          <p>
            Plot Twist turns everyday choices into an original sitcom character.
            <br />
            Built for a good laugh, a useful conversation, and maybe a little
            recognition.
          </p>
        </div>
        <div className="about-grid">
          <aside>
            <a href="#idea">The idea</a>
            <a href="#scoring">The scoring</a>
            <a href="#privacy">Your privacy</a>
            <a href="#engineering">The engineering</a>
          </aside>
          <article>
            <section id="idea">
              <p className="eyebrow">01 / THE IDEA</p>
              <h2>People are more interesting than a score.</h2>
              <p>
                The internet has enough ways to rank you. This is a different
                kind of mirror: warm, a little cheeky, and open about how it
                works. Choose your way through a dozen everyday dilemmas and
                meet the character your answers suggest.
              </p>
              <p>
                All 16 characters and all 36 scenes are original. This is not
                MBTI, an official 16Personalities test, or a psychological
                instrument. The four fictional dimensions are a storytelling
                device, not a measure of ability, health, or worth.
              </p>
            </section>
            <section id="scoring">
              <p className="eyebrow">02 / THE SCORING</p>
              <h2>No black box. Just your choices.</h2>
              <p>
                Each episode has three scenes for each of four dimensions. Every
                choice contributes −3, −1, +1, or +3 to one dimension. We add
                those contributions and map the four directions to one of 16
                characters.
              </p>
              <div className="axis-explainer">
                {[
                  [
                    'Quiet presence ↔ Room energy',
                    'How you tend to enter a social moment.',
                  ],
                  [
                    'Heart first ↔ Head first',
                    'Whether you start with feelings or analysis—not whether you have either.',
                  ],
                  [
                    'Improv mode ↔ A good plan',
                    'How much structure you reach for.',
                  ],
                  [
                    'Here & now ↔ What if?',
                    'Whether your attention goes to what exists or what could.',
                  ],
                ].map(([name, desc]) => (
                  <div key={name}>
                    <h3>{name}</h3>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
              <p>
                The markers show direction and strength within this episode.
                They are not confidence percentages. A close call is displayed
                as a close call. With the current complete episodes, three odd
                contributions per dimension cannot sum to zero; if a future
                supported format allows a tie, our engine uses the first pole
                and explicitly labels it balanced.
              </p>
              <p>
                Change an answer and we recompute from the full answer set. No
                cached personality label. No AI guessing who you are. Different
                contexts can bring out different parts of you.
              </p>
            </section>
            <section id="privacy">
              <p className="eyebrow">03 / YOUR PRIVACY</p>
              <h2>Your lore stays yours.</h2>
              <p>
                No account, advertising tracker, or analytics SDK. Your
                unfinished episodes and answers are stored in this browser’s
                local storage, separately for each episode. The app does not
                send quiz answers to a server during normal play.
              </p>
              <p>
                Share links contain an episode version and four broad aggregate
                tendencies. Strong scores are grouped together to avoid
                revealing exact extreme answers. They do not include answer
                history or names. Anyone with the link can read those shared
                tendencies. Hosting providers may receive ordinary request
                metadata, including the shared URL. Downloaded cards are
                generated in your browser.
              </p>
              <p>
                You can erase all saved episodes below. This clears local
                copies; it cannot revoke a link or card you already shared.
              </p>
              <Privacy />
            </section>
            <section id="engineering">
              <p className="eyebrow">04 / THE ENGINEERING</p>
              <h2>A playful surface. Inspectable foundations.</h2>
              <p>
                The scoring core is a pure TypeScript module with runtime
                validation, property tests, versioned result links, and explicit
                failure states. The React interface runs on a
                Cloudflare-compatible server, while scoring stays local and
                works without an AI service or API key.
              </p>
              <p>
                The open-source repository includes system architecture,
                reproducible test fixtures, a Python reference implementation,
                and evaluation challenges with intentionally broken baselines
                and verified golden solutions.
              </p>
              <a
                className="text-link"
                href="https://github.com/shi1720/plottwist"
                target="_blank"
                rel="noreferrer"
              >
                Read the source and engineering notes <ArrowUpRight size={19} />
              </a>
              <p className="credits">
                Created by Shivam Gupta with AI-assisted implementation and
                original AI-generated character artwork. Character writing,
                scoring rules, test cases, and limitations are included in the
                repository.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
