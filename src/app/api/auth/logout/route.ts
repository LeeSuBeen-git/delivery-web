import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCookieOptions } from '@/lib/auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const cookieOpts = getCookieOptions();

    // 쿠키 삭제 (만료 시간을 0으로 지시)
    cookieStore.set(cookieOpts.name, '', {
      ...cookieOpts,
      maxAge: 0,
    });

    return NextResponse.json({
      success: true,
      message: '로그아웃 되었습니다.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
