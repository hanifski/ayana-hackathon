"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/auth";

  return (
    <>
      <div className="flex flex-col w-full h-screen ">
        <header className="flex w-full h-16 px-4 md:px-6 items-center justify-between">
          <p>Logo</p>
          <ThemeToggle />
        </header>
        <div className="flex flex-col w-full h-full px-4 md:px-6 items-center justify-center">
          {children}
        </div>
        <footer className="flex h-28 w-full px-4 md:px-6 border-t border-border items-center justify-center gap-1">
          <p className="text-muted-foreground">
            {isLoginPage
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <Link
            href={isLoginPage ? "/auth/signup" : "/auth"}
            className="text-primary underline-offset-4 hover:underline"
          >
            {isLoginPage ? "Register" : "Log in"}
          </Link>
        </footer>
      </div>
    </>
  );
}
