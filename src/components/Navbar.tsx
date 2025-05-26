import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ListFilter, 
  Building2, 
  Check,
  X,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-10 w-full px-4 transition-all duration-200 border-b backdrop-blur-sm",
        scrolled 
          ? "bg-background/95 py-2" 
          : "bg-background/50 py-4"
      )}
    >
      <div className="mx-auto flex h-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <Building2 className="h-6 w-6 text-[hsl(var(--neon-blue))]" />
          </div>
          <h1 className="text-xl font-semibold">LafargeHolcim Project Dashboard</h1>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          {showSearch ? (
            <div className="relative">
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full rounded-l-none"
                onClick={() => setShowSearch(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowSearch(true)}
            >
              
            </Button>
          )}
          
          
        </div>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
                
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}