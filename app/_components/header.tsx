"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Backpacker Logo"
            width={45}
            height={45}
            priority
          />

          <span className="text-xl font-bold">Backpacker</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>

          <button
            type="button"
            onClick={() => {
              document.getElementById("destinations")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="text-sm font-medium hover:text-primary"
          >
            Destinations
          </button>

          <Link href="/plan" className="text-sm font-medium hover:text-primary">
            My Trips
          </Link>

          <Link href="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Get Started ✨
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <Link href="/plan" className="text-sm font-medium hover:text-primary">
                Plan Trip
              </Link>
              <UserButton />
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}

export default Header;