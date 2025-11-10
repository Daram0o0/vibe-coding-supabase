import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

interface SubscriptionRequest {
  payment_id: string;
  status: 'Paid' | 'Cancelled';
}

interface PortOnePaymentResponse {
  paymentId: string;
  amount: {
    total: number;
  };
  billingKey?: string;
  orderName?: string;
  customer?: {
    id: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // 1. 요청 데이터 파싱 및 검증
    const body: SubscriptionRequest = await request.json();

    if (!body.payment_id || !body.status) {
      return NextResponse.json({ success: false, error: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    if (body.status !== 'Paid' && body.status !== 'Cancelled') {
      return NextResponse.json({ success: false, error: 'status는 "Paid" 또는 "Cancelled"여야 합니다.' }, { status: 400 });
    }

    // 2. 포트원 API Secret 확인
    const portoneApiSecret = process.env.PORTONE_API_SECRET;
    if (!portoneApiSecret) {
      return NextResponse.json({ success: false, error: '포트원 API Secret이 설정되지 않았습니다.' }, { status: 500 });
    }

    // 3. Supabase 클라이언트 초기화
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ success: false, error: 'Supabase 환경변수가 설정되지 않았습니다.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 4. 구독결제완료 시나리오 (status가 "Paid"인 경우)
    if (body.status === 'Paid') {
      // 4-1) paymentId의 결제정보를 조회
      const paymentResponse = await fetch(`https://api.portone.io/payments/${encodeURIComponent(body.payment_id)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `PortOne ${portoneApiSecret}`,
        },
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json().catch(() => ({}));
        return NextResponse.json(
          { success: false, error: '포트원 결제정보 조회에 실패했습니다.', details: errorData },
          { status: paymentResponse.status },
        );
      }

      const paymentData: PortOnePaymentResponse = await paymentResponse.json();

      // 4-2) 현재 시각 및 계산된 날짜 생성
      const now = new Date();
      const endAt = new Date(now);
      endAt.setDate(endAt.getDate() + 30); // 현재시각 + 30일

      const endGraceAt = new Date(now);
      endGraceAt.setDate(endGraceAt.getDate() + 31); // 현재시각 + 31일

      // next_schedule_at: end_at + 1일 오전 10시~11시 사이 임의 시각
      const nextScheduleAt = new Date(endAt);
      nextScheduleAt.setDate(nextScheduleAt.getDate() + 1);
      nextScheduleAt.setHours(10, Math.floor(Math.random() * 60), 0, 0); // 10시 00분~59분 사이

      // next_schedule_id: 임의로 생성한 UUID
      const nextScheduleId = randomUUID();

      // 4-3) Supabase의 payment 테이블에 등록
      const { error: insertError } = await supabase.from('payment').insert({
        transaction_key: paymentData.paymentId,
        amount: paymentData.amount.total,
        status: 'Paid',
        start_at: now.toISOString(),
        end_at: endAt.toISOString(),
        end_grace_at: endGraceAt.toISOString(),
        next_schedule_at: nextScheduleAt.toISOString(),
        next_schedule_id: nextScheduleId,
      });

      if (insertError) {
        console.error('Supabase 저장 오류:', insertError);
        return NextResponse.json({ success: false, error: '결제정보 저장에 실패했습니다.' }, { status: 500 });
      }

      // 4-4) 다음달 구독예약 시나리오
      // billingKey가 있는 경우에만 예약 가능
      if (paymentData.billingKey && paymentData.orderName && paymentData.customer?.id) {
        const scheduleResponse = await fetch(
          `https://api.portone.io/payments/${encodeURIComponent(nextScheduleId)}/schedule`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `PortOne ${portoneApiSecret}`,
            },
            body: JSON.stringify({
              payment: {
                billingKey: paymentData.billingKey,
                orderName: paymentData.orderName,
                customer: {
                  id: paymentData.customer.id,
                },
                amount: {
                  total: paymentData.amount.total,
                },
                currency: 'KRW',
              },
              timeToPay: nextScheduleAt.toISOString(),
            }),
          },
        );

        if (!scheduleResponse.ok) {
          const errorData = await scheduleResponse.json().catch(() => ({}));
          console.error('구독 예약 오류:', errorData);
          // 예약 실패해도 결제는 성공했으므로 경고만 로그로 남기고 계속 진행
        }
      }
    }

    // 5. 성공 응답 반환
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('구독 결제 API 오류:', error);
    return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

