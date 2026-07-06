import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateWord, getListWordsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  andiWord: z.string().min(1, "Обязательное поле"),
  lemma: z.string().optional(),
  russian: z.string().min(1, "Обязательное поле"),
  english: z.string().optional(),
  partOfSpeech: z.string().min(1, "Обязательное поле"),
  nounClass: z.string().optional(),
  grammaticalFunction: z.string().optional(),
  root: z.string().optional(),
  affixes: z.string().optional(),
  morphology: z.string().optional(),
  phonetic: z.string().optional(),
  examples: z.string().optional(),
  dialect: z.string().optional(),
  source: z.string().optional(),
  license: z.string().optional(),
  confidence: z.coerce.number().min(0).max(1).optional(),
  editorNotes: z.string().optional(),
  level: z.string().optional(),
});

export default function NewWord() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const createWord = useCreateWord();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      andiWord: "", lemma: "", russian: "", english: "",
      partOfSpeech: "существительное", nounClass: "",
      grammaticalFunction: "", root: "", affixes: "", morphology: "",
      phonetic: "", examples: "", dialect: "верхнеандийский (стандарт)",
      source: "IDS/CLLD (ids.clld.org/contributions/32); ср. Церцвадзе И.И., 1967", license: "academic",
      confidence: 0.8, editorNotes: "", level: "beginner",
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== "" && v !== undefined)
    );
    createWord.mutate({ data: clean as unknown as Parameters<typeof createWord.mutate>[0]["data"] }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListWordsQueryKey() });
        setLocation("/dictionary");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button asChild variant="ghost" className="gap-2 text-muted-foreground -ml-2">
        <Link href="/admin">
          <ArrowLeft className="h-4 w-4" />
          В панель лингвиста
        </Link>
      </Button>

      <h1 className="text-3xl font-serif font-bold">Добавить новое слово</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg border border-border">

          {/* Основное */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Основная форма</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="andiWord" render={({ field }) => (
              <FormItem>
                <FormLabel>Андийское слово <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input {...field} placeholder="Например: гьалъи" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="lemma" render={({ field }) => (
              <FormItem>
                <FormLabel>Лемма (словарная форма)</FormLabel>
                <FormControl><Input {...field} placeholder="Если отличается от словоформы" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="russian" render={({ field }) => (
              <FormItem>
                <FormLabel>Перевод — русский <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input {...field} placeholder="Например: вода" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="english" render={({ field }) => (
              <FormItem>
                <FormLabel>Перевод — английский</FormLabel>
                <FormControl><Input {...field} placeholder="Например: water" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="phonetic" render={({ field }) => (
              <FormItem>
                <FormLabel>Транскрипция IPA</FormLabel>
                <FormControl><Input {...field} className="font-mono" placeholder="Например: ɣaɬi" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="partOfSpeech" render={({ field }) => (
              <FormItem>
                <FormLabel>Часть речи <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="существительное">Существительное</SelectItem>
                    <SelectItem value="глагол">Глагол</SelectItem>
                    <SelectItem value="прилагательное">Прилагательное</SelectItem>
                    <SelectItem value="местоимение">Местоимение</SelectItem>
                    <SelectItem value="числительное">Числительное</SelectItem>
                    <SelectItem value="наречие">Наречие</SelectItem>
                    <SelectItem value="послелог">Послелог</SelectItem>
                    <SelectItem value="частица">Частица</SelectItem>
                    <SelectItem value="союз">Союз</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Грамматика */}
          <div className="pt-2 border-t border-border space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Грамматика</h3>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="nounClass" render={({ field }) => (
                <FormItem>
                  <FormLabel>Именной класс</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Только для существительных" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="I">Класс I (мужской)</SelectItem>
                      <SelectItem value="II">Класс II (женский)</SelectItem>
                      <SelectItem value="III">Класс III (вещный-1)</SelectItem>
                      <SelectItem value="IV">Класс IV (вещный-2)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="grammaticalFunction" render={({ field }) => (
                <FormItem>
                  <FormLabel>Грамматическая функция</FormLabel>
                  <FormControl><Input {...field} placeholder="Например: 1 лицо, ед. ч., им. пад." /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="root" render={({ field }) => (
                <FormItem>
                  <FormLabel>Корень</FormLabel>
                  <FormControl><Input {...field} className="font-mono" placeholder="Например: гьалъ" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="affixes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Аффиксы</FormLabel>
                  <FormControl><Input {...field} className="font-mono" placeholder="Например: -и (номинализ.)" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="morphology" render={({ field }) => (
                <FormItem>
                  <FormLabel>Морфемный разбор</FormLabel>
                  <FormControl><Input {...field} className="font-mono" placeholder="Например: гьалъ-и" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          {/* Контент */}
          <div className="pt-2 border-t border-border space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Примеры и диалект</h3>

            <FormField control={form.control} name="examples" render={({ field }) => (
              <FormItem>
                <FormLabel>Примеры употребления</FormLabel>
                <FormControl><Textarea {...field} className="h-24 font-mono text-sm" placeholder="Пример предложения на андийском — перевод" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="dialect" render={({ field }) => (
              <FormItem>
                <FormLabel>Диалект</FormLabel>
                <FormControl><Input {...field} placeholder="Андийский, мундарский, риквани..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Источник и метаданные */}
          <div className="pt-2 border-t border-border space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Источник и метаданные</h3>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="source" render={({ field }) => (
                <FormItem>
                  <FormLabel>Источник</FormLabel>
                  <FormControl><Input {...field} placeholder="IDS/CLLD, Церцвадзе 1967..." /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="license" render={({ field }) => (
                <FormItem>
                  <FormLabel>Лицензия</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Тип лицензии" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="academic">Academic (цитирование)</SelectItem>
                      <SelectItem value="cc-by">CC BY</SelectItem>
                      <SelectItem value="cc-by-sa">CC BY-SA</SelectItem>
                      <SelectItem value="public-domain">Public Domain</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="confidence" render={({ field }) => (
                <FormItem>
                  <FormLabel>Достоверность (0–1)</FormLabel>
                  <FormControl><Input {...field} type="number" step="0.05" min="0" max="1" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="level" render={({ field }) => (
                <FormItem>
                  <FormLabel>Уровень</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Начальный</SelectItem>
                      <SelectItem value="intermediate">Средний</SelectItem>
                      <SelectItem value="advanced">Продвинутый</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="editorNotes" render={({ field }) => (
              <FormItem>
                <FormLabel>Заметки редактора-лингвиста</FormLabel>
                <FormControl><Textarea {...field} className="h-16 text-sm" placeholder="Внутренние заметки о слове, сомнения, TODO..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <Button type="submit" disabled={createWord.isPending} className="w-full">
            {createWord.isPending ? "Сохранение..." : "Сохранить слово"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
