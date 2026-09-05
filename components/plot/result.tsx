'use client';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Copy,
  Download,
  Check,
  RotateCcw,
} from 'lucide-react';
import { CHARACTER_STORIES } from '@/lib/content/stories';
import { getCharacter } from '@/lib/content/characters';
import { getPack } from '@/lib/content/packs';
import { decodeResult, encodeResult } from '@/lib/engine/sharing';
import { parseSession, STORAGE_KEY } from '@/lib/engine/storage';
import { scoreAnswers } from '@/lib/engine/scoring';
import type { Result } from '@/lib/engine/types';
import { CharacterArt } from './chrome';
import { downloadCard } from '@/lib/engine/card';
export default function ResultView() {
  const [result, setResult] = useState<Result | null>(null),
    [error, setError] = useState(''),
    [copied, setCopied] = useState(false),
    [feedback, setFeedback] = useState(''),
    [shareUrl, setShareUrl] = useState('');
  useEffect(() => {
    try {
      const token = new URLSearchParams(location.search).get('r') ?? '';
      let parsed = decodeResult(token);
      try {
        const saved = parseSession(
          localStorage.getItem(`${STORAGE_KEY}.${parsed.packId}`),
        );
        if (
          saved &&
          saved.answers.length === 12 &&
          encodeResult(parsed.packId, saved.answers) === token
        )
          parsed = scoreAnswers(getPack(parsed.packId), saved.answers);
      } catch {
        /* Shared result works without local evidence. */
      }
      setResult(parsed);
      setShareUrl(`${location.origin}/result?r=${encodeURIComponent(token)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to read this result');
    }
  }, []);
  if (error)
    return (
      <main className="center-page">
        <p className="eyebrow">A LITTLE PLOT HOLE</p>
        <h1>This result wandered off.</h1>
        <p>{error}. Ask for a fresh link or start your own episode.</p>
        <a className="primary-button" href="/play?pack=pilot">
          Find my character <ArrowRight size={20} />
        </a>
      </main>
    );
  if (!result)
    return (
      <main className="center-page">
        <p role="status">Rolling the credits…</p>
      </main>
    );
  const character = getCharacter(result.code),
    pack = getPack(result.packId);
  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setFeedback('Result link copied. Send it to your co-stars.');
    } catch {
      setFeedback(
        'Copy is unavailable here. Select the link below to copy it manually.',
      );
    }
  }
  return (
    <main className="result-page">
      <div className="result-intro">
        <p className="eyebrow">THE RESULTS ARE IN. THE WRITERS HAVE NOTES.</p>
        <h1>
          Oh, you’re <em>that</em> character.
        </h1>
        <p>{pack.title} · Your original Plot Twist archetype</p>
      </div>
      <div className="result-layout">
        <section className={`result-poster ${character.color}`}>
          <div className="poster-top">
            <span>OFFICIALLY UNOFFICIAL</span>
            <span>CAST № {parseInt(character.code, 2) + 1}</span>
          </div>
          <CharacterArt code={character.code} eager />
          <p className="eyebrow">YOU ARE</p>
          <h2>{character.name}</h2>
          <p className="poster-tagline">{character.tagline}</p>
          <div className="character-tags">
            {character.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="poster-bottom">
            <span>
              plot<em>twist</em> ✳
            </span>
            <span>FOR THE PLOT.</span>
          </div>
        </section>
        <section className="result-story">
          <div className="story-block">
            <p className="eyebrow">YOUR CHARACTER BRIEF</p>
            <h2>A little too familiar?</h2>
            <p>{character.description}</p>
            <blockquote>“{character.quote}”</blockquote>
          </div>
          <div className="character-cold-open">
            <p className="eyebrow">
              YOUR COLD OPEN · A LITTLE CHARACTER FICTION
            </p>
            <p>{CHARACTER_STORIES[character.code].coldOpen}</p>
            <span>[ cue your extremely specific theme music ]</span>
          </div>
          <div className="roast-box">
            <p className="eyebrow">A LOVINGLY WRITTEN ROAST</p>
            <p>{character.roast}</p>
          </div>
          <div className="strength-grid">
            <div>
              <p className="eyebrow">YOUR SUPERPOWER</p>
              <p>{character.strength}</p>
            </div>
            <div>
              <p className="eyebrow">NEXT SEASON’S ARC</p>
              <p>{character.growth}</p>
            </div>
          </div>
          <div className="share-actions">
            <button className="primary-button" onClick={copy}>
              {copied ? <Check size={18} /> : <Copy size={18} />}{' '}
              {copied ? 'Link copied' : 'Share my character'}
            </button>
            <button
              className="secondary-button"
              onClick={async () => {
                try {
                  await downloadCard(character, pack.title);
                  setFeedback('Your character card is downloaded.');
                } catch {
                  setFeedback(
                    'The card could not download. You can still share the result link.',
                  );
                }
              }}
            >
              <Download size={18} /> Save card
            </button>
          </div>
          <p className="privacy-note">
            Your link shares this character and four broad tendencies, not your
            answer history. Strong scores are grouped to reveal less detail.
          </p>
          <p className="feedback" role="status">
            {feedback}
          </p>
          {feedback.startsWith('Copy is') && (
            <input
              className="share-fallback"
              readOnly
              value={shareUrl}
              aria-label="Shareable result URL"
              onFocus={(e) => e.target.select()}
            />
          )}
        </section>
      </div>
      <section className="result-breakdown">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE RECEIPTS</p>
            <h2>How your plot came together.</h2>
          </div>
          <a className="text-link" href="/about#scoring">
            No mysterious algorithm <ArrowUpRight size={18} />
          </a>
        </div>
        {result.evidence.length > 0 && (
          <div className="choice-callback">
            <p className="eyebrow">PREVIOUSLY, IN YOUR EPISODE…</p>
            <p>
              {
                pack.scenes.find((s) => s.id === result.evidence[0].sceneId)
                  ?.title
              }
            </p>
            <blockquote>“{result.evidence[0].text}”</blockquote>
            <p>
              A line you actually chose. Your character uses all 12 answers;
              this is one scene, not the whole story.
            </p>
          </div>
        )}
        <div className="trait-grid">
          {result.traits.map((t) => (
            <div className="trait-card" key={t.axis}>
              <div className="trait-labels">
                <span>{t.low}</span>
                <span>{t.high}</span>
              </div>
              <div
                className="trait-track"
                role="img"
                aria-label={`${t.lean}: ${t.strength} tendency`}
              >
                <span className="trait-midpoint" />
                <span
                  className="trait-marker"
                  style={{ left: `${Math.max(3, Math.min(97, t.score))}%` }}
                />
              </div>
              <p>
                <strong>{t.lean}</strong>
                <span>
                  {t.strength === 'balanced'
                    ? 'A close call'
                    : `${t.strength} tendency`}
                </span>
              </p>
            </div>
          ))}
        </div>
        <p className="method-note">
          These are playful tendencies from 12 choices, not confidence scores or
          a validated personality assessment. Another day—or episode—may reveal
          a different side of you.
        </p>
        {result.evidence.length > 0 && (
          <details className="answer-receipts">
            <summary>
              Show my 12 choices{' '}
              <span>Only visible from this device’s saved episode</span>
            </summary>
            <ol>
              {result.evidence.map((e) => (
                <li key={e.sceneId}>
                  <strong>
                    {pack.scenes.find((s) => s.id === e.sceneId)?.title}
                  </strong>
                  <p>{e.text}</p>
                  <span>
                    {result.traits[e.weights.findIndex((w) => w !== 0)]?.axis}:{' '}
                    {e.weights.find((w) => w !== 0)! > 0 ? '+' : ''}
                    {e.weights.find((w) => w !== 0)}
                  </span>
                </li>
              ))}
            </ol>
          </details>
        )}
      </section>
      <section className="result-next">
        <div>
          <p className="eyebrow">EVERY MAIN CHARACTER NEEDS A CO-STAR</p>
          <h2>Who brings out your best subplot?</h2>
          <p>
            Mix two characters. Discover your very unofficial sitcom dynamic.
          </p>
          <a className="primary-button" href={`/chemistry?a=${result.code}`}>
            Find our cast chemistry <ArrowRight size={20} />
          </a>
        </div>
        <div className="next-links">
          <a href={`/play?pack=${result.packId}`}>
            <RotateCcw size={18} />{' '}
            {result.evidence.length > 0
              ? 'Revisit my answers'
              : 'Play this episode'}
          </a>
          <a href="/#episodes">
            Try another episode <ArrowUpRight size={18} />
          </a>
          <a href="/cast">
            Meet all 16 characters <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}
