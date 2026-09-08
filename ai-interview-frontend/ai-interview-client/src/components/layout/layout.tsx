import Navbar from '../shared/Navbar';
import MobileNav from '../shared/MobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-20 md:pb-8">{children}</main>
      <MobileNav />
    </div>
  );
}