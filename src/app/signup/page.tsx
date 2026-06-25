"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [emailDomain, setEmailDomain] = useState('naver.com');
  const [customDomain, setCustomDomain] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return false;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    return hasUppercase && hasLowercase && hasDigit && hasSpecial;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. 이메일 주소 조합
    const selectedDomain = emailDomain === 'custom' ? customDomain.trim() : emailDomain;
    if (!emailId.trim() || !selectedDomain) {
      setError('이메일 주소를 정확히 입력해 주세요.');
      return;
    }
    const fullEmail = `${emailId.trim()}@${selectedDomain}`;

    // 2. 비밀번호 복잡도 체크
    if (!validatePassword(password)) {
      setError('비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.');
      return;
    }

    // 3. 비밀번호 불일치 체크
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: fullEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '회원가입 중 오류가 발생했습니다.');
      }

      setSuccess('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      
      // 1.5초 후 로그인 페이지 리다이렉트
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-slate-50 px-4 py-16 text-zinc-800 font-sans">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900">
            배달리스트 회원가입
          </h2>
          <p className="mt-2 text-sm text-zinc-400 font-medium">
            간단하게 가입하고 신선함을 배달받으세요
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-100 bg-rose-50 p-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-600">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                별명
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-850 placeholder-zinc-450 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                placeholder="예: 배고픈사자"
              />
            </div>

            <div>
              <label htmlFor="email-id" className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                이메일 주소
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="email-id"
                  name="emailId"
                  type="text"
                  required
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-800 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                  placeholder="example"
                />
                <span className="text-zinc-400 font-bold">@</span>
                <select
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                >
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="daum.net">daum.net</option>
                  <option value="kakao.com">kakao.com</option>
                  <option value="outlook.com">outlook.com</option>
                  <option value="custom">직접 입력</option>
                </select>
              </div>
              
              {emailDomain === 'custom' && (
                <input
                  type="text"
                  required
                  placeholder="도메인 직접 입력 (예: school.ac.kr)"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-800 placeholder-zinc-450 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                />
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-850 placeholder-zinc-450 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                placeholder="••••••••"
              />
              <p className="mt-1.5 text-[11px] text-zinc-400 font-medium">
                🔒 대문자, 소문자, 숫자, 특수문자를 포함해 8자 이상
              </p>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                비밀번호 확인
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-850 placeholder-zinc-450 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 py-3 text-sm font-bold text-white transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-500/10"
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-zinc-500 font-medium">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-500 cursor-pointer">
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
}
