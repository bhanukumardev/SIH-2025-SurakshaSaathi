'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';

interface ProfileDropdownProps {
  name: string;
  email: string;
  role: string;
}

export default function ProfileDropdown({ name, email, role }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useAuth();

  const toggleDropdown = () => setOpen(!open);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center items-center w-10 h-10 rounded-full bg-orange-400 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {name.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-3 px-4 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{email}</p>
            <p className="text-xs text-gray-400">{role}</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => router.push('/profile')}
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white w-full"
            >
              <svg
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.88 6.196 9 9 0 015.12 17.804z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Profile
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white w-full"
            >
              <svg
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12a9 9 0 100-18 9 9 0 000 18z" />
              </svg>
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white w-full"
            >
              <svg
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16v-1a4 4 0 014-4h3" />
              </svg>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
