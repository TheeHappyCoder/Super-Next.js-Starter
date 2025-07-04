import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from "@/components/client-layout";
import AuthGate from "@/components/auth-gate";
import { AuthProvider } from "@/context/auth-context";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";
import { ToasterClient } from "@/components/toaster-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <AuthGate>
              <ClientLayout>{children}</ClientLayout>
            </AuthGate>
          </AuthProvider>
          {/* ✅ Mounting Toaster here */}
          <ToasterClient />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
