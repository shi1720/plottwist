'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { CHARACTERS } from '@/lib/content/characters';
import { CharacterArt } from './chrome';
export default function Cast() {
  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const characters = CHARACTERS.filter((c) =>
    `${c.name} ${c.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main className="cast-page">
      <div className="page-intro">
        <p className="eyebrow">THE CASTING DEPARTMENT</p>
        <h1>
          16 characters.
          <br />
          <em>No background extras.</em>
        </h1>
        <p>
          Every group has a lovable menace. A quiet mastermind. Someone with
          snacks.
          <br />
          Which part were you born to play?
        </p>
      </div>
      <div className="cast-toolbar">
        <span>{characters.length} CHARACTERS IN THE ENSEMBLE</span>
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
            <CharacterArt family={c.family} />
            <h2>{c.name}</h2>
            <p>{c.tagline}</p>
            <div className="cast-card-tags">
              {c.tags.slice(0, 2).join(' · ')}
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
