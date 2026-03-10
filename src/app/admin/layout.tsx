import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { adminNavigation } from "@/constants/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Admin header */}
      <header className="sticky top-0 z-50 border-b border-secondary-800 bg-secondary-950/90 backdrop-blur-lg">
        <Container>
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-lg font-bold">
                <span className="text-primary-400">Rent</span>
                <span className="text-white">Bing</span>
                <span className="ml-2 text-xs font-normal text-secondary-500">Admin</span>
              </Link>
              <nav className="hidden items-center gap-1 md:flex">
                {adminNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-1.5 text-sm text-secondary-400 transition-colors hover:text-white hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <Link href="/" className="text-sm text-secondary-500 hover:text-white">
              View Site
            </Link>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
