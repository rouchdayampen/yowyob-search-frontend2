'use client';

'use client';

import { useSession } from 'next-auth/react';
import { HeaderPublic } from '@/components/layout/header-public';
import { HeaderAuthenticated } from '@/components/layout/header-authenticated';
import { Footer } from '@/components/layout/footer';
import { MapContainer } from '@/components/map/map-container';

export default function MapPage() {
  const { data: session } = useSession();

  const mockMarkers = [
    {
      id: '1',
      position: [3.848, 11.5021] as [number, number],
      title: 'Yaoundé Centre',
    },
    {
      id: '2',
      position: [3.86, 11.52] as [number, number],
      title: 'Bastos',
    },
  ];

  return (
    <>
      {session ? (
        <HeaderAuthenticated userName={session.user?.name || undefined} />
      ) : (
        <HeaderPublic />
      )}

      <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
        <h1 className="text-3xl font-bold mb-8 gradient-text">
          Carte Interactive
        </h1>
        <div className="h-[600px]">
          <MapContainer markers={mockMarkers} />
        </div>
      </div>


    </>
  );
}
