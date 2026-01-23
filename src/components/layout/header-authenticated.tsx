/**
 * Authenticated Header (After Login)
 * @author Matteo Owona, Rouchda Yampen
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import Image from 'next/image';

interface HeaderAuthenticatedProps {
  userName?: string;
}

export const HeaderAuthenticated: React.FC<HeaderAuthenticatedProps> = ({ userName }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {/* Version avec Image Next.js */}
            <div className="relative w-12 h-12">
              <img
                src="/logo.jpg"
              />

            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Yowyob</h1>
              <p className="text-xs text-gray-600">Search Engine</p>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/home" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">
              Accueil
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">
              Recherche
            </Link>
            <Link href="/map" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">
              Carte
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {userName && (
              <span className="text-sm font-medium text-gray-700 mr-2">
                Bonjour, <span className="text-blue-600 font-bold">{userName}</span>
              </span>
            )}
            <ThemeToggle />
            <Link href="/profile">
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link href="/home" className="text-gray-700 hover:text-blue-600 font-semibold">
                Accueil
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-blue-600 font-semibold">
                Recherche
              </Link>
              <Link href="/map" className="text-gray-700 hover:text-blue-600 font-semibold">
                Carte
              </Link>
              <Link href="/profile">
                <Button variant="outline" fullWidth>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profil
                </Button>
              </Link>
              <Button
                variant="primary"
                fullWidth
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};