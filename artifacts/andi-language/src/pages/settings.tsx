import { useEffect, useState } from "react";
import { useGetMySettings, useUpdateMySettings } from "@workspace/api-client-react";
import { useAuth } from "@workspace/replit-auth-web";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Settings as SettingsIcon, Languages } from "lucide-react";

const DIALECTS = [
  {
    value: "верхнеандийский",
    label: "Верхнеандийский (стандарт)",
    description: "Аулы Анди, Гагатли, Зило, Риквани, Ашали, Чанхо, Кванхидатль. Наиболее распространённая группа говоров, используется как стандарт в академических источниках и в данном словаре.",
  },
  {
    value: "нижнеандийский",
    label: "Нижнеандийский (мунибско-кванхидатлинский)",
    description: "Аулы Муни и Кванхидатли. По современным исследованиям иногда выделяется как отдельный язык внутри андийской подгруппы.",
  },
];

export default function Settings() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { toast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: settings, isLoading } = useGetMySettings({ query: { enabled: isAuthenticated } as any });

  const [dailyGoal, setDailyGoal] = useState(10);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [preferredDialect, setPreferredDialect] = useState("верхнеандийский");

  useEffect(() => {
    if (settings) {
      setDailyGoal(settings.dailyGoal);
      setShowTransliteration(settings.showTransliteration);
      setPreferredDialect(settings.preferredDialect || "верхнеандийский");
    }
  }, [settings]);

  const updateSettings = useUpdateMySettings({
    mutation: {
      onSuccess: () => toast({ title: "Настройки сохранены" }),
    },
  });

  const handleSave = () => {
    updateSettings.mutate({
      data: { dailyGoal, showTransliteration, preferredDialect },
    });
  };

  const activeDialect = DIALECTS.find((d) => d.value === preferredDialect) ?? DIALECTS[0];

  if (authLoading) {
    return <Skeleton className="h-64 w-full max-w-lg" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-4">
        <SettingsIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-40" />
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="text-muted-foreground">
          Войдите, чтобы сохранять настройки и прогресс на вашем аккаунте.
        </p>
        <Button onClick={login} className="gap-2">
          <LogIn className="h-4 w-4" /> Войти
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-primary">Настройки</h1>
        <p className="text-muted-foreground mt-1">Персональные настройки обучения.</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Обучение</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="dailyGoal">Дневная цель (слов)</Label>
              <Input
                id="dailyGoal"
                type="number"
                min={1}
                max={100}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value) || 1)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="translit">Показывать транслитерацию</Label>
                <p className="text-xs text-muted-foreground">Латинская запись рядом с андийским текстом</p>
              </div>
              <Switch id="translit" checked={showTransliteration} onCheckedChange={setShowTransliteration} />
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <Label htmlFor="dialect" className="flex items-center gap-2">
                <Languages className="h-3.5 w-3.5" />
                Диалект
              </Label>
              <Select value={preferredDialect} onValueChange={setPreferredDialect}>
                <SelectTrigger id="dialect">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIALECTS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground leading-relaxed">{activeDialect.description}</p>
            </div>

            <Button onClick={handleSave} disabled={updateSettings.isPending} className="w-full">
              {updateSettings.isPending ? "Сохраняю..." : "Сохранить"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
