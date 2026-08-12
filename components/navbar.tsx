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
          <nav className="flex items-center gap-2 text-[10px] ml-4 font-arcade pt-1" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3 text-text-muted/60" strokeWidth={4} />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-text-muted hover:text-brand-blue transition-colors uppercase"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-text-secondary uppercase">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      {/* Right: Auth */}
      <div className="flex items-center gap-3">
        <Show when="signed-in">
          <div className="rounded-full border-[3px] border-brand-yellow shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center bg-bg-surface">
            <UserButton />
          </div>
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
