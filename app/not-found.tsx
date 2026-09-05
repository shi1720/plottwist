import { Header, Footer } from '@/components/plot/chrome';
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="center-page">
        <p className="eyebrow">404 / DELETED SCENE</p>
        <h1>This wasn’t in the script.</h1>
        <p>The page you are looking for is not part of this season.</p>
        <a href="/" className="primary-button">
          Back to the pilot →
        </a>
      </main>
      <Footer />
    </>
  );
}
