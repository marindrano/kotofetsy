import { createFileRoute, Outlet } from '@tanstack/react-router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const Route = createFileRoute('/(legal)/_legal')({
  component: LegalLayout,
});

function LegalLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-base)]">
      <Header />
      <div className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[var(--line)] sm:p-12">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
