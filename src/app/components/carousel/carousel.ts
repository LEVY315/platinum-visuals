import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  afterNextRender,
  computed,
  contentChild,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { clampStart, nextStart, prevStart, startPositions } from '../../services/carousel-math';
import { BREAKPOINTS, MediaQueryService } from '../../services/media-query.service';

export interface CarouselItemContext<T> {
  $implicit: T;
  index: number;
}

/**
 * Generic scroll-snap slideshow. Renders each item through the projected <ng-template>,
 * shows 1/2/3/4 items depending on the breakpoint and advances one item per step.
 */
@Component({
  selector: 'app-carousel',
  imports: [NgTemplateOutlet],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'region',
    'aria-roledescription': 'carousel',
    '[attr.aria-label]': 'label()',
    '[style.--carousel-visible]': 'visible()',
    '[class.is-single]': 'visible() === 1',
    '(pointerenter)': 'onPointerEnter($event)',
    '(pointerleave)': 'hovering.set(false)',
    '(focusin)': 'onFocusIn($event)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class Carousel<T> {
  readonly items = input.required<readonly T[]>();
  readonly label = input.required<string>();
  /** Short name of an item, used in dot labels ("Show from Weddings"). */
  readonly itemTitle = input.required<(item: T) => string>();
  /** External pause, e.g. while a modal opened from the carousel is showing. */
  readonly paused = input(false);
  readonly interval = input(4000);

  protected readonly itemTemplate =
    contentChild.required<TemplateRef<CarouselItemContext<T>>>(TemplateRef);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  private readonly media = inject(MediaQueryService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly md = this.media.minWidth(BREAKPOINTS.md);
  private readonly lg = this.media.minWidth(BREAKPOINTS.lg);
  private readonly xl = this.media.minWidth(BREAKPOINTS.xl);

  readonly visible = computed(() => (this.xl() ? 4 : this.lg() ? 3 : this.md() ? 2 : 1));
  readonly positionCount = computed(() => startPositions(this.items().length, this.visible()));
  protected readonly positions = computed(() =>
    Array.from({ length: this.positionCount() }, (_, i) => i),
  );

  private readonly rawPosition = signal(0);
  /** Index of the first item in view, always a valid start position. */
  readonly position = computed(() =>
    clampStart(this.rawPosition(), this.items().length, this.visible()),
  );

  protected readonly hovering = signal(false);
  private readonly focusedWithin = signal(false);
  private readonly touching = signal(false);
  private readonly pageHidden = signal(typeof document !== 'undefined' && document.hidden);
  protected readonly userPaused = signal(false);
  private readonly interactions = signal(0);

  readonly reducedMotion = this.media.reducedMotion;
  /** Whether autoplay is allowed at all (the pause button is only shown then). */
  readonly autoplayAllowed = computed(() => !this.reducedMotion() && this.positionCount() > 1);
  readonly autoplayRunning = computed(
    () =>
      this.autoplayAllowed() &&
      !this.userPaused() &&
      !this.paused() &&
      !this.hovering() &&
      !this.focusedWithin() &&
      !this.touching() &&
      !this.pageHidden(),
  );

  private scrollTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Restarts the countdown whenever autoplay resumes or the user interacts.
    effect((onCleanup) => {
      this.interactions();
      if (!this.autoplayRunning()) {
        return;
      }
      const id = setInterval(() => this.next(), this.interval());
      onCleanup(() => clearInterval(id));
    });

    afterNextRender(() => {
      const track = this.track().nativeElement;
      const onVisibility = () => this.pageHidden.set(document.hidden);
      const onWheel = () => this.markInteraction();
      const onTouchStart = () => this.touching.set(true);
      const onTouchEnd = () => {
        this.touching.set(false);
        this.markInteraction();
      };
      document.addEventListener('visibilitychange', onVisibility);
      track.addEventListener('wheel', onWheel, { passive: true });
      track.addEventListener('touchstart', onTouchStart, { passive: true });
      track.addEventListener('touchend', onTouchEnd, { passive: true });
      track.addEventListener('touchcancel', onTouchEnd, { passive: true });

      // Keep the current first item aligned when card widths change (resize, breakpoint switch).
      const resize =
        typeof ResizeObserver === 'undefined'
          ? null
          : new ResizeObserver(() => this.scrollToPosition(true));
      resize?.observe(track);
      const firstItem = track.firstElementChild;
      if (firstItem) {
        resize?.observe(firstItem);
      }

      destroyRef.onDestroy(() => {
        document.removeEventListener('visibilitychange', onVisibility);
        track.removeEventListener('wheel', onWheel);
        track.removeEventListener('touchstart', onTouchStart);
        track.removeEventListener('touchend', onTouchEnd);
        track.removeEventListener('touchcancel', onTouchEnd);
        resize?.disconnect();
        clearTimeout(this.scrollTimer);
      });
    });
  }

  next(): void {
    this.goTo(nextStart(this.position(), this.items().length, this.visible()));
  }

  prev(): void {
    this.goTo(prevStart(this.position(), this.items().length, this.visible()));
  }

  goTo(index: number): void {
    this.rawPosition.set(clampStart(index, this.items().length, this.visible()));
    this.scrollToPosition(false);
  }

  protected onArrow(direction: 'prev' | 'next'): void {
    this.markInteraction();
    if (direction === 'prev') {
      this.prev();
    } else {
      this.next();
    }
  }

  protected onDot(index: number): void {
    this.markInteraction();
    this.goTo(index);
  }

  protected toggleAutoplay(): void {
    this.userPaused.update((paused) => !paused);
  }

  protected dotLabel(index: number): string {
    return `Show from ${this.itemTitle()(this.items()[index])}`;
  }

  protected onScroll(): void {
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => this.syncFromScroll(), 120);
  }

  protected onPointerEnter(event: PointerEvent): void {
    if (event.pointerType === 'mouse') {
      this.hovering.set(true);
    }
  }

  protected onFocusIn(event: FocusEvent): void {
    this.focusedWithin.set(isFocusVisible(event.target));
  }

  protected onFocusOut(event: FocusEvent): void {
    if (!this.host.nativeElement.contains(event.relatedTarget as Node | null)) {
      this.focusedWithin.set(false);
    }
  }

  private markInteraction(): void {
    this.interactions.update((n) => n + 1);
  }

  /** Derives the current start position from the scroll offset after the user scrolls. */
  private syncFromScroll(): void {
    const track = this.track().nativeElement;
    const slides = Array.from(track.children) as HTMLElement[];
    if (slides.length === 0) {
      return;
    }
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 2) {
      this.rawPosition.set(this.positionCount() - 1);
      return;
    }
    const distance = (slide: HTMLElement) =>
      Math.abs(slide.offsetLeft - slides[0].offsetLeft - track.scrollLeft);
    let nearest = 0;
    slides.forEach((slide, i) => {
      if (distance(slide) < distance(slides[nearest])) {
        nearest = i;
      }
    });
    this.rawPosition.set(clampStart(nearest, this.items().length, this.visible()));
  }

  private scrollToPosition(instant: boolean): void {
    const track = this.track().nativeElement;
    const first = track.firstElementChild as HTMLElement | null;
    const slide = track.children[this.position()] as HTMLElement | undefined;
    if (!first || !slide || typeof track.scrollTo !== 'function') {
      return;
    }
    track.scrollTo({
      left: slide.offsetLeft - first.offsetLeft,
      behavior: instant || this.reducedMotion() ? 'auto' : 'smooth',
    });
  }
}

function isFocusVisible(target: EventTarget | null): boolean {
  try {
    return target instanceof Element && target.matches(':focus-visible');
  } catch {
    return true;
  }
}
