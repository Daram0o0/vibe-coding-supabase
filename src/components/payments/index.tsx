'use client';
import React from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import styles from './styles.module.css';
import { usePayment } from './hooks/index.payment.hook';

interface SubscriptionData {
  planName: string;
  description: string;
  price: string;
  currency: string;
  period: string;
  features: string[];
}

const subscriptionData: SubscriptionData = {
  planName: '월간 구독',
  description: '모든 IT 매거진 콘텐츠에 무제한 접근',
  price: '9,900',
  currency: '원',
  period: '/월',
  features: ['모든 프리미엄 아티클 열람', '최신 기술 트렌드 리포트', '광고 없는 읽기 환경', '언제든지 구독 취소 가능'],
};

export default function Payments() {
  const { requestIssueBillingKey } = usePayment();

  const handleSubscribe = async () => {
    await requestIssueBillingKey();
  };

  const handleBackToList = () => {
    window.history.back();
  };

  return (
    <main className={styles.container}>
      <button className={styles.backButton} onClick={handleBackToList}>
        <ArrowLeft className={styles.backIcon} />
        <span>목록으로</span>
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}>IT 매거진 구독</h1>
        <p className={styles.subtitle}>프리미엄 콘텐츠를 제한 없이 이용하세요</p>
      </header>

      <section className={styles.card}>
        <div className={styles.planHeader}>
          <h2 className={styles.planName}>{subscriptionData.planName}</h2>
          <p className={styles.planDescription}>{subscriptionData.description}</p>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.price}>
            {subscriptionData.price}
            <span className={styles.currency}>{subscriptionData.currency}</span>
          </div>
          <div className={styles.period}>{subscriptionData.period}</div>
        </div>

        <ul className={styles.featuresList}>
          {subscriptionData.features.map((feature, index) => (
            <li key={index} className={styles.featureItem}>
              <Check className={styles.featureIcon} strokeWidth={2.5} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button className={styles.subscribeButton} onClick={handleSubscribe}>
          구독하기
        </button>
      </section>
    </main>
  );
}
