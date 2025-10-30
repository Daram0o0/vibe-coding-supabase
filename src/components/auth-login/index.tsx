'use client';
import React from 'react';
import { BookOpen, UserPlus, Bookmark, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

interface Feature {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}

export default function AuthLogin() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    console.log('구글로 로그인하기');
    // TODO: 실제 구글 로그인 로직 구현
  };

  const handleFreeContent = () => {
    console.log('로그인 없이 무료 콘텐츠 둘러보기');
    router.push('/magazines');
  };

  const handleTermsClick = () => {
    console.log('이용약관 클릭');
    // TODO: 이용약관 페이지로 라우팅
  };

  const handlePrivacyClick = () => {
    console.log('개인정보처리방침 클릭');
    // TODO: 개인정보처리방침 페이지로 라우팅
  };

  const features: Feature[] = [
    {
      icon: UserPlus,
      text: '무료 회원가입',
    },
    {
      icon: TrendingUp,
      text: '맞춤형 콘텐츠 추천',
    },
    {
      icon: Bookmark,
      text: '북마크 & 저장',
    },
  ];

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        {/* 아이콘 영역 */}
        <header className={styles.iconContainer}>
          <BookOpen className={styles.icon} strokeWidth={1.5} />
        </header>

        {/* 메시지 영역 */}
        <h1 className={styles.title}>IT 매거진</h1>
        <p className={styles.subtitle}>최신 기술 트렌드와 인사이트를 한곳에서</p>
        <p className={styles.description}>로그인하고 개인 맞춤형 콘텐츠를 추천받으세요</p>

        {/* 구글 로그인 버튼 */}
        <button className={styles.googleButton} onClick={handleGoogleLogin}>
          <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
          Google로 계속하기
        </button>

        {/* 구분선 + 또는 */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerText}>또는</span>
        </div>

        {/* 무료 콘텐츠 버튼 */}
        <button className={styles.freeButton} onClick={handleFreeContent}>
          로그인 없이 무료 콘텐츠 둘러보기
        </button>

        {/* 이용약관 텍스트 */}
        <p className={styles.terms}>
          로그인하면{' '}
          <span className={styles.termsLink} onClick={handleTermsClick}>
            이용약관
          </span>{' '}
          및{' '}
          <span className={styles.termsLink} onClick={handlePrivacyClick}>
            개인정보처리방침
          </span>
          에 동의하게 됩니다
        </p>

        {/* 구분선 */}
        <div className={styles.separator} />

        {/* 하단 정보 */}
        <ul className={styles.featureList}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <li key={index} className={styles.featureItem}>
                <IconComponent className={styles.featureIcon} strokeWidth={2} />
                <span>{feature.text}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
