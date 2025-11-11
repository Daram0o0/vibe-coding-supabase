'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface PaymentRecord {
  transaction_key: string;
  status: string;
  start_at: string;
  end_grace_at: string;
  created_at: string;
}

interface PaymentStatus {
  isSubscribed: boolean;
  transactionKey: string | null;
  statusMessage: '구독중' | 'Free';
}

export function usePaymentStatus() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    isSubscribed: false,
    transactionKey: null,
    statusMessage: 'Free',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        // 1. Supabase 클라이언트 초기화
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          console.error('Supabase 환경변수가 설정되어 있지 않습니다.');
          setIsLoading(false);
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // 2. payment 테이블의 모든 레코드 조회
        const { data: payments, error } = await supabase
          .from('payment')
          .select('transaction_key, status, start_at, end_grace_at, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('결제 정보 조회 오류:', error);
          setIsLoading(false);
          return;
        }

        if (!payments || payments.length === 0) {
          setPaymentStatus({
            isSubscribed: false,
            transactionKey: null,
            statusMessage: 'Free',
          });
          setIsLoading(false);
          return;
        }

        // 3. transaction_key로 그룹화하고 각 그룹에서 created_at 최신 1건씩 추출
        const groupedByTransactionKey = new Map<string, PaymentRecord>();

        for (const payment of payments as PaymentRecord[]) {
          const existing = groupedByTransactionKey.get(payment.transaction_key);
          if (!existing || new Date(payment.created_at) > new Date(existing.created_at)) {
            groupedByTransactionKey.set(payment.transaction_key, payment);
          }
        }

        // 4. status === "Paid"이고 start_at <= 현재시각 <= end_grace_at인 것만 필터링
        const now = new Date();
        const activeSubscriptions = Array.from(groupedByTransactionKey.values()).filter((payment) => {
          if (payment.status !== 'Paid') {
            return false;
          }

          const startAt = new Date(payment.start_at);
          const endGraceAt = new Date(payment.end_grace_at);

          return startAt <= now && now <= endGraceAt;
        });

        // 5. 조회 결과에 따른 상태 설정
        if (activeSubscriptions.length > 0) {
          // 조회 결과 1건 이상: 구독중
          setPaymentStatus({
            isSubscribed: true,
            transactionKey: activeSubscriptions[0].transaction_key,
            statusMessage: '구독중',
          });
        } else {
          // 조회 결과 0건: Free
          setPaymentStatus({
            isSubscribed: false,
            transactionKey: null,
            statusMessage: 'Free',
          });
        }
      } catch (error) {
        console.error('결제 상태 조회 오류:', error);
        setPaymentStatus({
          isSubscribed: false,
          transactionKey: null,
          statusMessage: 'Free',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentStatus();
  }, []);

  return {
    ...paymentStatus,
    isLoading,
  };
}
