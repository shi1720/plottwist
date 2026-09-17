'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main-content" className="center-page">
      <p className="eyebrow">Something went wrong</p>
      <h1>This page could not load.</h1>
      <p>
        Please try again. If your answers were saved in this browser, you can
        resume the quiz.
      </p>
      <button className="primary-button" onClick={reset}>
        Try again
      </button>
      <a className="text-link" href="/">
        Back to home
      </a>
    </main>
  );
}
