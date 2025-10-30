'use client';
import React from 'react';
import { LogIn, Edit3, Bell } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';
import { magazineData } from '@/commons/magazineData';

export default function Magazines() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleWrite = () => {
    router.push('/magazines/new');
  };

  const handleSubscribe = () => {
    router.push('/payments');
  };

  const handleArticleClick = (index: number) => {
    router.push(`/magazines/${index}`);
  };

  return (
    <main className={styles.container}>
      {/* 헤더 섹션 */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>IT 매거진</h1>
            <p className={styles.subtitle}>최신 기술 트렌드와 인사이트를 전합니다</p>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.loginButton} onClick={handleLogin}>
              <LogIn className={styles.buttonIcon} />
              <span>로그인</span>
            </button>
            <button className={styles.writeButton} onClick={handleWrite}>
              <Edit3 className={styles.buttonIcon} />
              <span>글쓰기</span>
            </button>
            <button className={styles.subscribeButton} onClick={handleSubscribe}>
              <Bell className={styles.buttonIcon} />
              <span>구독하기</span>
            </button>
          </div>
        </div>
      </header>

      {/* 아티클 그리드 */}
      <section className={styles.articlesGrid}>
        {magazineData.map((article, index) => (
          <article key={index} className={styles.articleCard} onClick={() => handleArticleClick(index)}>
            <div className={styles.imageContainer}>
              <Image
                src={article.image}
                alt={article.title}
                className={styles.articleImage}
                width={323}
                height={200}
                priority={index < 4}
              />
              <div className={`${styles.categoryOverlay} ${styles[article.categoryColor]}`}>{article.category}</div>
            </div>

            <div className={styles.articleContent}>
              <h2 className={styles.articleTitle}>{article.title}</h2>
              <p className={styles.articleDescription}>{article.description}</p>

              <div className={styles.tagsContainer}>
                {article.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
