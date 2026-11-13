import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('renders the skip link, header, three sections and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.skip-link')?.getAttribute('href')).toBe('#main');
    expect(el.querySelector('header')).not.toBeNull();
    expect(el.querySelector('main#main')).not.toBeNull();
    expect(['about', 'services', 'contact'].every((id) => el.querySelector(`section#${id}`))).toBe(
      true,
    );
    expect(el.querySelector('footer')?.textContent).toContain(
      `© ${new Date().getFullYear()} Platinum Visuals (PTY) LTD`,
    );
  });

  it('opens contact links in the right way', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('#contact a'),
    );

    for (const link of links) {
      const external = link.href.startsWith('https:');
      expect(link.getAttribute('target')).toBe(external ? '_blank' : null);
      expect(link.getAttribute('rel')).toBe(external ? 'noopener noreferrer' : null);
    }
  });
});
