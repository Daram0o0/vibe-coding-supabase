'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabaseRest, getThumbnailUrl } from '@/lib/supabase';

export type MagazineItem = {
  id: string;
  image_url: string;
  category: string;
  title: string;
  description: string;
  tags: string[] | null;
  thumbnail_url: string; // 썸네일 URL 추가
};

type UseMagazinesBindingResult = {
  magazines: MagazineItem[];
  isLoading: boolean;
  error: string | null;
};

export function useMagazinesBinding(): UseMagazinesBindingResult {
  const [magazines, setMagazines] = useState<MagazineItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const requestPath = useMemo(() => {
    const select = encodeURIComponent('id,image_url,category,title,description,tags');
    return `/rest/v1/magazine?select=${select}&limit=10`;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchMagazines() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await supabaseRest(requestPath, { method: 'GET' });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to fetch magazines: ${res.status}`);
        }
        const data = (await res.json()) as Omit<MagazineItem, 'thumbnail_url'>[];
        if (!isMounted) return;

        // 각 매거진에 썸네일 URL 추가
        const magazinesWithThumbnails: MagazineItem[] = data.map((item) => ({
          ...item,
          thumbnail_url: getThumbnailUrl(item.image_url, 'vibe-coding-storage', {
            width: 323,
            resize: 'contain',
          }),
        }));

        setMagazines(Array.isArray(magazinesWithThumbnails) ? magazinesWithThumbnails : []);
      } catch (e) {
        if (!isMounted) return;
        setError(e instanceof Error ? e.message : 'Unknown error');
        setMagazines([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchMagazines();
    return () => {
      isMounted = false;
    };
  }, [requestPath]);

  return { magazines, isLoading, error };
}
