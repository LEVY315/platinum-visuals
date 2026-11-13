import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Carousel } from './carousel';

const ITEMS = Array.from({ length: 11 }, (_, i) => `Item ${i + 1}`);

@Component({
  imports: [Carousel],
  template: `
    <app-carousel label="Test carousel" [items]="items" [itemTitle]="title">
      <ng-template let-item
        ><span class="item">{{ item }}</span></ng-template
      >
    </app-carousel>
  `,
})
class Host {
  readonly items = ITEMS;
  readonly title = (item: string) => item;
}

/** Fakes matchMedia for a viewport width and a reduced-motion preference. */
function mockMedia(width: number, reducedMotion: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => {
    const minWidth = /min-width:\s*(\d+)px/.exec(query);
    const matches = minWidth
      ? width >= Number(minWidth[1])
      : query.includes('reduce') && reducedMotion;
    return {
      matches,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    };
  });
}

function create(
  width: number,
  reducedMotion = false,
): { fixture: ComponentFixture<Host>; carousel: Carousel<string> } {
  mockMedia(width, reducedMotion);
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  const carousel = fixture.debugElement.children[0].componentInstance as Carousel<string>;
  return { fixture, carousel };
}

describe('Carousel', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it.each([
    [375, 1, 11],
    [800, 2, 10],
    [1100, 3, 9],
    [1440, 4, 8],
  ])('at %ipx shows %i item(s) and %i dots', (width, visible, positions) => {
    const { fixture, carousel } = create(width);
    expect(carousel.visible()).toBe(visible);
    expect(carousel.positionCount()).toBe(positions);
    expect(fixture.nativeElement.querySelectorAll('.dot').length).toBe(positions);
  });

  it('labels each slide and the carousel for assistive tech', () => {
    const { fixture } = create(1100);
    const host: HTMLElement = fixture.nativeElement.querySelector('app-carousel');
    expect(host.getAttribute('aria-roledescription')).toBe('carousel');
    const slides = host.querySelectorAll('.slide');
    expect(slides[0].getAttribute('aria-label')).toBe('1 of 11');
    expect(slides[10].getAttribute('aria-label')).toBe('11 of 11');
    expect(host.querySelector('.dot')?.getAttribute('aria-label')).toBe('Show from Item 1');
  });

  it('wraps next from the last position to the start', () => {
    const { carousel } = create(1100);
    carousel.goTo(8);
    expect(carousel.position()).toBe(8);
    carousel.next();
    expect(carousel.position()).toBe(0);
  });

  it('wraps previous from the start to the last position', () => {
    const { carousel } = create(1100);
    carousel.prev();
    expect(carousel.position()).toBe(8);
    carousel.prev();
    expect(carousel.position()).toBe(7);
  });

  it('autoplays every 4 seconds when motion is allowed', () => {
    vi.useFakeTimers();
    const { fixture, carousel } = create(1100);
    expect(carousel.autoplayRunning()).toBe(true);
    vi.advanceTimersByTime(4000);
    fixture.detectChanges();
    expect(carousel.position()).toBe(1);
  });

  it('never autoplays when reduced motion is preferred', () => {
    vi.useFakeTimers();
    const { fixture, carousel } = create(1100, true);
    expect(carousel.autoplayRunning()).toBe(false);
    vi.advanceTimersByTime(20000);
    fixture.detectChanges();
    expect(carousel.position()).toBe(0);
    expect(fixture.nativeElement.querySelector('.pause')).toBeNull();
  });
});
