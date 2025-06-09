'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/90 border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-screen-xl mx-auto">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/oldMutualLogo.svg"
            alt="Old Mutual SLA Logo"
            width={200}
            height={40}
            priority
          />
        </div>

        <div className="flex items-center">
          {/* User dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full cursor-pointer">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="User avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-3 py-2 text-sm font-medium">
                  {user.email}
                </div>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-sm text-muted-foreground">Not logged in</span>
          )}

          {/* Theme toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full cursor-pointer"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
