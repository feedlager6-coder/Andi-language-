import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppLayout } from "@/components/layout";
import Home from "@/pages/home";
import Dictionary from "@/pages/dictionary";
import WordDetail from "@/pages/word-detail";
import Lessons from "@/pages/lessons";
import LessonDetail from "@/pages/lesson-detail";
import Practice from "@/pages/practice";
import Translator from "@/pages/translator";
import Phrasebank from "@/pages/phrasebank";
import Progress from "@/pages/progress";
import Morphology from "@/pages/morphology";
import Grammar from "@/pages/grammar";
import Settings from "@/pages/settings";
import AdminDashboard from "@/pages/admin/index";
import NewWord from "@/pages/admin/new-word";
import NewLesson from "@/pages/admin/new-lesson";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
});

function Router() {
  return (
    <Switch>
      {/* Login page renders without the sidebar layout */}
      <Route path="/login" component={LoginPage} />

      {/* All other pages use the app layout with sidebar */}
      <Route>
        <AppLayout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/dictionary" component={Dictionary} />
            <Route path="/dictionary/:id" component={WordDetail} />
            <Route path="/lessons" component={Lessons} />
            <Route path="/lessons/:id" component={LessonDetail} />
            <Route path="/practice" component={Practice} />
            <Route path="/translator" component={Translator} />
            <Route path="/phrasebank" component={Phrasebank} />
            <Route path="/progress" component={Progress} />
            <Route path="/morphology" component={Morphology} />
            <Route path="/grammar" component={Grammar} />
            <Route path="/settings" component={Settings} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/words/new" component={NewWord} />
            <Route path="/admin/lessons/new" component={NewLesson} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
