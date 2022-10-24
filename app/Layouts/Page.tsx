import { Header } from './Header';
import { Footer } from './Footer';

interface Props {
  children: React.ReactNode;
}

export function Page({ children }: Props) {
  return (
    <>
      <Header />
      <div className="relative flex-1 min-h-[calc(100vh-160px)]">
        <div className="mx-auto max-w-[1400px] px-2.5 sm:px-11">{children}</div>
      </div>
      <Footer />
    </>
  );
}
