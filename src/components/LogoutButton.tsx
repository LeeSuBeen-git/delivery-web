"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('로그아웃에 실패했습니다.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 border border-rose-100 hover:bg-rose-100 hover:text-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {loading ? '로그아웃 중...' : '로그아웃'}
    </button>
  );
}
