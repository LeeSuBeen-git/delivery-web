import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyPassword, signToken, getCookieOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 모두 입력해 주세요.' },
        { status: 400 }
      );
    }

    // 1. 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 2. 비밀번호 확인
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 3. JWT 토큰 생성
    const token = signToken({ userId: user.id });

    // 4. 쿠키 설정
    const cookieStore = await cookies();
    const cookieOpts = getCookieOptions();
    cookieStore.set(cookieOpts.name, token, {
      httpOnly: cookieOpts.httpOnly,
      sameSite: cookieOpts.sameSite,
      secure: cookieOpts.secure,
      maxAge: cookieOpts.maxAge,
      path: cookieOpts.path,
    });

    return NextResponse.json({
      success: true,
      message: '로그인에 성공했습니다.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
