import { createFileRoute, Outlet } from '@tanstack/react-router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const Route = createFileRoute('/(seo)/_seo')({
  component: SeoLayout,
});

function SeoLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
