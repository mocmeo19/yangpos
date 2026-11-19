'use client';

import { useCallback, useSyncExternalStore } from 'react';

// `replaceState` không phát sự kiện nào, nên tự báo để các nơi đang đọc #neo cập nhật theo.
const HASH_TAB_CHANGE_EVENT = 'yangpos:hash-tab-change';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  window.addEventListener(HASH_TAB_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('hashchange', onChange);
    window.removeEventListener(HASH_TAB_CHANGE_EVENT, onChange);
  };
}

function readHash(): string {
  return decodeURIComponent(window.location.hash.slice(1));
}

function readServerHash(): string {
  return '';
}

/**
 * Tab đang chọn chính là #neo của đường dẫn, nên liên kết như /finance#invoices luôn mở đúng tab,
 * kể cả khi Next.js giữ lại màn hình cũ lúc chuyển trang qua lại.
 */
export function useHashTab<TTab extends string>(
  tabs: readonly TTab[],
  fallback: TTab,
): [TTab, (tab: TTab) => void] {
  const anchor = useSyncExternalStore(subscribe, readHash, readServerHash);
  const tab = tabs.find((candidate) => candidate === anchor) ?? fallback;

  const selectTab = useCallback((nextTab: TTab) => {
    window.history.replaceState(window.history.state, '', `#${nextTab}`);
    window.dispatchEvent(new Event(HASH_TAB_CHANGE_EVENT));
  }, []);

  return [tab, selectTab];
}
