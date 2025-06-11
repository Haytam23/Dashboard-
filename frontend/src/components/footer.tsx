// src/components/SimpleLoginFooter.tsx
'use client';

import { Heart } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent } from '@/components/ui/card';

export function SimpleLoginFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-4 px-6 bg-transparent">
      <div className="relative">
        {/* Subtle gradient line at the top of the footer */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        {/* Outer wrapper to constrain max width and center horizontally */}
        <div className="max-w-3xl mx-auto pt-4">
          {/* 
            Use flex + justify-center to center all items in one row.
            Use gap-x-2 or gap-x-4 to space them out horizontally.
          */}
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6 text-sm text-muted-foreground/70">
            
            {/* © Year + Heart icon */}
            <div className="flex items-center gap-1">
              <span>© {currentYear} ProjectHub</span>
              <Heart className="h-3 w-3 text-red-400" />
            </div>

            {/* Horizontal separator dot (optional) */}
            <div className="hidden sm:inline-block w-1 h-1 bg-muted-foreground/30 rounded-full" />

            {/* Privacy / Terms / Help links, all centered */}
            <nav className="flex items-center gap-4 text-xs">
              <a
                href="/privacy"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                Privacy
              </a>
              
              {/* Separator “•” – you can replace with a dot or vertical bar */}
              <span className="hidden sm:inline text-muted-foreground/50">•</span>
              
              <a
                href="/terms"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                Terms
              </a>

              <span className="hidden sm:inline text-muted-foreground/50">•</span>
              
              <a
                href="/help"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                Help
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
