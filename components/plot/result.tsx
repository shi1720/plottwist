"use client";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Copy,
  Download,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  LOCAL_RESULT_KEY,
  matchesLocalResult,
} from "@/lib/engine/result-context";
import { CHARACTER_STORIES } from "@/lib/content/stories";
import { getCharacter } from "@/lib/content/characters";
import { getPack } from "@/lib/content/packs";
import { decodeResult, encodeResult } from "@/lib/engine/sharing";
import { parseSession, STORAGE_KEY } from "@/lib/engine/storage";
import { scoreAnswers } from "@/lib/engine/scoring";
import type { Result } from "@/lib/engine/types";
import { CharacterArt } from "./chrome";
import { downloadCard } from "@/lib/engine/card";
export default function ResultView() {
  const [result, setResult] = useState<Result | null>(null),
    [error, setError] = useState(""),
    [copied, setCopied] = useState(false),
    [feedback, setFeedback] = useState(""),
    [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    function readResult() {
      try {
        const token = new URLSearchParams(location.search).get("r") ?? "";
        let parsed = decodeResult(token);
        try {
          const nonce = new URLSearchParams(location.hash.slice(1)).get(
            "local",
          );
          const saved = parseSession(
            localStorage.getItem(`${STORAGE_KEY}.${parsed.packId}`),
          );
          if (
            saved &&
            saved.answers.length === 12 &&
            matchesLocalResult(
              sessionStorage.getItem(`${LOCAL_RESULT_KEY}.${parsed.packId}`),
              token,
              nonce,
              saved.revision,
            ) &&
            encodeResult(parsed.packId, saved.answers) === token
          ) {
            parsed = scoreAnswers(getPack(parsed.packId), saved.answers);
          }
        } catch {
          /* Shared summaries also work when browser storage is unavailable. */
        }
        setResult(parsed);
        setShareUrl(`${location.origin}/result?r=${encodeURIComponent(token)}`);
      } catch {
        setError("Invalid result");
      }
    }
    readResult();
    // Clearing saved answers in another tab also removes visible receipts here.
    function onStorage(event: StorageEvent) {
      if (event.key === null || event.key.startsWith(STORAGE_KEY)) readResult();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  if (error)
    return (
      <main id="main-content" className="center-page">
        <p className="eyebrow">Result unavailable</p>
        <h1>This result link is not valid.</h1>
        <p>
          Ask the sender for a new link, or take the quiz to get your own
          result.
        </p>
        <a className="primary-button" href="/play?pack=pilot">
          Take the quiz <ArrowRight size={20} />
        </a>
      </main>
    );
  if (!result)
    return (
      <main id="main-content" className="center-page">
        <p role="status">Loading the result…</p>
      </main>
    );
  const character = getCharacter(result.code),
    pack = getPack(result.packId);
  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setFeedback("Result link copied.");
    } catch {
      setFeedback(
        "Copy is unavailable here. Select the link below to copy it manually.",
      );
    }
  }
  return (
    <main id="main-content" className="result-page">
      <div className="result-intro">
        <p className="eyebrow">
          {result.evidence.length ? "Your result" : "Shared result"}
        </p>
        <h1>
          {result.evidence.length
            ? "Meet your character."
            : "Meet the character."}
        </h1>
        <p>{pack.title} · Based on 12 choices</p>
      </div>
      <div className="result-layout">
        <section className={`result-poster ${character.color}`}>
          <div className="poster-top">
            <span>Plot Twist character</span>
            <span>No. {parseInt(character.code, 2) + 1}</span>
          </div>
          <CharacterArt code={character.code} eager />
          <p className="eyebrow">Character</p>
          <h2>{character.name}</h2>
          <p className="poster-tagline">{character.tagline}</p>
          <div className="character-tags">
            {character.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="poster-bottom">
            <span>
              Plot <em>Twist</em>
            </span>
            <span>Made for fun.</span>
          </div>
          <div className="share-actions">
            <button className="primary-button" onClick={copy}>
              {copied ? <Check size={18} /> : <Copy size={18} />}{" "}
              {copied ? "Link copied" : "Copy result link"}
            </button>
            <button
              className="secondary-button"
              onClick={async () => {
                try {
                  await downloadCard(character, pack.title);
                  setFeedback("Your character card is downloaded.");
                } catch {
                  setFeedback(
                    "The card could not download. You can still share the result link.",
                  );
                }
              }}
            >
              <Download size={18} /> Download card
            </button>
          </div>
          <p className="privacy-note">
            This link includes the character and four broad tendencies.
            Individual answers are not included.
          </p>
          <p className="feedback" role="status">
            {feedback}
          </p>
          {feedback.startsWith("Copy is") && (
            <input
              className="share-fallback"
              readOnly
              value={shareUrl}
              aria-label="Shareable result URL"
              onFocus={(e) => e.target.select()}
            />
          )}
        </section>
        <section className="result-story">
          <div className="story-block">
            <p className="eyebrow">
              {result.evidence.length
                ? "What your answers suggest"
                : "About this character"}
            </p>
            <h2>
              {result.evidence.length
                ? "Does this sound like you?"
                : character.tagline}
            </h2>
            <p>{character.description}</p>
            <blockquote>“{character.quote}”</blockquote>
          </div>
          <details className="character-cold-open">
            <summary>
              A scene with this character{" "}
              <span className="fiction-note">· Fiction, for fun</span>
            </summary>
            <p>{CHARACTER_STORIES[character.code].coldOpen}</p>
          </details>
          <div className="roast-box">
            <p className="eyebrow">One affectionate observation</p>
            <p>{character.roast}</p>
          </div>
          <div className="strength-grid">
            <div>
              <p className="eyebrow">What this character brings</p>
              <p>{character.strength}</p>
            </div>
            <div>
              <p className="eyebrow">Something to try</p>
              <p>{character.growth}</p>
            </div>
          </div>
        </section>
      </div>
      <section className="result-breakdown">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {result.evidence.length ? "Your answers" : "The shared result"}
            </p>
            <h2>How this result was worked out.</h2>
          </div>
          <a className="text-link" href="/about#scoring">
            How scoring works <ArrowUpRight size={18} />
          </a>
        </div>
        {result.evidence.length > 0 && (
          <div className="choice-callback">
            <p className="eyebrow">One of your choices</p>
            <p>
              {
                pack.scenes.find((s) => s.id === result.evidence[0].sceneId)
                  ?.title
              }
            </p>
            <blockquote>“{result.evidence[0].text}”</blockquote>
            <p>
              This is one of your saved answers. All 12 choices contribute to
              the result.
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
                  {t.strength === "balanced"
                    ? "A close call"
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
              Show my 12 choices{" "}
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
                    {result.traits[e.weights.findIndex((w) => w !== 0)]?.axis}:{" "}
                    {e.weights.find((w) => w !== 0)! > 0 ? "+" : ""}
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
          <p className="eyebrow">Compare characters</p>
          <h2>Who would you pair up with?</h2>
          <p>
            Choose another character to see where their approaches overlap and
            differ.
          </p>
          <a className="primary-button" href={`/chemistry?a=${result.code}`}>
            Compare with another character <ArrowRight size={20} />
          </a>
        </div>
        <div className="next-links">
          <a href={`/play?pack=${result.packId}`}>
            <RotateCcw size={18} />{" "}
            {result.evidence.length > 0
              ? "Revisit my answers"
              : "Play this episode"}
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
