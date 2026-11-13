export interface NavLink {
  id: string; // section id, without '#'
  label: string;
}

export const SITE = {
  company: 'Platinum Visuals (PTY) LTD',
  logoAlt: 'Platinum Visuals Photography',
  closingLine: 'Your moments deserve to be remembered beautifully.',
  nav: [
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ] satisfies NavLink[],
} as const;
