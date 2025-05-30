// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { 
//   ListFilter, 
//   Building2, 
//   Check,
//   X,
//   Menu,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import {
//   Sheet,
//   SheetContent,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { useAuth } from '../AuthContext';

// export function Navbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);

//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login', { replace: true });
//   };
  
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);
  
//   return (
//     <header 
//       className={cn(
//         "sticky top-0 z-10 w-full px-4 transition-all duration-200 border-b backdrop-blur-sm",
//         scrolled 
//           ? "bg-background/95 py-2" 
//           : "bg-background/50 py-4"
//       )}
//     >
//       <div className="mx-auto flex h-full items-center justify-between">
//         <div className="flex items-center gap-2">
//           <div className="hidden md:block">
//             <Building2 className="h-6 w-6 text-[hsl(var(--neon-blue))]" />
//           </div>
//           <h1 className="text-xl font-semibold">LafargeHolcim Project Dashboard</h1>
//         </div>
        
//         <div className="hidden md:flex items-center gap-4">
//           {showSearch ? (
//             <div className="relative">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="absolute right-0 top-0 h-full rounded-l-none"
//                 onClick={() => setShowSearch(false)}
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           ) : (
//             <Button
//               variant="outline"
//               size="sm"
//               className="gap-2"
//               onClick={() => setShowSearch(true)}
//             >
//               <ListFilter className="h-4 w-4" />
//               Search
//             </Button>
//           )}

//           {/* Logout button for desktop */}
//           <Button
//             variant="destructive"
//             size="sm"
//             onClick={handleLogout}
//           >
//             Logout
//           </Button>
//         </div>
        
//         <div className="md:hidden">
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="outline" size="icon">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent className="flex flex-col gap-4">
//               {/* Mobile menu items */}
//               <Button variant="ghost" size="sm" onClick={handleLogout}>
//                 Logout
//               </Button>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   );
// }
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar as CalendarIcon,
  ListFilter,
  Building2,
  X,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../AuthContext';

// Make sure to install FullCalendar packages:
// npm install @fullcalendar/react @fullcalendar/timegrid @fullcalendar/interaction
// And import their CSS (e.g. in index.css):
// @import '@fullcalendar/common/main.css';
// @import '@fullcalendar/timegrid/main.css';

interface EventType {
  id: string;
  title: string;
  start: string;
  end?: string;
}

interface NavbarProps {
  // events is optional; defaults to empty array if not provided
  events?: EventType[];
}
export function CalendarView({ events }: { events: any[] }) {
  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: ''
      }}
      events={events}
      height="auto"
    />
  );
}
export function Navbar({ events = [] }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
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
          {/* Calendar icon opens a bottom sheet with the full calendar view */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <CalendarIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="h-[80vh]">
              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
                events={events}
                height="100%"
              />
            </SheetContent>
          </Sheet>

          {/* Search toggle */}
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
              <ListFilter className="h-4 w-4" />
              Search
            </Button>
          )}

          {/* Logout button */}
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-4">
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
              {/* Optional mobile calendar entry */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Calendar
                  </Button>
                </SheetTrigger>
                <SheetContent className="h-[80vh]">
                  <FullCalendar
                    plugins={[ timeGridPlugin, interactionPlugin ]}
                    initialView="timeGridWeek"
                    events={events}
                  />
                </SheetContent>
              </Sheet>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
