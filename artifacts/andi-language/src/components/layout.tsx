import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  BookOpen, BookText, Home, Layers, TrendingUp,
  Dumbbell, ChevronDown, ChevronRight, Settings,
  Microscope, FlaskConical, Languages, MessageSquareText, Menu, X,
  LogIn, LogOut, User as UserIcon, SlidersHorizontal,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarSeparator, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@workspace/replit-auth-web";

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
  const { toggleSidebar, openMobile } = useSidebar();
  const [location] = useLocation();

  const currentPage = [...mainNav, ...specialistNav].find(n =>
    n.url === "/" ? location === "/" : location.startsWith(n.url)
  );

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card md:hidden sticky top-0 z-50">
      <span className="font-serif font-semibold text-primary truncate pr-2">
        {currentPage?.title ?? "Андийский язык"}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          toggleSidebar();
        }}
        aria-label={openMobile ? "Закрыть меню" : "Открыть меню"}
      >
        {openMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </div>
  );
}

function SidebarAuthFooter() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  if (isLoading) {
    return <div className="h-10" />;
  }

  if (!isAuthenticated) {
    return (
      <Button
        variant="default"
        size="sm"
        className="w-full gap-2 justify-center"
        onClick={login}
      >
        <LogIn className="h-4 w-4" />
        Войти
      </Button>
    );
  }

  const displayName = user?.firstName || user?.email || "Пользователь";

  return (
    <div className="flex items-center justify-between gap-2 px-1">
      <div className="flex items-center gap-2 min-w-0">
        <div className="h-7 w-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <UserIcon className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm font-medium truncate">{displayName}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href="/settings" aria-label="Настройки" title="Настройки">
            <SlidersHorizontal className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={logout}
          aria-label="Выйти"
          title="Выйти"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
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
          <SidebarGroupLabel className="font-serif text-base text-primary tracking-wide py-4 px-2 hidden md:flex items-center gap-2">
            <BookOpen className="h-4 w-4 shrink-0" />
            <span>Андийский язык</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={
                    item.url === "/" ? location === "/" : location.startsWith(item.url)
                  }>
                    <Link href={item.url} className="flex items-center gap-3 py-2" onClick={handleNavClick}>
                      <item.icon className="h-4 w-4 shrink-0" />
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
            type="button"
            onClick={() => setSpecialistOpen(!specialistOpen)}
            className={cn(
              "flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors rounded-md",
              (specialistOpen || isSpecialistPage)
                ? "text-muted-foreground"
                : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50"
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
                        <item.icon className="h-4 w-4 shrink-0" />
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
      <SidebarFooter className="border-t border-border p-3">
        <SidebarAuthFooter />
      </SidebarFooter>
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
