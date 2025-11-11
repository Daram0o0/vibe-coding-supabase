import { NextRequest, NextResponse } from 'next/server';

interface CancelRequest {
  transactionKey: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. 요청 데이터 파싱 및 검증
    const body: CancelRequest = await request.json();

    if (!body.transactionKey) {
      return NextResponse.json({ success: false, error: 'transactionKey가 누락되었습니다.' }, { status: 400 });
    }

    // 2. 포트원 API Secret 확인
    const portoneApiSecret = process.env.PORTONE_API_SECRET;
    if (!portoneApiSecret) {
      return NextResponse.json({ success: false, error: '포트원 API Secret이 설정되지 않았습니다.' }, { status: 500 });
    }

    // 3. 포트원 V2 API 호출 - 결제 취소
    const portoneResponse = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(body.transactionKey)}/cancel`,
      {
        method: 'POST',
        headers: {
          Authorization: `PortOne ${portoneApiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: '취소 사유 없음',
        }),
      },
    );

    // 4. 포트원 API 응답 처리
    if (!portoneResponse.ok) {
      const errorData = await portoneResponse.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: '포트원 결제 취소 요청에 실패했습니다.', details: errorData },
        { status: portoneResponse.status },
      );
    }

    // 5. 성공 응답 반환 (DB 저장 없이 응답만 반환)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('결제 취소 API 오류:', error);
    return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

