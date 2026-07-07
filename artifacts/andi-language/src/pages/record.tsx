import { useState, useRef, useEffect, useCallback } from "react";
import { useListWords, useListPhrases } from "@workspace/api-client-react";
import { Mic, MicOff, Square, Play, Upload, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const BASE = (import.meta as any).env?.BASE_URL?.replace(/\/$/, "") ?? "";

async function uploadAudio(type: "words" | "phrases", id: number, blob: Blob) {
  const res = await fetch(`${BASE}/api/audio/${type}/${id}`, {
    method: "POST",
    headers: { "Content-Type": blob.type || "audio/webm" },
    body: blob,
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

type RecordItem = { id: number; text: string; subtext: string; type: "words" | "phrases" };
type RecordingState = "idle" | "recording" | "recorded";

export default function RecordPage() {
  const { toast } = useToast();

  // Fetch words and phrases that need audio
  const { data: wordsData, refetch: refetchWords } = useListWords({ audioStatus: "requested", limit: 100 } as any);
  const { data: phrasesData, refetch: refetchPhrases } = useListPhrases({ audioStatus: "requested" } as any);

  const wordItems: RecordItem[] = (wordsData?.words ?? []).map(w => ({
    id: w.id,
    text: w.andiWord,
    subtext: w.russian,
    type: "words",
  }));

  const phraseItems: RecordItem[] = (phrasesData?.phrases ?? []).map(p => ({
    id: p.id,
    text: p.andi,
    subtext: p.russian,
    type: "phrases",
  }));

  const [selectedItem, setSelectedItem] = useState<RecordItem | null>(null);
  const [recordState, setRecordState] = useState<RecordingState>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedIds, setUploadedIds] = useState<Set<string>>(new Set());

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecordState("recorded");
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecordState("recording");
    } catch {
      toast({ title: "Нет доступа к микрофону", description: "Разрешите доступ к микрофону в браузере.", variant: "destructive" });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
  }, []);

  const discardRecording = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordState("idle");
  }, [audioUrl]);

  const submitRecording = useCallback(async () => {
    if (!selectedItem || !audioBlob) return;
    setUploading(true);
    try {
      await uploadAudio(selectedItem.type, selectedItem.id, audioBlob);
      const key = `${selectedItem.type}:${selectedItem.id}`;
      setUploadedIds(prev => new Set(prev).add(key));
      toast({ title: "Запись сохранена!", description: `«${selectedItem.text}» — аудио прикреплено.` });
      discardRecording();
      if (selectedItem.type === "words") refetchWords();
      else refetchPhrases();
      setSelectedItem(null);
    } catch {
      toast({ title: "Ошибка загрузки", description: "Не удалось сохранить запись. Попробуйте ещё раз.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }, [selectedItem, audioBlob, discardRecording, toast, refetchWords, refetchPhrases]);

  // Cleanup on unmount
  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  function selectItem(item: RecordItem) {
    discardRecording();
    setSelectedItem(item);
  }

  function ItemList({ items }: { items: RecordItem[] }) {
    if (items.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
          <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-base">Нет запросов на запись</p>
          <p className="text-sm mt-1 opacity-70">Когда пользователи нажимают «Запросить запись», элементы появятся здесь.</p>
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {items.map(item => {
          const key = `${item.type}:${item.id}`;
          const done = uploadedIds.has(key);
          return (
            <button
              key={key}
              onClick={() => !done && selectItem(item)}
              disabled={done}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedItem?.id === item.id && selectedItem?.type === item.type
                  ? "border-primary bg-primary/5 shadow-sm"
                  : done
                  ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-900/10 opacity-60 cursor-not-allowed"
                  : "border-border hover:border-primary/40 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-primary text-lg">{item.text}</span>
                  <span className="text-sm text-muted-foreground ml-2">{item.subtext}</span>
                </div>
                {done
                  ? <Badge variant="secondary" className="shrink-0 bg-emerald-100 text-emerald-700 border-emerald-200">Записано</Badge>
                  : <Badge variant="outline" className="shrink-0 text-xs">Запросить</Badge>
                }
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground">Озвучить</h1>
        <p className="text-muted-foreground mt-2">
          Здесь можно записать произношение слов и фраз для пользователей платформы.
          Любой желающий может помочь — записи будут прикреплены к соответствующим карточкам.
        </p>
      </div>

      {/* Recording panel — shown when item selected */}
      {selectedItem && (
        <Card className="border-primary/30 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Выбранный элемент
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-primary font-serif">{selectedItem.text}</p>
              <p className="text-muted-foreground mt-1">{selectedItem.subtext}</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {recordState === "idle" && (
                <Button onClick={startRecording} className="gap-2 bg-rose-600 hover:bg-rose-700">
                  <Mic className="h-4 w-4" />
                  Начать запись
                </Button>
              )}
              {recordState === "recording" && (
                <Button onClick={stopRecording} variant="destructive" className="gap-2 animate-pulse">
                  <Square className="h-4 w-4 fill-current" />
                  Остановить
                </Button>
              )}
              {recordState === "recorded" && audioUrl && (
                <>
                  <audio src={audioUrl} controls className="h-10 flex-1 min-w-[200px]" />
                  <Button onClick={discardRecording} variant="outline" size="sm" className="gap-1">
                    <MicOff className="h-4 w-4" />
                    Перезаписать
                  </Button>
                  <Button onClick={submitRecording} disabled={uploading} className="gap-2">
                    <Upload className="h-4 w-4" />
                    {uploading ? "Сохраняю..." : "Сохранить запись"}
                  </Button>
                </>
              )}
              {recordState === "recording" && (
                <div className="flex items-center gap-2 text-rose-600 text-sm animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-rose-600 inline-block" />
                  Запись...
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground opacity-70">
              Запись сохранится в базе и будет доступна всем пользователям платформы.
              Говорите чётко и в хорошем месте без лишних шумов.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lists */}
      <Tabs defaultValue="words">
        <TabsList className="mb-4">
          <TabsTrigger value="words" className="gap-2">
            Слова
            {wordItems.length > 0 && (
              <Badge variant="secondary" className="text-xs">{wordItems.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="phrases" className="gap-2">
            Фразы
            {phraseItems.length > 0 && (
              <Badge variant="secondary" className="text-xs">{phraseItems.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="words">
          <ItemList items={wordItems} />
        </TabsContent>
        <TabsContent value="phrases">
          <ItemList items={phraseItems} />
        </TabsContent>
      </Tabs>

      <div className="text-xs text-muted-foreground border-t pt-4 opacity-60 space-y-1">
        <p>Для записи необходим микрофон. Поддерживаются форматы WebM (Chrome, Firefox, Edge).</p>
        <p>Записи проходят проверку перед показом учащимся — статус изменится с «Записано» на «Проверено».</p>
      </div>
    </div>
  );
}
