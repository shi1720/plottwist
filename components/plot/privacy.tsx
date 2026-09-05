'use client';
import { useState } from 'react';
import { STORAGE_KEY } from '@/lib/engine/storage';
export default function Privacy() {
  const [status, setStatus] = useState('');
  return (
    <div className="privacy-control">
      <button
        className="secondary-button"
        onClick={() => {
          try {
            for (const id of ['pilot', 'office', 'friends'])
              localStorage.removeItem(`${STORAGE_KEY}.${id}`);
            setStatus('All saved episodes have been cleared from this device.');
          } catch {
            setStatus(
              'Your browser is blocking storage access. Clear site data in browser settings.',
            );
          }
        }}
      >
        Clear my saved episodes
      </button>
      <p role="status">{status}</p>
    </div>
  );
}
