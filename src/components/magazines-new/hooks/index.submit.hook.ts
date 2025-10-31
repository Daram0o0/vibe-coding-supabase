'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseRest, getSupabaseEnv } from '@/lib/supabase';

interface SubmitPayload {
  image: File | null;
  category: string;
  title: string;
  description: string;
  content: string;
  tags: string; // space or hashtag separated string from UI
}

function parseTagsToArray(tagsInput: string): string[] | null {
  if (!tagsInput) return null;
  const tokens = tagsInput
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.startsWith('#') ? t.slice(1) : t));
  return tokens.length > 0 ? tokens : null;
}

export function useSubmitMagazine() {
  const router = useRouter();

  const submit = useCallback(
    async (payload: SubmitPayload) => {
      const tagsArray = parseTagsToArray(payload.tags);
      let imageUrl: string | null = null;

      // 1) 이미지가 있으면 스토리지 업로드 (버킷: vibe-coding-storage, 경로: yyyy/mm/dd/{UUID}.jpg)
      if (payload.image) {
        const { url, anonKey } = getSupabaseEnv();
        const base = url.replace(/\/$/, '');

        const now = new Date();
        const yyyy = String(now.getFullYear());
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const uuid = globalThis.crypto?.randomUUID
          ? globalThis.crypto.randomUUID()
          : Math.random().toString(36).slice(2);
        const objectPath = `${yyyy}/${mm}/${dd}/${uuid}.jpg`;

        const uploadRes = await fetch(`${base}/storage/v1/object/vibe-coding-storage/${objectPath}`, {
          method: 'POST',
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            'Content-Type': payload.image.type || 'image/jpeg',
          },
          body: payload.image,
        });

        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          alert(`이미지 업로드에 실패하였습니다: ${errText}`);
          return;
        }

        // 공개 URL 구성 (버킷이 public 이라고 가정)
        imageUrl = `${base}/storage/v1/object/public/vibe-coding-storage/${objectPath}`;
      }

      // 2) 매거진 레코드 등록
      const response = await supabaseRest('/rest/v1/magazine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          category: payload.category,
          title: payload.title,
          description: payload.description,
          content: payload.content,
          tags: tagsArray,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        alert(`등록에 실패하였습니다: ${errText}`);
        return;
      }

      const data = (await response.json()) as Array<{ id: string | number }>;
      const inserted = data?.[0];
      alert('등록에 성공하였습니다.');
      router.push(`/magazines/${inserted.id}`);
    },
    [router],
  );

  return { submit };
}
