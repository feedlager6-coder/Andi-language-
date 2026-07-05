import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateLesson, getListLessonsQueryKey } from "@workspace/api-client-react";
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
  title: z.string().min(1, "Обязательное поле"),
  description: z.string().optional(),
  level: z.string().min(1, "Обязательное поле"),
  orderIndex: z.coerce.number().min(0),
  content: z.string().optional(),
});

export default function NewLesson() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const createLesson = useCreateLesson();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      level: "beginner",
      orderIndex: 1,
      content: "",
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    createLesson.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListLessonsQueryKey() });
        setLocation("/lessons");
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

      <h1 className="text-3xl font-serif font-bold">Добавить новый урок</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg border border-border">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название урока</FormLabel>
                <FormControl><Input {...field} placeholder="Например: Именные классы в андийском языке" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Уровень</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Выберите уровень" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Начальный</SelectItem>
                      <SelectItem value="intermediate">Средний</SelectItem>
                      <SelectItem value="advanced">Продвинутый</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderIndex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Порядковый номер</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Краткое описание</FormLabel>
                <FormControl><Textarea {...field} placeholder="Что изучается в этом уроке..." /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Содержимое урока (HTML или текст)</FormLabel>
                <FormControl><Textarea {...field} className="h-48 font-mono" placeholder="Грамматический материал, объяснения, правила..." /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={createLesson.isPending} className="w-full">
            {createLesson.isPending ? "Сохранение..." : "Сохранить урок"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
