import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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

// FullCalendar and its plugins + CSS
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid';

import { useAuth } from '../AuthContext';

interface EventType {
  id: string;
  title: string;
  start: string;
  allDay: boolean;
  color?: string;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  // Fetch and build calendar events on mount
  useEffect(() => {
    async function fetchEvents() {
      try {
        // Fetch tasks
        const tasksRes = await fetch(`${API}/tasks`, { credentials: 'include' });
        let tasksData: any[] = [];
        if (tasksRes.ok) {
          tasksData = await tasksRes.json();
        } else {
          console.error('Error fetching tasks:', tasksRes.status);
        }

        // Fetch projects
        const projectsRes = await fetch(`${API}/projects`, { credentials: 'include' });
        let projectsData: any[] = [];
        if (projectsRes.ok) {
          projectsData = await projectsRes.json();
        } else {
          console.error('Error fetching projects:', projectsRes.status);
        }

        console.log('Tasks:', tasksData);
        console.log('Projects:', projectsData);

        // Map to calendar events, add color for visibility
        const taskEvents: EventType[] = tasksData
          .filter(t => t.deadline)
          .map(t => ({
            id: `task-${t.id}`,
            title: t.title || t.name || `Task ${t.id}`,
            start: t.deadline,
            allDay: true,
            color: '#3b82f6', // blue
          }));

        const projectEvents: EventType[] = projectsData
          .filter(p => p.deadline)
          .map(p => ({
            id: `project-${p.id}`,
            title: p.title || p.name || `Project ${p.id}`,
            start: p.deadline,
            allDay: true,
            color: '#f59e0b', // amber
          }));

        const combined = [...taskEvents, ...projectEvents];
        console.log('Calendar events:', combined);
        setEvents(combined);
      } catch (err) {
        console.error('Failed to load calendar events:', err);
      }
    }
    fetchEvents();
  }, [API]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-10 w-full px-4 transition-all duration-200 border-b backdrop-blur-sm",
        scrolled ? "bg-background/95 py-2" : "bg-background/50 py-4"
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
          {/* Calendar trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <CalendarIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="h-[80vh]">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek'
                }}
                events={events}
                eventColor='#10b981' // fallback green
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

          {/* Logout */}
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
