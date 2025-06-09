'use client';

import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid min-h-svh lg:grid-cols-2 relative">
      {/* Left side (form area) */}
      <div className="flex flex-col p-6 md:p-10 relative">
        {/* Top bar across the top */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 md:px-10 py-4">
          {/* Left: logos in a row */}
          <div className="flex items-center space-x-4">
            <Image
              src="/oldMutualLogo.svg"
              alt="Old Mutual SLA Logo"
              width={150}
              height={40}
              priority
            />
            <Image
              src="/abtLogoBlack.svg"
              alt="Second Logo"
              width={80}
              height={40}
              priority
            />
          </div>

          {/* Right: theme toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Centered login form */}
        <div className="flex flex-1 items-center justify-center w-full">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right side (image panel) */}
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/building2.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-fill"
        />
      </div>
    </div>
  );
}
