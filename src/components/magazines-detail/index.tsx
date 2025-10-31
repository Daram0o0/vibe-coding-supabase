'use client';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import styles from './styles.module.css';
import { useParams } from 'next/navigation';
import { useMagazineDetailBinding } from './hooks/index.func.binding';

export default function MagazinesDetail() {
  const params = useParams();
  const id = (params.id as string) || '';
  const { data: magazineData, isLoading, error } = useMagazineDetailBinding(id);

  const handleBackToList = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.content}>
          <h1>불러오는 중...</h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container}>
        <div className={styles.content}>
          <h1>오류가 발생했습니다</h1>
          <p>{error}</p>
          <button className={styles.backButton} onClick={handleBackToList}>
            <ArrowLeft className={styles.backIcon} />
            목록으로
          </button>
        </div>
      </main>
    );
  }

  // 데이터가 없거나 미일치시 404 처리
  if (!magazineData) {
    return (
      <main className={styles.container}>
        <div className={styles.content}>
          <h1>아티클을 찾을 수 없습니다</h1>
          <button className={styles.backButton} onClick={handleBackToList}>
            <ArrowLeft className={styles.backIcon} />
            목록으로
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {/* 뒤로가기 버튼 */}
      <button className={styles.backButton} onClick={handleBackToList}>
        <ArrowLeft className={styles.backIcon} />
        목록으로
      </button>

      {/* 메인 카드 */}
      <article className={styles.card}>
        {/* 이미지 영역 */}
        <header className={styles.imageContainer}>
          <Image src={magazineData.image} alt={magazineData.title} className={styles.image} fill priority />
          <div className={styles.gradientOverlay}></div>
          <div className={styles.categoryBadge}>{magazineData.category}</div>
        </header>

        {/* 본문 영역 */}
        <div className={styles.content}>
          {/* 날짜 (DB 미보유) */}
          {magazineData.date ? <div className={styles.date}>{magazineData.date}</div> : null}

          {/* 제목 */}
          <h1 className={styles.title}>{magazineData.title}</h1>

          {/* 한줄소개 */}
          <div className={styles.introContainer}>
            <p className={styles.intro}>{magazineData.description}</p>
          </div>

          {/* 상세내용 */}
          <div className={styles.body}>
            {magazineData.content.map((paragraph, index) => (
              <p key={index} className={index < magazineData.content.length - 1 ? styles.paragraph : ''}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* 태그 */}
          <div className={styles.tagsContainer}>
            {magazineData.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>

          {/* 목록으로 돌아가기 버튼 */}
          <button className={styles.bottomButton} onClick={handleBackToList}>
            목록으로 돌아가기
          </button>
        </div>
      </article>
    </main>
  );
}
