import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  BookOpen, BookText, Home, Layers, TrendingUp,
  Dumbbell, ChevronDown, ChevronRight, Settings,
  Microscope, FlaskConical, Languages, MessageSquareText, Menu, X,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarSeparator, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mainNav = [
  { title: "Главная", url: "/", icon: Home },
  { title: "Учить слова", url: "/dictionary", icon: BookText },
  { title: "Учить фразы", url: "/phrasebank", icon: MessageSquareText },
  { title: "Уроки", url: "/lessons", icon: Layers },
  { title: "Переводчик", url: "/translator", icon: Languages },
  { title: "Практика", url: "/practice", icon: Dumbbell },
  { title: "Прогресс", url: "/progress", icon: TrendingUp },
];

const specialistNav = [
  { title: "Морфоанализатор", url: "/morphology", icon: Microscope },
  { title: "Грамматика", url: "/grammar", icon: FlaskConical },
  { title: "Панель лингвиста", url: "/admin", icon: Settings },
];

function MobileTopBar() {
  const { toggleSidebar, open } = useSidebar();
  const [location] = useLocation();

  const currentPage = [...mainNav, ...specialistNav].find(n =>
    n.url === "/" ? location === "/" : location.startsWith(n.url)
  );

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card md:hidden sticky top-0 z-50">
      <span className="font-serif font-semibold text-primary">
        {currentPage?.title ?? "Андийский язык"}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </div>
  );
}

function AppSidebar() {
  const [location] = useLocation();
  const [specialistOpen, setSpecialistOpen] = useState(false);
  const { setOpenMobile } = useSidebar();

  const isSpecialistPage = specialistNav.some(n => location === n.url || location.startsWith("/admin"));

  const handleNavClick = () => {
    // Close mobile sidebar on navigation
    setOpenMobile(false);
  };

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-serif text-base text-primary tracking-wide py-4 px-2 hidden md:block">
            Андийский язык
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={
                    item.url === "/" ? location === "/" : location.startsWith(item.url)
                  }>
                    <Link href={item.url} className="flex items-center gap-3 py-2" onClick={handleNavClick}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <button
            onClick={() => setSpecialistOpen(!specialistOpen)}
            className={cn(
              "flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
              (specialistOpen || isSpecialistPage)
                ? "text-muted-foreground"
                : "text-muted-foreground/60 hover:text-muted-foreground"
            )}
          >
            <span>Для специалистов</span>
            {(specialistOpen || isSpecialistPage)
              ? <ChevronDown className="h-3 w-3" />
              : <ChevronRight className="h-3 w-3" />}
          </button>

          {(specialistOpen || isSpecialistPage) && (
            <SidebarGroupContent className="mt-1">
              <SidebarMenu>
                {specialistNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url || location.startsWith("/admin")}>
                      <Link href={item.url} className="flex items-center gap-3 py-2" onClick={handleNavClick}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background flex-col md:flex-row">
        {/* Mobile top bar */}
        <MobileTopBar />

        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-auto">
          <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
