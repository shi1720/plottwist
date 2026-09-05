'use client';
import { useEffect, useState } from 'react';
import { Shuffle, Copy, ArrowRight } from 'lucide-react';
import { CHARACTERS } from '@/lib/content/characters';
import { compareCharacters } from '@/lib/engine/chemistry';
import { CharacterArt } from './chrome';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
export default function Chemistry() {
  const [a, setA] = useState('1001'),
    [b, setB] = useState('0110'),
    [message, setMessage] = useState('');
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (CHARACTERS.some((c) => c.code === p.get('a'))) setA(p.get('a')!);
    if (CHARACTERS.some((c) => c.code === p.get('b'))) setB(p.get('b')!);
  }, []);
  const result = compareCharacters(a, b);
  const items = CHARACTERS.map((c) => ({ value: c.code, label: c.name }));
  function change(which: 'a' | 'b', value: string | null) {
    if (value) {
      if (which === 'a') setA(value);
      else setB(value);
      setMessage('');
    }
  }
  return (
    <main className="chemistry-page">
      <div className="page-intro">
        <p className="eyebrow">THE CROSSOVER EPISODE</p>
        <h1>
          Good friends.
          <br />
          <em>Excellent television.</em>
        </h1>
        <p>
          Pick two characters. Let the fictional casting department do its
          thing.
          <br />
          No compatibility scores. Just a very plausible subplot.
        </p>
      </div>
      <div className="chemistry-picker">
        {[result.left, result.right].map((c, i) => (
          <section key={i} className={`co-star ${c.color}`}>
            <p className="eyebrow">
              {i === 0 ? 'CHARACTER ONE' : 'CHARACTER TWO'}
            </p>
            <Select
              items={items}
              value={i === 0 ? a : b}
              onValueChange={(value) => change(i === 0 ? 'a' : 'b', value)}
            >
              <SelectTrigger
                className="character-select"
                aria-label={i === 0 ? 'Character one' : 'Character two'}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHARACTERS.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CharacterArt code={c.code} />
            <p>{c.tagline}</p>
          </section>
        ))}
        <span className="chemistry-plus" aria-hidden="true">
          &
        </span>
      </div>
      <div className="mixer-actions">
        <button
          className="secondary-button"
          onClick={() => {
            const array = crypto.getRandomValues(new Uint8Array(2));
            setA(CHARACTERS[array[0] % 16].code);
            setB(CHARACTERS[array[1] % 16].code);
            setMessage('A new double act has entered the chat.');
          }}
        >
          <Shuffle size={17} /> Surprise me
        </button>
        <button
          className="secondary-button"
          onClick={async () => {
            const url = `${location.origin}/chemistry?a=${a}&b=${b}`;
            try {
              await navigator.clipboard.writeText(url);
              setMessage('Your crossover link is copied.');
            } catch {
              setMessage(`Copy this link: ${url}`);
            }
          }}
        >
          <Copy size={17} /> Share this duo
        </button>
      </div>
      <p className="feedback" role="status">
        {message}
      </p>
      <section className="chemistry-verdict" aria-live="polite">
        <p className="eyebrow">YOUR SITCOM DYNAMIC</p>
        <h2>{result.title}</h2>
        <p className="premise">{result.premise}</p>
        <div className="shared-count">
          <span>{result.shared} shared instincts</span>
          <span>{result.differences} plot opportunities</span>
        </div>
        <div className="duo-tips">
          {result.tips.map((tip, i) => (
            <div key={i}>
              <span>0{i + 1}</span>
              <p>{tip}</p>
            </div>
          ))}
        </div>
        <p className="method-note">
          Fictional narrative chemistry based on four playful tendencies. Real
          relationships are much bigger than a quiz.
        </p>
      </section>
      <div className="cast-cta">
        <h2>Still figuring out your part?</h2>
        <a href="/play?pack=pilot" className="primary-button">
          Find my character <ArrowRight size={20} />
        </a>
      </div>
    </main>
  );
}
