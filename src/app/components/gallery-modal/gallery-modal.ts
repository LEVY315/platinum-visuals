import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ServiceCategory } from '../../data/services.data';
import { wrapIndex } from '../../services/carousel-math';
import { ScrollLockService } from '../../services/scroll-lock.service';

const SWIPE_THRESHOLD = 40;

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.html',
  styleUrl: './gallery-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryModal {
  readonly closed = output<void>();

  readonly category = signal<ServiceCategory | null>(null);
  readonly viewerIndex = signal<number | null>(null);
  readonly isOpen = signal(false);
  protected readonly fullLoaded = signal(false);
  protected readonly viewerImage = computed(() => {
    const index = this.viewerIndex();
    return index === null ? null : (this.category()?.images[index] ?? null);
  });

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly scrollLock = inject(ScrollLockService);
  private readonly injector = inject(Injector);
  private opener: HTMLElement | null = null;
  private swipeStart: { x: number; y: number } | null = null;

  open(category: ServiceCategory, opener?: HTMLElement): void {
    this.opener = opener ?? (document.activeElement as HTMLElement | null);
    this.category.set(category);
    this.viewerIndex.set(null);
    const dialog = this.dialog().nativeElement;
    if (!dialog.open) {
      dialog.showModal();
      this.scrollLock.lock();
    }
    this.isOpen.set(true);
    // The panel renders after showModal(), so move focus to the close button once it exists.
    this.focusAfterRender('.close');
  }

  close(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open) {
      dialog.close();
    }
    this.cleanUp();
  }

  /** Esc: close through close() so state resets and focus returns immediately. */
  protected onCancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  showImage(index: number): void {
    const images = this.category()?.images ?? [];
    const target = wrapIndex(index, images.length);
    const enteringViewer = this.viewerIndex() === null;
    if (target !== this.viewerIndex()) {
      this.fullLoaded.set(false);
      this.viewerIndex.set(target);
    }
    if (enteringViewer) {
      this.focusAfterRender('.viewer-back');
    }
  }

  next(): void {
    this.step(1);
  }

  prev(): void {
    this.step(-1);
  }

  backToGrid(): void {
    const index = this.viewerIndex();
    this.viewerIndex.set(null);
    if (index !== null) {
      this.focusAfterRender(`[data-index="${index}"]`);
    }
  }

  /**
   * Native 'close' event, kept as a fallback for closes not made through close().
   * It is dispatched asynchronously, so it is ignored if the dialog has been reopened since.
   */
  protected onNativeClose(): void {
    if (!this.dialog().nativeElement.open) {
      this.cleanUp();
    }
  }

  /** Resets state synchronously; repeated calls are no-ops. */
  private cleanUp(): void {
    if (!this.isOpen()) {
      return;
    }
    this.isOpen.set(false);
    this.category.set(null);
    this.viewerIndex.set(null);
    this.scrollLock.unlock();
    this.opener?.focus();
    this.opener = null;
    this.closed.emit();
  }

  protected onDialogClick(event: MouseEvent): void {
    // The panel fills the dialog, so a click whose target is the dialog itself hit the backdrop.
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.viewerIndex() === null) {
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prev();
    }
  }

  protected onPointerDown(event: PointerEvent): void {
    this.swipeStart = event.pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY };
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.swipeStart) {
      return;
    }
    const dx = event.clientX - this.swipeStart.x;
    const dy = event.clientY - this.swipeStart.y;
    this.swipeStart = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  protected onFullLoad(): void {
    this.fullLoaded.set(true);
  }

  private step(delta: number): void {
    const index = this.viewerIndex();
    if (index !== null) {
      this.showImage(index + delta);
    }
  }

  private focusAfterRender(selector: string): void {
    afterNextRender(
      () => this.dialog().nativeElement.querySelector<HTMLElement>(selector)?.focus(),
      { injector: this.injector },
    );
  }
}
