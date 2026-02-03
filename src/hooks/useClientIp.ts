/**
 * Hook to detect user's IP address for geolocation
 * The backend will handle IP-to-location conversion via geo-service
 * 
 * @author Matteo Owona, Rouchda Yampen
 * @date 2024-12-06
 */

'use client';

import { useState, useEffect } from 'react';

interface UseClientIpResult {
  ip: string | null;
  loading: boolean;
  error: string | null;
}

const CACHE_KEY = 'yowyob_client_ip';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Hook to get the client's IP address
 * Uses ipify.org free API (unlimited requests)
 * Caches the result in localStorage for 24 hours
 */
export function useClientIp(): UseClientIpResult {
  const [ip, setIp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIp = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { ip: cachedIp, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          
          if (age < CACHE_DURATION) {
            setIp(cachedIp);
            setLoading(false);
            return;
          }
        }

        // Fetch from ipify API (free, unlimited, no API key)
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
          throw new Error('Failed to fetch IP');
        }

        const data = await response.json();
        const clientIp = data.ip;

        // Cache the result
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          ip: clientIp,
          timestamp: Date.now()
        }));

        setIp(clientIp);
        setError(null);
      } catch (err) {
        console.error('Failed to get client IP:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIp(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIp();
  }, []);

  return { ip, loading, error };
}
