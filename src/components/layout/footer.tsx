/**
 * Footer component
 * @author Matteo Owona, Rouchda Yampen
 * @date 2024-12-07
 */

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          

          <div>
            <h4 className="font-bold mb-4 text-gray-800">Entreprise</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-gray-800">Légal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Confidentialité</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-600">
            © {currentYear} Yowyob. 
          </p>
        </div>
      </div>
    </footer>
  );
};
