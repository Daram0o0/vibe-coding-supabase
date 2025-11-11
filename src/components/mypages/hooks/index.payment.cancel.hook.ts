'use client';

import { useRouter } from 'next/navigation';

interface CancelRequest {
  transactionKey: string;
}

interface CancelResponse {
  success: boolean;
  error?: string;
}

export function usePaymentCancel() {
  const router = useRouter();

  const cancelSubscription = async (transactionKey: string): Promise<void> => {
    try {
      // 구독 취소 API 호출
      const response = await fetch('/api/payments/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionKey,
        } as CancelRequest),
      });

      const result: CancelResponse = await response.json();

      if (result.success) {
        // 구독 취소 성공
        alert('구독이 취소되었습니다.');
        router.push('/magazines');
      } else {
        alert(`구독 취소에 실패했습니다: ${result.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('구독 취소 처리 오류:', error);
      alert('구독 취소 처리 중 오류가 발생했습니다.');
    }
  };

  return {
    cancelSubscription,
  };
}
