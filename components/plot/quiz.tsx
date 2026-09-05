'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getPack, isPackId } from '@/lib/content/packs';
import { encodeResult } from '@/lib/engine/sharing';
import { parseSession, STORAGE_KEY } from '@/lib/engine/storage';
import type { Answer, PackId } from '@/lib/engine/types';
import { useQuizTools } from './webmcp';
export default function Quiz() {
  const [packId, setPackId] = useState<PackId>('pilot');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [cursor, setCursor] = useState(0);
  const [ready, setReady] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [resume, setResume] = useState(false);
  const [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const id = new URLSearchParams(location.search).get('pack') ?? 'pilot';
    if (!isPackId(id)) {
      setError(
        'That episode is not in this season. Choose one of our three episodes.',
      );
      setReady(true);
      return;
    }
    setPackId(id);
    try {
      const saved = parseSession(localStorage.getItem(`${STORAGE_KEY}.${id}`));
      if (saved && saved.packId === id) {
        setAnswers(saved.answers);
        setCursor(saved.cursor);
        setResume(saved.answers.length > 0);
      }
    } catch {
      setStorageOk(false);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (
        (event.key === null || event.key === `${STORAGE_KEY}.${packId}`) &&
        event.newValue === null
      ) {
        setAnswers([]);
        setCursor(0);
        setResume(false);
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [packId]);
  const pack = getPack(packId),
    scene = pack.scenes[cursor],
    selected = answers.find((a) => a.sceneId === scene.id)?.choiceId ?? '';
  useEffect(() => {
    if (!ready || error) return;
    try {
      localStorage.setItem(
        `${STORAGE_KEY}.${packId}`,
        JSON.stringify({
          version: 1,
          packId,
          answers,
          cursor,
          updatedAt: Date.now(),
        }),
      );
    } catch {
      setStorageOk(false);
    }
  }, [ready, answers, cursor, packId, error]);
  const choose = useCallback(
    (choiceId: string) => {
      if (!scene.choices.some((c) => c.id === choiceId))
        throw new Error('Unknown choice for the current scene');
      setAnswers((previous) => {
        const next = [...previous];
        next[cursor] = { sceneId: scene.id, choiceId };
        return next;
      });
    },
    [scene, cursor],
  );
  const next = useCallback(() => {
    if (!selected) return;
    if (cursor === pack.scenes.length - 1) {
      location.assign(
        `/result?r=${encodeURIComponent(encodeResult(packId, answers))}`,
      );
    } else {
      setCursor((c) => c + 1);
      setResume(false);
      requestAnimationFrame(() => heading.current?.focus());
    }
  }, [selected, cursor, pack.scenes.length, packId, answers]);
  useQuizTools({
    ready: ready && !error,
    packId,
    cursor,
    scene,
    answers,
    choose,
    next,
  });
  function reset() {
    setAnswers([]);
    setCursor(0);
    setResume(false);
    heading.current?.focus();
  }
  if (!ready)
    return (
      <main className="center-page">
        <p role="status">Finding your scene…</p>
      </main>
    );
  if (error)
    return (
      <main className="center-page">
        <p className="eyebrow">LOST EPISODE</p>
        <h1>That plot went missing.</h1>
        <p>{error}</p>
        <a className="primary-button" href="/#episodes">
          Choose an episode <ArrowRight size={20} />
        </a>
      </main>
    );
  return (
    <main className="quiz-page">
      <div className="quiz-topline">
        <a href="/#episodes">
          <ArrowLeft size={17} /> All episodes
        </a>
        <span>
          EPISODE {['pilot', 'office', 'friends'].indexOf(packId) + 1} /{' '}
          {pack.title.toUpperCase()}
        </span>
        <button
          className="icon-text"
          onClick={reset}
          aria-label="Restart this episode"
        >
          <RotateCcw size={16} /> Start over
        </button>
      </div>
      <div className="quiz-layout">
        <aside className={`episode-sidebar ${pack.color}`}>
          <div className="eyebrow">YOUR CURRENT STORY</div>
          <h2>{pack.title}</h2>
          <p>{pack.subtitle}</p>
          <div className="sidebar-symbol">
            {packId === 'pilot' ? '✳' : packId === 'office' ? '↗' : '✺'}
          </div>
          <div className="sidebar-note">
            There are no right answers.
            <br />
            Only interesting character development.
          </div>
          <div className="save-note">
            <ShieldCheck size={16} />
            {storageOk
              ? 'Saved on this device'
              : 'Playing without device storage'}
          </div>
        </aside>
        <section className="scene-panel" aria-label="Quiz scene">
          <div className="progress-label">
            <span>SCENE {String(cursor + 1).padStart(2, '0')}</span>
            <span>
              {cursor + 1} of {pack.scenes.length}
            </span>
          </div>
          <Progress
            value={((cursor + 1) / pack.scenes.length) * 100}
            aria-label="Episode progress"
          />
          {resume && (
            <p className="resume-note" role="status">
              Welcome back. Your episode is right where you left it.
            </p>
          )}
          <div className="scene-heading">
            <p className="eyebrow">{scene.setting}</p>
            <h1 ref={heading} tabIndex={-1}>
              {scene.title}
            </h1>
            <p>{scene.detail}</p>
          </div>
          <RadioGroup
            className="choices"
            value={selected}
            onValueChange={(value) => choose(value)}
            aria-label="What would you do?"
          >
            {scene.choices.map((choice, i) => (
              <label
                key={choice.id}
                className={`choice ${selected === choice.id ? 'chosen' : ''}`}
              >
                <RadioGroupItem value={choice.id} className="choice-radio" />
                <span className="choice-letter" aria-hidden="true">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{choice.text}</span>
                {selected === choice.id && (
                  <Check className="choice-check" size={19} />
                )}
              </label>
            ))}
          </RadioGroup>
          <div className="scene-actions">
            <button
              className="icon-text"
              onClick={() => {
                setCursor((c) => Math.max(0, c - 1));
                setResume(false);
                heading.current?.focus();
              }}
              disabled={cursor === 0}
            >
              <ArrowLeft size={17} /> Previous
            </button>
            <button
              className="primary-button"
              disabled={!selected}
              onClick={next}
            >
              {cursor === pack.scenes.length - 1
                ? 'Reveal my character'
                : 'Next scene'}
              <ArrowRight size={20} />
            </button>
          </div>
          <p className="scene-tip">
            Go with your first instinct. You can always change your answer.
          </p>
        </section>
      </div>
    </main>
  );
}
