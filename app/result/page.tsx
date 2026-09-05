import { Header, Footer } from '@/components/plot/chrome';
import ResultView from '@/components/plot/result';
export const metadata = {
  title: 'Your character · Plot Twist',
  robots: { index: false, follow: true },
};
export default function Page() {
  return (
    <>
      <Header />
      <ResultView />
      <Footer />
    </>
  );
}
