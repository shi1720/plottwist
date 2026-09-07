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
      .includes(query.trim().toLowerCase()),
  );
  return (
    <main id="main-content" className="cast-page">
      <div className="cast-opening">
        <p className="eyebrow">The cast</p>
        <h1>Sixteen familiar faces.</h1>
        <p>
          Some bring a plan. Some bring snacks. One has a question that will
          take forty minutes to answer. Meet the characters behind the quiz.
        </p>
        <a className="text-link" href="/play?pack=pilot">
          Find your character <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="cast-toolbar">
        <span role="status">
          {characters.length}{' '}
          {characters.length === 1 ? 'character' : 'characters'}
        </span>
        <label className="search-field">
          <Search size={18} />
          <input
            disabled={!ready}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or trait"
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
              <span>{String(parseInt(c.code, 2) + 1).padStart(2, '0')}</span>
              <ArrowUpRight size={19} />
            </div>
            <CharacterArt code={c.code} />
            <h2>{c.name}</h2>
            <p>{CHARACTER_STORIES[c.code].entrance}</p>
            <div className="cast-card-tags">
              <span>Usually carries </span>
              {CHARACTER_STORIES[c.code].prop}
            </div>
          </a>
        ))}
      </div>
      {characters.length === 0 && (
        <div className="empty-state">
          <h2>No matching characters.</h2>
          <p>Try “warm”, “quiet”, or “chaos”.</p>
          <button className="secondary-button" onClick={() => setQuery('')}>
            Show the whole cast
          </button>
        </div>
      )}
      <div className="cast-cta">
        <h2>Find out which one fits your answers.</h2>
        <a className="primary-button" href="/play?pack=pilot">
          Take the quiz <ArrowUpRight size={20} />
        </a>
      </div>
    </main>
  );
}
