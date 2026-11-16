import { useEffect, useRef, useState } from 'react';
export function useClipboard() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copyText(value: string) {
    clearTimeout(timer.current); setCopied(false); setError('');
    try {
      await navigator.clipboard.writeText(value); setCopied(true);
      timer.current = setTimeout(() => setCopied(false), 2000);
      return true;
    } catch { setError('Copy unavailable. Select the text to copy it.'); return false; }
  }
  return { copied, error, copyText };
}
