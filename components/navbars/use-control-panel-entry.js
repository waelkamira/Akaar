'use client';

import { useEffect, useState } from 'react';
import { isControlPanelAdmin } from '@/lib/auth/control-panel-access.mjs';

export default function useControlPanelEntry(user, status) {
  const userId = user?.id;
  const isBootstrapAdmin = isControlPanelAdmin(user);
  const [access, setAccess] = useState({ userId: null, entryPath: null });

  useEffect(() => {
    if (status !== 'authenticated' || !userId || isBootstrapAdmin) return undefined;

    let active = true;
    fetch('/api/user', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload?.error || 'تعذر التحقق من صلاحيات لوحة التحكم.');
        return payload;
      })
      .then((payload) => {
        if (active) {
          setAccess({
            userId,
            entryPath: typeof payload.controlPanelEntryPath === 'string'
              ? payload.controlPanelEntryPath
              : null,
          });
        }
      })
      .catch((error) => {
        console.error('Unable to load control panel navigation access:', error);
        if (active) setAccess({ userId, entryPath: null });
      });

    return () => { active = false; };
  }, [isBootstrapAdmin, status, userId]);

  if (isBootstrapAdmin) return '/admin/control-panel';
  return access.userId === userId ? access.entryPath : null;
}
