import { Header, Footer } from '@/components/plot/chrome';
import Quiz from '@/components/plot/quiz';
export const metadata = { title: 'Find your character · Plot Twist' };
export default function Page() {
  return (
    <>
      <Header />
      <Quiz />
      <Footer />
    </>
  );
}
