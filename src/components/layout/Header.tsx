import { Link, useLocation } from 'react-router';
import { GearSix, ArrowLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

export function Header() {
  const location = useLocation();
  const isSettings = location.pathname === '/settings';

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        {isSettings ? (
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
        ) : (
          <div className="size-9" />
        )}

        <h1 className="text-lg font-semibold">
          {isSettings ? 'Settings' : 'EV Charging Calculator'}
        </h1>

        {isSettings ? (
          <div className="size-9" />
        ) : (
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <GearSix className="size-5" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
