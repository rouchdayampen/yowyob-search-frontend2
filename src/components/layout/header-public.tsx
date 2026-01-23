/**
 * Public Header (Before Login)
 * @author Matteo Owona, Rouchda Yampen
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';

export const HeaderPublic: React.FC = () => {
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
                className="w-full h-full object-contain rounded-2xl"

              />


            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Yowyob</h1>
              <p className="text-xs text-gray-600">Search Engine</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth">
              <Button variant="primary" size="sm">
                Connexion
              </Button>
            </Link>
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
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-semibold">
                À propos
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-semibold">
                Contact
              </Link>
              <Link href="/auth">
                <Button variant="primary" fullWidth>
                  Connexion
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};