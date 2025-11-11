import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import axios from 'axios';

interface SubscriptionRequest {
  payment_id: string;
  status: 'Paid' | 'Cancelled';
}

// PortOne API 응답 구조는 다양할 수 있으므로 any 타입으로 처리

export async function POST(request: NextRequest) {
  try {
    // 1. 요청 데이터 파싱 및 검증
    const body: SubscriptionRequest = await request.json();

    if (!body.payment_id || !body.status) {
      return NextResponse.json({ success: false, error: '필수 파라미터가 누락되었습니다.' }, { status: 400 });
    }

    if (body.status !== 'Paid' && body.status !== 'Cancelled') {
      return NextResponse.json(
        { success: false, error: 'status는 "Paid" 또는 "Cancelled"여야 합니다.' },
        { status: 400 },
      );
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

      const paymentData: unknown = await paymentResponse.json();

      // 응답 데이터 로깅 (디버깅용)
      console.log('PortOne 결제정보 응답:', JSON.stringify(paymentData, null, 2));

      // paymentId 추출 (다양한 필드명 대응)
      const paymentDataObj = paymentData as Record<string, unknown>;
      const transactionKey =
        (paymentDataObj.paymentId as string) ||
        (paymentDataObj.id as string) ||
        (paymentDataObj.payment_id as string) ||
        body.payment_id;

      // amount 추출 (다양한 구조 대응)
      const amountObj = paymentDataObj.amount as Record<string, unknown> | number | undefined;
      const amountValue =
        (typeof amountObj === 'object' && amountObj && (amountObj.total as number)) ||
        (typeof amountObj === 'number' ? amountObj : 0) ||
        0;

      if (!transactionKey) {
        return NextResponse.json(
          { success: false, error: '결제정보에서 paymentId를 찾을 수 없습니다.', details: paymentData },
          { status: 500 },
        );
      }

      // 4-2) 현재 시각 및 계산된 날짜 생성
      const now = new Date();
      const endAt = new Date(now);
      endAt.setDate(endAt.getDate() + 30); // 현재시각 + 30일

      const endGraceAt = new Date(now);
      endGraceAt.setDate(endGraceAt.getDate() + 31); // 현재시각 + 31일

      // next_schedule_at: end_at + 1일 오전 10시~11시(한국 KST 기준) 사이 임의 시각
      const nextScheduleAt = new Date(endAt);
      nextScheduleAt.setDate(nextScheduleAt.getDate() + 1);
      // 한국 시간대(KST, UTC+9) 기준으로 10시~11시 사이 임의 시각 생성
      const year = nextScheduleAt.getUTCFullYear();
      const month = String(nextScheduleAt.getUTCMonth() + 1).padStart(2, '0');
      const day = String(nextScheduleAt.getUTCDate()).padStart(2, '0');
      const hour = 10; // KST 10시
      const minute = Math.floor(Math.random() * 60); // 0~59분
      const second = Math.floor(Math.random() * 60); // 0~59초
      // ISO 8601 형식으로 KST 시간대 명시: YYYY-MM-DDTHH:mm:ss+09:00
      const kstDateString = `${year}-${month}-${day}T${String(hour).padStart(2, '0')}:${String(minute).padStart(
        2,
        '0',
      )}:${String(second).padStart(2, '0')}+09:00`;
      const nextScheduleAtKST = new Date(kstDateString);

      // next_schedule_id: 임의로 생성한 UUID
      const nextScheduleId = randomUUID();

      // 4-3) Supabase의 payment 테이블에 등록
      const { error: insertError } = await supabase.from('payment').insert({
        transaction_key: transactionKey,
        amount: amountValue,
        status: 'Paid',
        start_at: now.toISOString(),
        end_at: endAt.toISOString(),
        end_grace_at: endGraceAt.toISOString(),
        next_schedule_at: nextScheduleAtKST.toISOString(),
        next_schedule_id: nextScheduleId,
      });

      if (insertError) {
        console.error('Supabase 저장 오류:', insertError);
        return NextResponse.json({ success: false, error: '결제정보 저장에 실패했습니다.' }, { status: 500 });
      }

      // 4-4) 다음달 구독예약 시나리오
      // billingKey가 있는 경우에만 예약 가능
      const customerObj = paymentDataObj.customer as Record<string, unknown> | undefined;
      const billingKey = (paymentDataObj.billingKey as string) || (paymentDataObj.billing_key as string);
      const orderName =
        (paymentDataObj.orderName as string) || (paymentDataObj.order_name as string) || 'IT 매거진 월간 구독';
      const customerId = (customerObj?.id as string) || (paymentDataObj.customer_id as string);

      if (billingKey && orderName && customerId) {
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
                billingKey: billingKey,
                orderName: orderName,
                customer: {
                  id: customerId,
                },
                amount: {
                  total: amountValue,
                },
                currency: 'KRW',
              },
              timeToPay: nextScheduleAtKST.toISOString(),
            }),
          },
        );

        if (!scheduleResponse.ok) {
          const errorData = await scheduleResponse.json().catch(() => ({}));
          console.error('구독 예약 오류:', errorData);
          // 예약 실패해도 결제는 성공했으므로 경고만 로그로 남기고 계속 진행
        }
      } else {
        console.warn('구독 예약을 위한 필수 정보가 없습니다:', {
          billingKey: !!billingKey,
          orderName: !!orderName,
          customerId: !!customerId,
        });
      }
    }

    // 5. 구독결제취소 시나리오 (status가 "Cancelled"인 경우)
    if (body.status === 'Cancelled') {
      // 5-1) paymentId의 결제정보를 조회
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

      const paymentData: unknown = await paymentResponse.json();
      const paymentDataObj = paymentData as Record<string, unknown>;
      const paymentId =
        (paymentDataObj.paymentId as string) ||
        (paymentDataObj.id as string) ||
        (paymentDataObj.payment_id as string) ||
        body.payment_id;

      // 5-2) supabase의 테이블에서 조회
      const { data: existingPayment, error: selectError } = await supabase
        .from('payment')
        .select('*')
        .eq('transaction_key', paymentId)
        .single();

      if (selectError || !existingPayment) {
        return NextResponse.json(
          { success: false, error: '결제정보를 찾을 수 없습니다.', details: selectError },
          { status: 404 },
        );
      }

      // 5-3) supabase의 테이블에 취소 레코드 등록
      const { error: insertError } = await supabase.from('payment').insert({
        transaction_key: existingPayment.transaction_key,
        amount: -existingPayment.amount,
        status: 'Cancel',
        start_at: existingPayment.start_at,
        end_at: existingPayment.end_at,
        end_grace_at: existingPayment.end_grace_at,
        next_schedule_at: existingPayment.next_schedule_at,
        next_schedule_id: existingPayment.next_schedule_id,
      });

      if (insertError) {
        console.error('Supabase 취소 레코드 저장 오류:', insertError);
        return NextResponse.json({ success: false, error: '취소 정보 저장에 실패했습니다.' }, { status: 500 });
      }

      // 5-4) 다음달 구독예약취소 시나리오
      if (existingPayment.next_schedule_at && existingPayment.next_schedule_id) {
        const billingKey = (paymentDataObj.billingKey as string) || (paymentDataObj.billing_key as string);

        if (billingKey) {
          // next_schedule_at 기준으로 ±1일 범위 계산
          const nextScheduleAt = new Date(existingPayment.next_schedule_at);
          const fromDate = new Date(nextScheduleAt);
          fromDate.setDate(fromDate.getDate() - 1);
          const untilDate = new Date(nextScheduleAt);
          untilDate.setDate(untilDate.getDate() + 1);

          try {
            // 5-4-1) 예약된 결제정보를 조회 (GET with body - axios 사용)
            const schedulesResponse = await axios({
              method: 'GET',
              url: 'https://api.portone.io/payment-schedules',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `PortOne ${portoneApiSecret}`,
              },
              data: {
                filter: {
                  billingKey: billingKey,
                  from: fromDate.toISOString(),
                  until: untilDate.toISOString(),
                },
              },
            });

            // 5-4-2) items를 순회하여 schedule 객체의 id 추출
            const schedulesData = schedulesResponse.data as Record<string, unknown>;
            const items = (schedulesData.items as Array<Record<string, unknown>>) || [];
            const targetScheduleId = items.find(
              (item) => (item.paymentId as string) === existingPayment.next_schedule_id,
            )?.id as string;

            // 5-4-3) 포트원에 다음달 구독예약을 취소
            if (targetScheduleId) {
              const deleteResponse = await fetch('https://api.portone.io/payment-schedules', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `PortOne ${portoneApiSecret}`,
                },
                body: JSON.stringify({
                  scheduleIds: [targetScheduleId],
                }),
              });

              if (!deleteResponse.ok) {
                const errorData = await deleteResponse.json().catch(() => ({}));
                console.error('구독 예약 취소 오류:', errorData);
                // 예약 취소 실패해도 취소는 성공했으므로 경고만 로그로 남기고 계속 진행
              }
            } else {
              console.warn('취소할 예약 스케줄을 찾을 수 없습니다.');
            }
          } catch (error) {
            console.error('구독 예약 조회/취소 중 오류 발생:', error);
            // 예약 취소 실패해도 취소는 성공했으므로 경고만 로그로 남기고 계속 진행
          }
        } else {
          console.warn('구독 예약 취소를 위한 billingKey가 없습니다.');
        }
      }
    }

    // 6. 성공 응답 반환
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('구독 결제 API 오류:', error);
    return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
