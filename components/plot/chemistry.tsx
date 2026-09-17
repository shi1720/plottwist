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
    [message, setMessage] = useState(''),
    [ready, setReady] = useState(false);
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (CHARACTERS.some((c) => c.code === p.get('a'))) setA(p.get('a')!);
    if (CHARACTERS.some((c) => c.code === p.get('b'))) setB(p.get('b')!);
    setReady(true);
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
    <main id="main-content" className="chemistry-page">
      <div className="page-intro">
        <p className="eyebrow">Compare characters</p>
        <h1>How would these two get along?</h1>
        <p>
          Choose two characters to compare their four tendencies. This is a
          fictional pairing, not a prediction about your relationships.
        </p>
      </div>
      <div className="chemistry-picker">
        {[result.left, result.right].map((c, i) => (
          <section key={i} className={`co-star ${c.color}`}>
            <p className="eyebrow">
              {i === 0 ? 'First character' : 'Second character'}
            </p>
            <Select
              disabled={!ready}
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
          disabled={!ready}
          onClick={() => {
            const array = crypto.getRandomValues(new Uint8Array(2));
            setA(CHARACTERS[array[0] % 16].code);
            setB(CHARACTERS[array[1] % 16].code);
            setMessage('Two new characters selected.');
          }}
        >
          <Shuffle size={17} /> Surprise me
        </button>
        <button
          className="secondary-button"
          disabled={!ready}
          onClick={async () => {
            const url = `${location.origin}/chemistry?a=${a}&b=${b}`;
            try {
              await navigator.clipboard.writeText(url);
              setMessage('Link copied.');
            } catch {
              setMessage(`Copy this link: ${url}`);
            }
          }}
        >
          <Copy size={17} /> Copy comparison link
        </button>
      </div>
      <p className="feedback" role="status">
        {message}
      </p>
      <section className="chemistry-verdict" aria-live="polite">
        <p className="eyebrow">The pairing</p>
        <h2>{result.title}</h2>
        <p className="premise">{result.premise}</p>
        <div className="shared-count">
          <span>{result.shared} shared tendencies</span>
          <span>{result.differences} different tendencies</span>
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
          Take the quiz <ArrowRight size={20} />
        </a>
      </div>
    </main>
  );
}
