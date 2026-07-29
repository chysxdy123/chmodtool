'use client';

import { useEffect, useRef, useState } from 'react';
import messages from '@/i18n/messages/en.json';

type CopyStatus = 'idle' | 'copied' | 'failed';

type CopyCommandButtonProps = {
  command: string;
  ariaLabel: string;
};

export function CopyCommandButton({
  command,
  ariaLabel,
}: CopyCommandButtonProps) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }

    if (resetTimer.current) clearTimeout(resetTimer.current);

    resetTimer.current = setTimeout(() => setStatus('idle'), 2000);
  }

  return (
    <span className="copy-control">
      <button
        type="button"
        className="copy-button"
        aria-label={ariaLabel}
        onClick={copyCommand}
      >
        {status === 'copied'
          ? messages.tool.copiedButton
          : messages.tool.copyButton}
      </button>
      <span className="copy-status" aria-live="polite">
        {status === 'failed' ? messages.tool.copyError : ''}
      </span>
    </span>
  );
}
