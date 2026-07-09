'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Menu, Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  onMenuClick: () => void;
  displayName: string;
  displayLevel: string;
  avatarUrl: string;
}

export default function Header({
  onMenuClick,
  displayName,
  displayLevel,
  avatarUrl,
}: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    });

    if (dotRef.current) {
      gsap.to(dotRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 1.4,
        repeat: -1,
        ease: 'power1.out',
      });
    }

    return () => ctx.revert();
  }, []);

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6"
    >
      <div className="flex items-center gap-3">
        <button
          className="rounded-xl p-1.5 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2 rounded-xl bg-slate-100/80 px-3.5 py-2.5 transition-colors focus-within:bg-slate-100 sm:flex">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <Input
            type="search"
            placeholder="Search courses, topics, past questions…"
            className="h-auto w-56 p-0 text-[13.5px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className="relative rounded-xl p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span
              ref={dotRef}
              className="absolute inline-flex h-full w-full rounded-full bg-pink-400"
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500" />
          </span>
        </button>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-slate-50"
        >
          <Avatar className="h-9 w-9 ring-2 ring-white shadow-[0_0_0_1.5px_#EDE9FE]">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-left leading-tight md:block">
            <span className="block text-[13px] font-semibold text-slate-800">
              {displayName}
            </span>
            <span className="block text-[11px] text-slate-400">{displayLevel}</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
