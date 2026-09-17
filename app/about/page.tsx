import { Header, Footer } from '@/components/plot/chrome';
import Privacy from '@/components/plot/privacy';
import { ArrowUpRight } from 'lucide-react';
export const metadata = { title: 'About & privacy · Plot Twist' };
export default function Page() {
  return (
    <>
      <Header />
      <main id="main-content" className="about-page">
        <div className="page-intro">
          <p className="eyebrow">About Plot Twist</p>
          <h1>A quiz with a sense of humor.</h1>
          <p>
            Twelve choices, sixteen original characters, and perhaps someone you
            recognize. Here is how it works and what happens to your answers.
          </p>
        </div>
        <div className="about-grid">
          <aside aria-label="On this page">
            <a href="#idea">The idea</a>
            <a href="#scoring">How scoring works</a>
            <a href="#privacy">Your privacy</a>
            <a href="#engineering">Who made it</a>
          </aside>
          <article>
            <section id="idea">
              <h2>Made for a conversation.</h2>
              <p>
                Plot Twist is a short quiz about ordinary decisions: whether to
                make the plan, what to say to a friend, or how to handle a
                change of course. Your answers suggest one of sixteen fictional
                characters.
              </p>
              <p>
                It is entertainment, not a psychological assessment. It does not
                measure ability or mental health, and it is not affiliated with
                MBTI or 16Personalities. You may get a different character in
                another setting.
              </p>
            </section>
            <section id="scoring">
              <h2>Four tendencies, twelve choices.</h2>
              <p>
                Each quiz includes three questions about each of these
                tendencies. Neither end is better than the other.
              </p>
              <div className="axis-explainer">
                {[
                  [
                    'Quiet presence / Room energy',
                    'Whether you prefer a quieter exchange or a wider social circle.',
                  ],
                  [
                    'Heart first / Head first',
                    'Whether you begin a decision with people’s feelings or practical analysis.',
                  ],
                  [
                    'Improv mode / A good plan',
                    'Whether you prefer to adapt as you go or agree on a plan.',
                  ],
                  [
                    'Here & now / What if?',
                    'Whether you focus on the present situation or imagine other possibilities.',
                  ],
                ].map(([title, description]) => (
                  <div key={title}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                ))}
              </div>
              <p>
                Each answer adds a small weight to one tendency. The combined
                directions select your character. The bars describe your choices
                in this quiz; they are not scientific confidence scores.
              </p>
              <p>
                You can review or change any answer. Scoring runs in your
                browser using fixed rules. No AI service analyzes your answers.
              </p>
              <a
                className="text-link"
                href="https://github.com/shi1720/plottwist/blob/main/docs/ARCHITECTURE.md"
              >
                Read the scoring rules in detail <ArrowUpRight size={17} />
              </a>
            </section>
            <section id="privacy">
              <h2>Your answers stay in this browser.</h2>
              <p>
                No account is required. The app saves each quiz locally so you
                can return to it. It does not send your answers to a server
                during play, and it includes no advertising or analytics
                trackers.
              </p>
              <p>
                A shared link contains the character and four broad tendencies,
                not individual answers or your name. Anyone with the link can
                read that result. A downloaded card shows the character. Cards
                are created in your browser.
              </p>
              <p>
                The hosting provider may receive ordinary request information,
                including the URL you visit. Shared links and downloaded cards
                cannot be revoked.
              </p>
              <p>
                Use the button below to delete saved quiz answers from this
                browser. It does not delete anything you have already shared.
              </p>
              <Privacy />
            </section>
            <section id="engineering">
              <h2>Created by Shivam Gupta.</h2>
              <p>
                Plot Twist is an open-source project. The code, scoring rules,
                tests, and character writing are available on GitHub.
              </p>
              <a
                className="text-link"
                href="https://github.com/shi1720/plottwist"
              >
                Explore the project <ArrowUpRight size={18} />
              </a>
              <p className="credits">
                Built with AI-assisted development and original AI-generated
                character illustrations. The characters are fictional; the
                project’s methods and limitations are documented in the
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
