import { Header, Footer } from '@/components/plot/chrome';
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="center-page">
        <p className="eyebrow">404</p>
        <h1>Page not found.</h1>
        <p>The address may be incorrect, or the page may have moved.</p>
        <a href="/" className="primary-button">
          Back to home →
        </a>
      </main>
      <Footer />
    </>
  );
}
