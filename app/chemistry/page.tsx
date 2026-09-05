import { Header, Footer } from '@/components/plot/chrome';
import Chemistry from '@/components/plot/chemistry';
export const metadata = { title: 'Cast chemistry · Plot Twist' };
export default function Page() {
  return (
    <>
      <Header />
      <Chemistry />
      <Footer />
    </>
  );
}
