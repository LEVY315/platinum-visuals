import { TestBed } from '@angular/core/testing';
import { ContactIcon } from './contact-icon';

function render(iconUrl: string) {
  const fixture = TestBed.createComponent(ContactIcon);
  fixture.componentRef.setInput('kind', 'phone');
  fixture.componentRef.setInput('iconUrl', iconUrl);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('ContactIcon', () => {
  it('renders the hosted image as a decorative <img> when iconUrl is set', () => {
    const el = render('https://example.com/phone.png');
    const img = el.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toBe('https://example.com/phone.png');
    expect(img!.getAttribute('alt')).toBe('');
    expect(el.querySelector('svg')).toBeNull();
  });

  it('falls back to the generic inline SVG when iconUrl is empty', () => {
    const el = render('');
    const svg = el.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute('aria-hidden')).toBe('true');
    expect(svg!.querySelector('path')).not.toBeNull();
    expect(el.querySelector('img')).toBeNull();
  });
});
