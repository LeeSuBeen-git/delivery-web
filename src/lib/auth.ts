import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const COOKIE_NAME = 'auth_token';

export interface JWTPayload {
  userId: string;
}

// 1. JWT 서명
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// 2. JWT 검증
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// 3. 환경별 쿠키 설정 반환
export function getCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isProd,
    maxAge: 60 * 60 * 24 * 7, // 7일 (초 단위)
    path: '/',
  };
}

// 4. 비밀번호 해싱
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// 5. 비밀번호 검증
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 6. 현재 로그인 사용자 조회 helper (Server Component, Route Handler 전용)
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}
