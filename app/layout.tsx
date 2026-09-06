import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Backpacker",
  description: "Plan smarter. Travel farther with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const afterSignOutUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL ?? "/";

  return (
    <ClerkProvider
      publishableKey={publishableKey ?? ""}
      afterSignOutUrl={afterSignOutUrl}
    >
      <html
        lang="en"
        className={cn(
          "h-full",
          "antialiased",
          inter.variable,
          "font-sans"
        )}
      >
        <body className="min-h-full flex flex-col">
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}