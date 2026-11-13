import { CONTACT_METHODS, ContactKind } from './contact.data';

const byKind = (kind: ContactKind) => CONTACT_METHODS.find((m) => m.kind === kind)!;

describe('contact data', () => {
  it('has the four contact methods in order', () => {
    expect(CONTACT_METHODS.map((m) => m.label)).toEqual(['Call', 'WhatsApp', 'Email', 'Instagram']);
  });

  it('calls the documented phone number', () => {
    expect(byKind('phone').href).toBe('tel:+27658309526');
    expect(byKind('phone').value).toBe('065 830 9526');
    expect(byKind('phone').external).toBe(false);
  });

  it('opens WhatsApp on the documented number with an encoded greeting', () => {
    const url = new URL(byKind('whatsapp').href);
    expect(`${url.origin}${url.pathname}`).toBe('https://wa.me/27658309526');
    expect(url.searchParams.get('text')).toBe(
      "Hi Platinum Visuals, I'd like to enquire about a shoot.",
    );
    expect(byKind('whatsapp').value).toBe('065 830 9526');
    expect(byKind('whatsapp').external).toBe(true);
  });

  it('emails the documented address', () => {
    expect(byKind('email').href).toBe('mailto:platinumvisuals22@gmail.com');
    expect(byKind('email').value).toBe('platinumvisuals22@gmail.com');
    expect(byKind('email').external).toBe(false);
  });

  it('links to the documented Instagram profile', () => {
    expect(byKind('instagram').href).toBe('https://www.instagram.com/platinum.visuals_pty_ltd/');
    expect(byKind('instagram').value).toBe('@platinum.visuals_pty_ltd');
    expect(byKind('instagram').external).toBe(true);
  });

  it('leaves every iconUrl empty for now', () => {
    expect(CONTACT_METHODS.every((m) => !m.iconUrl)).toBe(true);
  });
});
