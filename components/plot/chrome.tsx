import { CHARACTER_STORIES, characterArtPath } from '@/lib/content/stories';
import { ArrowUpRight } from 'lucide-react';
export function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="Plot Twist home">
        plot<span>twist</span>
        <span className="logo-dot">✳</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="/#episodes">The episodes</a>
        <a href="/cast">The cast</a>
        <a href="/chemistry">Cast chemistry</a>
      </nav>
      <a className="small-button" href="/play?pack=pilot">
        Find my character <ArrowUpRight size={16} />
      </a>
    </header>
  );
}
export function Footer() {
  return (
    <footer>
      <a className="wordmark" href="/">
        plot<span>twist</span>✳
      </a>
      <p>For the plot. Not a psychological assessment.</p>
      <a href="/about">
        Behind the scenes <ArrowUpRight size={16} />
      </a>
    </footer>
  );
}
export function CharacterArt({
  code,
  className = '',
  eager = false,
}: {
  code: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <img
      className={`character-art ${className}`}
      src={characterArtPath(code)}
      alt={CHARACTER_STORIES[code]?.artAlt ?? 'Plot Twist character'}
      width={640}
      height={640}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
