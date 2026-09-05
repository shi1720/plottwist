'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { CHARACTER_STORIES } from '@/lib/content/stories';
import { CHARACTERS } from '@/lib/content/characters';
import { CharacterArt } from './chrome';
export default function Cast() {
  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const characters = CHARACTERS.filter((c) =>
    `${c.name} ${c.tags.join(' ')} ${CHARACTER_STORIES[c.code].entrance} ${CHARACTER_STORIES[c.code].prop}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <main className="cast-page">
      <div className="cast-opening">
        <div>
          <p className="eyebrow">THE CAST · 16 ORIGINAL CHARACTERS</p>
          <h1>
            One dinner plan.
            <br />
            <em>Sixteen ways to derail it.</em>
          </h1>
          <p>
            The reservation is gone. The group chat is typing.
            <br />
            Meet the people who turn a minor inconvenience into a season finale.
          </p>
          <a className="text-link" href="/play?pack=pilot">
            Which one are you? Take the quiz <ArrowUpRight size={19} />
          </a>
        </div>
        <aside className="cold-open-script" aria-label="The opening scene">
          <span className="script-label">
            COLD OPEN / EXT. RESTAURANT / 7:03 PM
          </span>
          <p>
            <strong>THE SAGE</strong> I have a backup reservation.
          </p>
          <p>
            <strong>THE MENACE</strong> I have a better idea.
          </p>
          <p>
            <strong>THE DETECTIVE</strong> Those are famously different things.
          </p>
          <span className="script-cut">[ cue theme music ]</span>
        </aside>
      </div>
      <div className="cast-toolbar">
        <span role="status">
          {characters.length} CHARACTERS IN THE ENSEMBLE
        </span>
        <label className="search-field">
          <Search size={18} />
          <input
            disabled={!ready}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a character or a vibe…"
            aria-label="Search characters"
          />
        </label>
      </div>
      <div className="cast-grid">
        {characters.map((c) => (
          <a
            className={`cast-card ${c.color}`}
            key={c.code}
            href={`/cast/${c.code}`}
          >
            <div className="card-top">
              <span>
                CAST № {String(parseInt(c.code, 2) + 1).padStart(2, '0')}
              </span>
              <ArrowUpRight size={19} />
            </div>
            <CharacterArt code={c.code} />
            <h2>{c.name}</h2>
            <p>{CHARACTER_STORIES[c.code].entrance}</p>
            <div className="cast-card-tags">
              <span>CARRIES</span>
              {CHARACTER_STORIES[c.code].prop}
            </div>
          </a>
        ))}
      </div>
      {characters.length === 0 && (
        <div className="empty-state">
          <h2>No character answers to that name.</h2>
          <p>Try “warm”, “quiet”, or “chaos”.</p>
          <button className="secondary-button" onClick={() => setQuery('')}>
            Show the whole cast
          </button>
        </div>
      )}
      <div className="cast-cta">
        <h2>
          Enough about them.
          <br />
          Let’s talk about you.
        </h2>
        <a className="primary-button" href="/play?pack=pilot">
          Find my character <ArrowUpRight size={20} />
        </a>
      </div>
    </main>
  );
}
