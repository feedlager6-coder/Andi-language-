import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@workspace/replit-auth-web";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { refetch } = useAuth();

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regDisplay, setRegDisplay] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError("");
      setLoginLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: loginUsername, password: loginPassword }),
        });
        const data = await res.json();
        if (!res.ok) {
          setLoginError(data.error ?? "Ошибка входа");
          return;
        }
        refetch();
        navigate("/");
      } catch {
        setLoginError("Ошибка соединения. Попробуйте ещё раз.");
      } finally {
        setLoginLoading(false);
      }
    },
    [loginUsername, loginPassword, navigate, refetch],
  );

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setRegError("");
      setRegLoading(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: regUsername,
            password: regPassword,
            displayName: regDisplay || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setRegError(data.error ?? "Ошибка регистрации");
          return;
        }
        refetch();
        navigate("/");
      } catch {
        setRegError("Ошибка соединения. Попробуйте ещё раз.");
      } finally {
        setRegLoading(false);
      }
    },
    [regUsername, regPassword, regDisplay, navigate, refetch],
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / Title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-serif font-bold text-primary">Андийский язык</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Платформа для изучения андийского языка
          </p>
        </div>

        {/* Auth Card */}
        <Card>
          <Tabs defaultValue="login">
            <CardHeader className="pb-0">
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">Войти</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">Зарегистрироваться</TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-6">
                  <CardDescription className="text-center">
                    Войдите в свой аккаунт
                  </CardDescription>
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Логин</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Ваш логин"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Ваш пароль"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowLoginPassword((v) => !v)}
                        tabIndex={-1}
                      >
                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {loginError && (
                    <p className="text-sm text-destructive">{loginError}</p>
                  )}
                  <Button type="submit" className="w-full" disabled={loginLoading}>
                    {loginLoading ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" />Вход...</>
                    ) : "Войти"}
                  </Button>
                </CardContent>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4 pt-6">
                  <CardDescription className="text-center">
                    Создайте новый аккаунт
                  </CardDescription>
                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Логин</Label>
                    <Input
                      id="reg-username"
                      type="text"
                      placeholder="3–32 символа (буквы, цифры, _)"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-display">Отображаемое имя <span className="text-muted-foreground">(необязательно)</span></Label>
                    <Input
                      id="reg-display"
                      type="text"
                      placeholder="Как вас будут называть"
                      value={regDisplay}
                      onChange={(e) => setRegDisplay(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showRegPassword ? "text" : "password"}
                        placeholder="Минимум 6 символов"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowRegPassword((v) => !v)}
                        tabIndex={-1}
                      >
                        {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {regError && (
                    <p className="text-sm text-destructive">{regError}</p>
                  )}
                  <Button type="submit" className="w-full" disabled={regLoading}>
                    {regLoading ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" />Регистрация...</>
                    ) : "Зарегистрироваться"}
                  </Button>
                </CardContent>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Изучайте андийский язык — язык Ботлихского района Дагестана
        </p>
      </div>
    </div>
  );
}
