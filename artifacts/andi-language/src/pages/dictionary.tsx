import { useState } from "react";
import { useListWords } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function Dictionary() {
  const [search, setSearch] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState<string>("all");

  const { data, isLoading } = useListWords({
    search: search || undefined,
    partOfSpeech: partOfSpeech !== "all" ? partOfSpeech : undefined,
    limit: 50
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground">Словарь</h1>
        <p className="text-muted-foreground mt-2">Лексика андийского языка — живая летопись горного наречия.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по андийскому, русскому или английскому..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select value={partOfSpeech} onValueChange={setPartOfSpeech}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Часть речи" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все части речи</SelectItem>
              <SelectItem value="существительное">Существительное</SelectItem>
              <SelectItem value="глагол">Глагол</SelectItem>
              <SelectItem value="прилагательное">Прилагательное</SelectItem>
              <SelectItem value="местоимение">Местоимение</SelectItem>
              <SelectItem value="числительное">Числительное</SelectItem>
              <SelectItem value="наречие">Наречие</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {data && (
        <p className="text-sm text-muted-foreground">
          Найдено слов: <span className="font-semibold">{data.total}</span>
        </p>
      )}

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))
        ) : data?.words && data.words.length > 0 ? (
          data.words.map((word) => (
            <Link key={word.id} href={`/dictionary/${word.id}`}>
              <Card className="hover-elevate cursor-pointer transition-colors hover:bg-card/60">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-xl font-bold text-primary">{word.andiWord}</h3>
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{word.partOfSpeech}</span>
                      {word.level && (
                        <span className="text-xs text-muted-foreground">{word.level}</span>
                      )}
                    </div>
                    <div className="text-sm mt-1 space-y-0.5">
                      <div><span className="text-muted-foreground">РУ:</span> {word.russian}</div>
                      {word.english && <div><span className="text-muted-foreground">EN:</span> {word.english}</div>}
                    </div>
                  </div>
                  {word.phonetic && (
                    <div className="text-sm font-mono text-muted-foreground opacity-70">
                      /{word.phonetic}/
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-card/50">
            Ничего не найдено по вашему запросу.
          </div>
        )}
      </div>
    </div>
  );
}
