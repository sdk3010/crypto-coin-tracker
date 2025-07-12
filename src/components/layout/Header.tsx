import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, TrendingUp, Wallet, BarChart3, Newspaper, Coins, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useCrypto } from '@/contexts/CryptoContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { totalPortfolioValue } = useCrypto();
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: TrendingUp },
    { name: 'Portfolio', href: '/portfolio', icon: Wallet },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'News', href: '/news', icon: Newspaper },
  ];

  const isActive = (path: string) => {
    return path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover-lift"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg crypto-gradient">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">
                CryptoTracker
              </span>
              <span className="text-xs text-muted-foreground">
                Portfolio: {formatCurrency(totalPortfolioValue)}
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg smooth-transition hover-lift ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle & User Menu */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="smooth-transition hover-lift"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="ml-2 hidden sm:inline">
                {theme === 'light' ? 'Dark' : 'Light'}
              </span>
            </Button>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="flex flex-col items-start">
                    <div className="text-sm font-medium">{user.user_metadata?.display_name || 'User'}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border">
          <nav className="flex items-center justify-around py-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-lg smooth-transition ${
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;