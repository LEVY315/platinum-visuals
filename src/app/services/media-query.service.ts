import { DestroyRef, Injectable, Signal, inject, signal } from '@angular/core';

/** Breakpoints from CLAUDE.md §3; keep in sync with src/styles/_breakpoints.scss. */
export const BREAKPOINTS = { md: 768, lg: 1024, xl: 1280 } as const;

/** Exposes CSS media queries as signals that update live. */
@Injectable({ providedIn: 'root' })
export class MediaQueryService {
  private readonly cache = new Map<string, Signal<boolean>>();
  private readonly destroyRef = inject(DestroyRef);

  /** `true` while the user prefers reduced motion. */
  readonly reducedMotion = this.matches('(prefers-reduced-motion: reduce)');

  matches(query: string): Signal<boolean> {
    const cached = this.cache.get(query);
    if (cached) {
      return cached;
    }
    const list =
      typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query) : null;
    const state = signal(list?.matches ?? false);
    if (list) {
      const onChange = (event: MediaQueryListEvent) => state.set(event.matches);
      list.addEventListener('change', onChange);
      this.destroyRef.onDestroy(() => list.removeEventListener('change', onChange));
    }
    const readonly = state.asReadonly();
    this.cache.set(query, readonly);
    return readonly;
  }

  minWidth(px: number): Signal<boolean> {
    return this.matches(`(min-width: ${px}px)`);
  }
}
