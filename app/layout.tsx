import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ProModal } from "@/components/pro-modal";

const quickSand = Quicksand({subsets: ["latin"], weight: "500"} );

export const metadata: Metadata = {
  title: "Chat Nest AI",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-secondary/50", quickSand.className)}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
      >
          <ProModal />
          {children}
          <Toaster />
      </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
