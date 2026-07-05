import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import {
  useListMyFavorites,
  useAddMyFavorite,
  useRemoveMyFavorite,
} from "@workspace/api-client-react";

const STORAGE_KEY_PREFIX = "andi_favorites_";

function getLocalFavorites(itemType: "word" | "phrase"): Set<number> {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + itemType) || "[]");
    return new Set(stored);
  } catch {
    return new Set();
  }
}

function setLocalFavorites(itemType: "word" | "phrase", ids: Set<number>) {
  localStorage.setItem(STORAGE_KEY_PREFIX + itemType, JSON.stringify([...ids]));
}

export function useFavorites(itemType: "word" | "phrase") {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [localFavs, setLocalFavs] = useState<Set<number>>(() => getLocalFavorites(itemType));

  const { data: remoteFavs, refetch } = useListMyFavorites({
    query: { enabled: isAuthenticated },
  });

  const addMutation = useAddMyFavorite({
    mutation: { onSuccess: () => refetch() },
  });
  const removeMutation = useRemoveMyFavorite({
    mutation: { onSuccess: () => refetch() },
  });

  const favorites: Set<number> = isAuthenticated
    ? new Set((remoteFavs || []).filter(f => f.itemType === itemType).map(f => f.itemId))
    : localFavs;

  const toggle = useCallback((id: number) => {
    if (isAuthenticated) {
      if (favorites.has(id)) {
        removeMutation.mutate({ itemType, itemId: id });
      } else {
        addMutation.mutate({ data: { itemType, itemId: id } });
      }
    } else {
      setLocalFavs(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setLocalFavorites(itemType, next);
        return next;
      });
    }
  }, [isAuthenticated, favorites, itemType, addMutation, removeMutation]);

  useEffect(() => {
    if (!authLoading) setLocalFavs(getLocalFavorites(itemType));
  }, [authLoading, itemType]);

  return { favorites, toggle, isAuthenticated };
}
