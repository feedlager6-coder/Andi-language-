import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import {
  useListMyTranslationHistory,
  useAddMyHistoryEntry,
} from "@workspace/api-client-react";

const STORAGE_KEY = "andi_translator_history";
const MAX_HISTORY = 5;

function getLocalHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function addLocalHistory(text: string) {
  const hist = getLocalHistory().filter(h => h !== text);
  hist.unshift(text);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hist.slice(0, MAX_HISTORY)));
  return hist.slice(0, MAX_HISTORY);
}

export function useTranslatorHistory() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [localHistory, setLocalHistory] = useState<string[]>(getLocalHistory);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: remoteHistory, refetch } = useListMyTranslationHistory(
    { limit: MAX_HISTORY },
    { query: { enabled: isAuthenticated } as any },
  );

  const addMutation = useAddMyHistoryEntry({
    mutation: { onSuccess: () => refetch() },
  });

  const history: string[] = isAuthenticated
    ? (remoteHistory || []).map(h => h.inputText)
    : localHistory;

  const record = useCallback((inputText: string, resultText?: string, confidence?: number) => {
    if (isAuthenticated) {
      addMutation.mutate({ data: { inputText, resultText: resultText ?? null, confidence: confidence ?? null } });
    } else {
      setLocalHistory(addLocalHistory(inputText));
    }
  }, [isAuthenticated, addMutation]);

  useEffect(() => {
    if (!authLoading) setLocalHistory(getLocalHistory());
  }, [authLoading]);

  return { history, record, isAuthenticated };
}
