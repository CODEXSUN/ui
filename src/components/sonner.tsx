"use client";

import type { ComponentProps } from 'react';
import { Toaster as Sonner } from 'sonner';
import { useDesignSystem } from '../design-system/provider.js';
import { cn } from '../lib/utils.js';

export type ToasterProps = ComponentProps<typeof Sonner>;
/** Mount once below DesignSystemProvider. Apps own operations and feedback text. */
export function Toaster({ className, toastOptions, ...props }: ToasterProps) {
  const { preferences } = useDesignSystem();
  return <Sonner theme={preferences.mode} position="bottom-right" duration={4000} gap={8} visibleToasts={3}
    closeButton richColors={false} containerAriaLabel="Notifications" {...props}
    className={cn('workspace-toaster', className)}
    toastOptions={{ ...toastOptions, classNames: {
      ...toastOptions?.classNames,
      toast: cn('workspace-toast', toastOptions?.classNames?.toast),
    } }}/>;
}
export { toast } from 'sonner';
