import { createClient } from '@supabase/supabase-js';

export function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase 환경변수가 설정되어 있지 않습니다.');
  }

  return { url: supabaseUrl, anonKey: supabaseAnonKey };
}

export function getSupabaseStorageClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createClient(url, anonKey).storage;
}

/**
 * Supabase Storage의 getPublicUrl을 사용하여 이미지 썸네일 URL을 생성합니다.
 * @param imageUrl - 이미지 URL (전체 URL 또는 경로)
 * @param bucket - 버킷명 (기본값: 'vibe-coding-storage')
 * @param transformOptions - 이미지 변환 옵션
 * @returns 썸네일 URL
 */
export function getThumbnailUrl(
  imageUrl: string | null | undefined,
  bucket: string = 'vibe-coding-storage',
  transformOptions: { width?: number; resize?: 'contain' | 'cover' | 'fill' } = { width: 323, resize: 'contain' },
): string {
  if (!imageUrl) {
    return '/icons/google.svg'; // 기본 이미지
  }

  try {
    const storage = getSupabaseStorageClient();

    // imageUrl이 전체 URL인 경우 경로만 추출
    // 예: https://[project].supabase.co/storage/v1/object/public/vibe-coding-storage/2024/01/01/uuid.jpg
    // => 2024/01/01/uuid.jpg
    let filePath = imageUrl;
    const publicUrlPattern = /\/storage\/v1\/object\/public\/[^/]+\/(.+)$/;
    const match = imageUrl.match(publicUrlPattern);
    if (match) {
      filePath = match[1];
    }

    // getPublicUrl을 사용하여 기본 URL 가져오기
    const { data } = storage.from(bucket).getPublicUrl(filePath);
    let thumbnailUrl = data.publicUrl;

    // Image Transformation 쿼리 파라미터 추가
    const params = new URLSearchParams();
    if (transformOptions.width) {
      params.append('width', String(transformOptions.width));
    }
    if (transformOptions.resize) {
      params.append('resize', transformOptions.resize);
    }

    // URL에 쿼리 파라미터 추가 (이미 쿼리 파라미터가 있는 경우 & 사용)
    if (params.toString()) {
      thumbnailUrl += (thumbnailUrl.includes('?') ? '&' : '?') + params.toString();
    }

    return thumbnailUrl;
  } catch (error) {
    // 에러 발생 시 원본 URL 반환
    console.warn('썸네일 URL 생성 실패:', error);
    return imageUrl;
  }
}

export async function supabaseRest(path: string, init?: RequestInit) {
  const { url, anonKey } = getSupabaseEnv();
  const base = url.replace(/\/$/, '');
  const defaultHeaders: Record<string, string> = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  };

  const mergedHeaders = {
    ...defaultHeaders,
    ...(init?.headers as Record<string, string> | undefined),
  };

  return fetch(`${base}${path}`, {
    ...init,
    headers: mergedHeaders,
  });
}
