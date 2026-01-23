/**
 * Profile page
 * @author Matteo Owona, Rouchda Yampen
 * @date 2024-12-07
 */

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HeaderAuthenticated } from '@/components/layout/header-authenticated';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <HeaderAuthenticated userName={session.user?.name || undefined} />
      <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black gradient-text mb-8">
            Mon Profil
          </h1>

          <div className="grid gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-3xl font-black">
                  {session.user?.name?.[0] || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {session.user?.name}
                  </h2>
                  <p className="text-gray-600">{session.user?.email}</p>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="text-4xl font-black gradient-text mb-2">12</div>
                <p className="text-gray-600">Annonces</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-black gradient-text mb-2">8</div>
                <p className="text-gray-600">Favoris</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-black gradient-text mb-2">24</div>
                <p className="text-gray-600">Messages</p>
              </Card>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}