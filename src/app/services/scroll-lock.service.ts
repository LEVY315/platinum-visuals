import { DOCUMENT, Injectable, inject } from '@angular/core';

/** Locks page scrolling, e.g. while a modal is open. */
@Injectable({ providedIn: 'root' })
export class ScrollLockService {
  private readonly root = inject(DOCUMENT).documentElement;

  lock(): void {
    const scrollbar = window.innerWidth - this.root.clientWidth;
    this.root.style.setProperty('--scrollbar-compensation', `${Math.max(0, scrollbar)}px`);
    this.root.classList.add('scroll-locked');
  }

  unlock(): void {
    this.root.classList.remove('scroll-locked');
    this.root.style.removeProperty('--scrollbar-compensation');
  }
}
