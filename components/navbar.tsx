import Link from "next/link";
import { Code2, ChevronRight } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

interface NavbarProps {
  breadcrumbs?: { label: string; href?: string }[];
}

export function Navbar({ breadcrumbs }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-14 px-6 bg-bg-surface/80 backdrop-blur-md border-b border-border-default">
      {/* Left: Logo + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
        >
          <Code2 className="h-5 w-5" />
          <span className="font-semibold text-sm tracking-tight">
            LeetSolve
          </span>
        </Link>

        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-text-muted" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-text-primary">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      {/* Right: Auth */}
      <div className="flex items-center gap-3">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-1.5 bg-accent-primary hover:bg-accent-secondary text-text-inverse text-sm font-medium rounded-md transition-colors">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
}
