import { Header, Footer } from '@/components/plot/chrome';
import Cast from '@/components/plot/cast';
export const metadata = { title: 'Meet the 16 characters · Plot Twist' };
export default function Page() {
  return (
    <>
      <Header />
      <Cast />
      <Footer />
    </>
  );
}
