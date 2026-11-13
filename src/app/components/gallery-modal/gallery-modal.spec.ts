import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SERVICE_CATEGORIES } from '../../data/services.data';
import { GalleryModal } from './gallery-modal';

// jsdom does not implement the modal dialog API.
function stubDialog(): void {
  const proto = HTMLDialogElement.prototype;
  proto.showModal ??= function (this: HTMLDialogElement) {
    this.open = true;
  };
  proto.close ??= function (this: HTMLDialogElement) {
    this.open = false;
  };
}

describe('GalleryModal', () => {
  let fixture: ComponentFixture<GalleryModal>;
  let modal: GalleryModal;
  const [weddings, matric] = SERVICE_CATEGORIES;
  const dialog = () => fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    stubDialog();
    fixture = TestBed.createComponent(GalleryModal);
    modal = fixture.componentInstance;
    await render();
  });

  afterEach(() => document.documentElement.classList.remove('scroll-locked'));

  it('opens with the chosen category and shows all its thumbnails', async () => {
    modal.open(weddings);
    await render();
    expect(dialog().open).toBe(true);
    expect(modal.isOpen()).toBe(true);
    expect(fixture.nativeElement.querySelector('#gallery-title').textContent).toContain('Weddings');
    const thumbs = fixture.nativeElement.querySelectorAll(
      '.thumb img',
    ) as NodeListOf<HTMLImageElement>;
    expect(thumbs.length).toBe(weddings.images.length);
    expect(thumbs[0].getAttribute('src')).toBe(weddings.images[0].thumb);
    expect(document.documentElement.classList.contains('scroll-locked')).toBe(true);
  });

  it('closes, unlocks scrolling and returns focus to the opener', async () => {
    const opener = document.createElement('button');
    document.body.appendChild(opener);
    const closed = vi.fn();
    modal.closed.subscribe(closed);

    modal.open(weddings, opener);
    await render();
    (fixture.nativeElement.querySelector('.close') as HTMLButtonElement).click();
    await render();

    expect(dialog().open).toBe(false);
    expect(modal.isOpen()).toBe(false);
    expect(modal.category()).toBeNull();
    expect(document.activeElement).toBe(opener);
    expect(document.documentElement.classList.contains('scroll-locked')).toBe(false);
    expect(closed).toHaveBeenCalledTimes(1);
    opener.remove();
  });

  it('shows the new category, not stale state, when reopened', async () => {
    modal.open(weddings);
    modal.showImage(3);
    modal.close();
    modal.open(matric);
    await render();
    expect(modal.viewerIndex()).toBeNull();
    expect(fixture.nativeElement.querySelector('#gallery-title').textContent).toContain(
      'Matric Dances',
    );
    const firstThumb = fixture.nativeElement.querySelector('.thumb img') as HTMLImageElement;
    expect(firstThumb.getAttribute('src')).toBe(matric.images[0].thumb);
  });

  it('ignores a late native close event after the dialog was reopened', async () => {
    modal.open(weddings);
    modal.close();
    modal.open(matric);
    dialog().dispatchEvent(new Event('close'));
    await render();
    expect(modal.category()).toBe(matric);
  });

  it('wraps next and previous in the photo viewer', async () => {
    const last = weddings.images.length - 1;
    modal.open(weddings);
    modal.showImage(last);
    await render();
    expect(fixture.nativeElement.querySelector('.counter').textContent.trim()).toBe(
      `${last + 1} / ${last + 1}`,
    );

    modal.next();
    expect(modal.viewerIndex()).toBe(0);
    modal.prev();
    expect(modal.viewerIndex()).toBe(last);
    modal.prev();
    expect(modal.viewerIndex()).toBe(last - 1);
  });

  it('loads the full image only in the viewer and navigates with arrow keys', async () => {
    modal.open(weddings);
    await render();
    expect(fixture.nativeElement.querySelector('.stage img')).toBeNull();

    modal.showImage(0);
    await render();
    const full = () =>
      (fixture.nativeElement.querySelector('.stage img') as HTMLImageElement).getAttribute('src');
    expect(full()).toBe(weddings.images[0].full);

    dialog().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    await render();
    expect(full()).toBe(weddings.images[1].full);

    dialog().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    dialog().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await render();
    expect(full()).toBe(weddings.images[weddings.images.length - 1].full);
  });

  it('closes when the backdrop is clicked', async () => {
    modal.open(weddings);
    await render();
    dialog().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(modal.isOpen()).toBe(false);
  });
});
