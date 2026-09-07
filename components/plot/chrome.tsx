import { CHARACTER_STORIES, characterArtPath } from '@/lib/content/stories';
import { ArrowUpRight } from 'lucide-react';
export function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="Plot Twist home">
        Plot <span>Twist</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="/#episodes">Episodes</a>
        <a href="/cast">Characters</a>
        <a href="/chemistry">Compare characters</a>
      </nav>
      <a className="small-button" href="/play?pack=pilot">
        Take the quiz <ArrowUpRight size={16} />
      </a>
    </header>
  );
}
export function Footer() {
  return (
    <footer>
      <a className="wordmark" href="/">
        Plot <span>Twist</span>
      </a>
      <p>A personality quiz for fun, not a psychological assessment.</p>
      <a href="/about">
        About & privacy <ArrowUpRight size={16} />
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
