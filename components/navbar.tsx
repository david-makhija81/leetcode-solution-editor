import Link from "next/link";
import { Code2, ChevronRight } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

interface NavbarProps {
  breadcrumbs?: { label: string; href?: string }[];
}

export function Navbar({ breadcrumbs }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-14 px-6 bg-bg-surface/90 backdrop-blur-md border-b-2 border-border-default shadow-sm">
      {/* Left: Logo + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-brand-blue hover:text-brand-red transition-colors"
        >
          <Code2 className="h-6 w-6" strokeWidth={2.5} />
          <span className="font-arcade text-sm tracking-tight pt-1">
            LeetSolve
          </span>
        </Link>

        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-sm ml-4" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-4 w-4 text-text-muted" strokeWidth={3} />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-text-muted font-medium hover:text-brand-blue transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-text-primary font-bold">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      {/* Right: Auth */}
      <div className="flex items-center gap-3">
        <Show when="signed-in">
          <UserButton />
        </Show>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="btn-arcade bg-brand-green border-brand-green text-bg-surface hover:bg-brand-blue hover:border-brand-blue">
              Sign In
            </button>
          </SignInButton>
        </Show>
      </div>
    </header>
  );
}
