'use client';

import * as PortOne from '@portone/browser-sdk/v2';
import { useRouter } from 'next/navigation';

interface PaymentRequest {
  billingKey: string;
  orderName: string;
  amount: number;
  customer: {
    id: string;
  };
}

interface PaymentResponse {
  success: boolean;
  error?: string;
}

export function usePayment() {
  const router = useRouter();

  const requestIssueBillingKey = async (): Promise<void> => {
    try {
      // 환경 변수에서 storeId와 channelKey 가져오기
      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
      const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;

      if (!storeId || !channelKey) {
        alert('포트원 설정이 완료되지 않았습니다. 관리자에게 문의하세요.');
        return;
      }

      // 고유한 issueId 생성
      const issueId = `issue-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

      // 빌링키 발급 요청
      const issueResponse = await PortOne.requestIssueBillingKey({
        storeId,
        channelKey,
        billingKeyMethod: 'CARD',
        issueId,
        issueName: 'IT 매거진 월간 구독',
        customer: {
          customerId: `customer-${Date.now()}`,
        },
      });

      // 응답이 없는 경우
      if (!issueResponse) {
        alert('빌링키 발급 응답을 받을 수 없었습니다.');
        return;
      }

      // 에러 코드가 있는 경우 - 실패 처리 (빌링키가 있어도 에러 코드가 있으면 실패)
      if (issueResponse.code !== undefined) {
        const errorMessage = issueResponse.message || '알 수 없는 오류';
        alert(`빌링키 발급에 실패했습니다: ${errorMessage}`);
        console.error('빌링키 발급 실패:', {
          code: issueResponse.code,
          message: issueResponse.message,
          pgCode: 'pgCode' in issueResponse ? (issueResponse as { pgCode?: string }).pgCode : undefined,
          pgMessage: 'pgMessage' in issueResponse ? (issueResponse as { pgMessage?: string }).pgMessage : undefined,
        });
        return;
      }

      // 빌링키가 있는 경우 - 성공
      if (issueResponse.billingKey) {
        await processPayment(issueResponse.billingKey);
      } else {
        // 빌링키가 없는 경우
        alert(`빌링키를 받을 수 없었습니다: ${issueResponse.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('빌링키 발급 오류:', error);
      alert('빌링키 발급 중 오류가 발생했습니다.');
    }
  };

  const processPayment = async (billingKey: string): Promise<void> => {
    try {
      // 결제 요청 데이터 준비
      const paymentData: PaymentRequest = {
        billingKey,
        orderName: 'IT 매거진 월간 구독',
        amount: 9900, // 9,900원
        customer: {
          id: `customer-${Date.now()}`,
        },
      };

      // 결제 API 호출
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result: PaymentResponse = await response.json();

      if (result.success) {
        // 구독 결제 성공
        alert('구독에 성공하였습니다.');
        router.push('/magazines');
      } else {
        alert(`결제에 실패했습니다: ${result.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('결제 처리 오류:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };

  return {
    requestIssueBillingKey,
  };
}
