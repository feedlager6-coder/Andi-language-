import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  BookOpen, BookText, Home, Layers, TrendingUp,
  Dumbbell, ChevronDown, ChevronRight, Settings,
  Microscope, FlaskConical, Languages, MessageSquareText,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarSeparator,
} from "@/components/ui/sidebar";
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

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [specialistOpen, setSpecialistOpen] = useState(false);

  const isSpecialistPage = specialistNav.some(n => location === n.url || location.startsWith("/admin"));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-border bg-card">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="font-serif text-base text-primary tracking-wide py-4 px-2">
                Андийский язык
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={
                        item.url === "/" ? location === "/" : location.startsWith(item.url)
                      }>
                        <Link href={item.url} className="flex items-center gap-3 py-2">
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
                          <Link href={item.url} className="flex items-center gap-3 py-2">
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

        <main className="flex-1 flex flex-col min-w-0 overflow-auto">
          <div className="container mx-auto max-w-5xl p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
