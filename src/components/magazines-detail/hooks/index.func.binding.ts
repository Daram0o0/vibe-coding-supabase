'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabaseRest, getThumbnailUrl } from '@/lib/supabase';

type RawMagazine = {
  id: string;
  image_url?: string | null;
  category: string;
  title: string;
  description: string;
  content: string;
  tags: string[] | null;
};

export type MagazineDetailView = {
  id: string;
  image: string; // UI 호환용 (image_url 미사용시 플레이스홀더)
  category: string;
  title: string;
  description: string;
  tags: string[];
  date: string; // DB에 없으므로 빈 값 유지
  content: string[]; // 본문은 UI가 배열을 기대하므로 분리
};

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1512427691650-1f998af3d86b?q=80&w=1600&auto=format&fit=crop';

function mapToView(raw: RawMagazine): MagazineDetailView {
  const contentArray = raw.content
    ? raw.content
        .split(/\n\n+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // image_url로 썸네일 생성 (width: 852px, resize: contain)
  const thumbnailImage = raw.image_url
    ? getThumbnailUrl(raw.image_url, 'vibe-coding-storage', {
        width: 852,
        resize: 'contain',
      })
    : PLACEHOLDER_IMAGE;

  return {
    id: raw.id,
    image: thumbnailImage,
    category: raw.category,
    title: raw.title,
    description: raw.description,
    tags: raw.tags ?? [],
    date: '',
    content: contentArray.length > 0 ? contentArray : [raw.content || ''],
  };
}

export function useMagazineDetailBinding(id: string | undefined) {
  const [data, setData] = useState<MagazineDetailView | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const canFetch = useMemo(() => typeof id === 'string' && id.length > 0, [id]);

  useEffect(() => {
    if (!canFetch) return;

    let aborted = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const params = new URLSearchParams();
        params.set('id', `eq.${id}`);
        params.set('select', 'id,category,title,description,content,tags,image_url');
        params.set('limit', '1');

        const res = await supabaseRest(`/rest/v1/magazine?${params.toString()}`, {
          method: 'GET',
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `요청 실패 (status: ${res.status})`);
        }

        const json = (await res.json()) as RawMagazine[];
        const first = json[0];

        if (!first) {
          if (!aborted) {
            setData(null);
          }
          return;
        }

        const view = mapToView(first);
        if (!aborted) {
          setData(view);
        }
      } catch (e) {
        if (!aborted) {
          setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
        }
      } finally {
        if (!aborted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      aborted = true;
    };
  }, [canFetch, id]);

  return { data, isLoading, error } as const;
}
