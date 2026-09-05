'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="center-page">
      <p className="eyebrow">UNSCHEDULED PLOT TWIST</p>
      <h1>Let’s try that scene again.</h1>
      <p>
        Something did not load correctly. Your saved answers are still on this
        device.
      </p>
      <button className="primary-button" onClick={reset}>
        Try again
      </button>
      <a className="text-link" href="/">
        Back to the episodes
      </a>
    </main>
  );
}
