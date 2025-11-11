'use client';
import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePaymentCancel } from './hooks/index.payment.cancel.hook';
import styles from './styles.module.css';

export default function MyPage() {
  const router = useRouter();
  const { cancelSubscription } = usePaymentCancel();

  const handleBackToList = () => {
    router.push('/magazines');
  };

  const handleCancelSubscription = async () => {
    // TODO: 실제 transactionKey는 Supabase에서 가져와야 함
    // 임시로 테스트용 transactionKey 사용
    const transactionKey = 'test-transaction-key';
    await cancelSubscription(transactionKey);
  };

  return (
    <main className={styles.container}>
      {/* 목록으로 버튼 */}
      <button className={styles.backButton} onClick={handleBackToList}>
        <ArrowLeft className={styles.backIcon} />
        <span>목록으로</span>
      </button>

      {/* 헤더 섹션 */}
      <div className={styles.headerSection}>
        <h1 className={styles.mainTitle}>IT 매거진 구독</h1>
        <p className={styles.subtitle}>프리미엄 콘텐츠를 제한 없이 이용하세요</p>
      </div>

      {/* 프로필 카드 */}
      <div className={styles.profileCard}>
        <div className={styles.profileImageContainer}>
          <Image src="/icons/google.svg" alt="테크러버" width={120} height={120} className={styles.profileImage} />
        </div>
        <h2 className={styles.profileName}>테크러버</h2>
        <p className={styles.profileDescription}>최신 IT 트렌드와 개발 이야기를 공유합니다</p>
        <div className={styles.joinDateBadge}>
          <span>가입일 2024.03</span>
        </div>
      </div>

      {/* 구독 플랜 카드 */}
      <div className={styles.subscriptionCard}>
        <div className={styles.subscriptionHeader}>
          <h3 className={styles.subscriptionTitle}>구독 플랜</h3>
          <div className={styles.subscriptionBadge}>
            <span>구독중</span>
          </div>
        </div>
        <div className={styles.subscriptionContent}>
          <h4 className={styles.planName}>IT Magazine Premium</h4>
          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <Check className={styles.checkIcon} />
              <span>모든 프리미엄 콘텐츠 무제한 이용</span>
            </li>
            <li className={styles.featureItem}>
              <Check className={styles.checkIcon} />
              <span>매주 새로운 IT 트렌드 리포트</span>
            </li>
            <li className={styles.featureItem}>
              <Check className={styles.checkIcon} />
              <span>광고 없는 깔끔한 읽기 환경</span>
            </li>
          </ul>
          <button className={styles.cancelButton} onClick={handleCancelSubscription}>
            구독 취소
          </button>
        </div>
      </div>
    </main>
  );
}
