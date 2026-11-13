export type ContactKind = 'phone' | 'whatsapp' | 'email' | 'instagram';

export interface ContactMethod {
  kind: ContactKind; // selects the generic fallback icon
  label: string; // action name, e.g. "Call"
  value: string; // what the visitor sees, e.g. the number
  href: string;
  external: boolean; // opens in a new tab with rel="noopener noreferrer"
  iconUrl?: string; // optional hosted icon image; generic SVG is used when empty
}

const WHATSAPP_GREETING = "Hi Platinum Visuals, I'd like to enquire about a shoot.";

export const CONTACT_INTRO = {
  heading: 'Get in Touch',
  text: 'Ready to book a shoot or have a question about a session? Reach out in whichever way suits you.',
} as const;

export const CONTACT_METHODS: ContactMethod[] = [
  {
    kind: 'phone',
    label: 'Call',
    value: '065 830 9526',
    href: 'tel:+27658309526',
    external: false,
    iconUrl: '',
  },
  {
    kind: 'whatsapp',
    label: 'WhatsApp',
    value: '065 830 9526',
    href: `https://wa.me/27658309526?text=${encodeURIComponent(WHATSAPP_GREETING)}`,
    external: true,
    iconUrl: '',
  },
  {
    kind: 'email',
    label: 'Email',
    value: 'platinumvisuals22@gmail.com',
    href: 'mailto:platinumvisuals22@gmail.com',
    external: false,
    iconUrl: '',
  },
  {
    kind: 'instagram',
    label: 'Instagram',
    value: '@platinum.visuals_pty_ltd',
    href: 'https://www.instagram.com/platinum.visuals_pty_ltd/',
    external: true,
    iconUrl: '',
  },
];
