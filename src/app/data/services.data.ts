// Single source of truth for all gallery content.
// To add real photos: drop files into public/images/services/<slug>/{thumb,full}/
// and update the entries below (file name, width, height, alt). No component changes needed.

export interface GalleryImage {
  thumb: string; // path under /images/...
  full: string; // path under /images/...
  alt: string; // meaningful description
  width: number; // intrinsic width of the full image
  height: number; // intrinsic height of the full image
}

export interface ServiceCategory {
  slug: string;
  title: string;
  description?: string; // optional one-liner shown on the card
  cover: GalleryImage; // the "best photo" shown on the card
  images: GalleryImage[];
}

export const SERVICES_INTRO = {
  heading: 'Our Services',
  summary:
    'We offer a diverse range of professional photography and videography services — from studio and professional portraits to weddings, matric dances, corporate and sports events, outdoor shoots, maternity sessions, birthdays and one-year-old milestone shoots.',
} as const;

/** Builds the thumb/full paths for one photo of a category. */
function photo(
  slug: string,
  file: string,
  width: number,
  height: number,
  alt: string,
): GalleryImage {
  return {
    thumb: `/images/services/${slug}/thumb/${file}`,
    full: `/images/services/${slug}/full/${file}`,
    alt,
    width,
    height,
  };
}

/** Placeholder set: 3:2 landscape, 2:3 portrait and 1:1 square, matching scripts/generate-placeholders.mjs. */
function placeholders(slug: string, title: string): GalleryImage[] {
  const sizes: [number, number][] = [
    [1800, 1200],
    [1200, 1800],
    [1500, 1500],
    [1800, 1200],
    [1200, 1800],
    [1800, 1200],
  ];
  return sizes.map(([width, height], i) => {
    const n = String(i + 1).padStart(2, '0');
    return photo(slug, `${n}.svg`, width, height, `${title} placeholder photo ${i + 1}`);
  });
}

/**
 * The cover defaults to the first image. To use real photos, pass them as `images`, e.g.
 *   category('weddings', 'Weddings', '…', [
 *     photo('weddings', 'first-dance.jpg', 2400, 1600, 'Bride and groom during their first dance'),
 *   ])
 */
function category(
  slug: string,
  title: string,
  description: string,
  images: GalleryImage[] = placeholders(slug, title),
  cover: GalleryImage = images[0],
): ServiceCategory {
  return { slug, title, description, cover, images };
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  category(
    'weddings',
    'Weddings',
    'From the quiet moments before the ceremony to the last dance of the night.',
  ),
  category(
    'matric-dances',
    'Matric Dances',
    'A milestone evening, styled and photographed to match the occasion.',
  ),
  category(
    'corporate-events',
    'Corporate Events',
    'Conferences, launches and functions documented with a professional eye.',
  ),
  category(
    'studio-portraits',
    'Studio Portraits',
    'Controlled light and a calm setting for portraits with real presence.',
  ),
  category(
    'professional-portraits',
    'Professional Portraits',
    'Polished headshots and profile images that represent you and your business.',
  ),
  category(
    'maternity-shoots',
    'Maternity Shoots',
    'Gentle, elegant portraits celebrating the season before your little one arrives.',
  ),
  category(
    'milestone-shoots',
    'One-Year-Old & Milestone Shoots',
    'First birthdays and early milestones, kept relaxed and full of personality.',
  ),
  category(
    'birthday-shoots',
    'Birthday Shoots',
    'A dedicated session to mark another year, in studio or on location.',
  ),
  category(
    'birthday-parties',
    'Birthday Parties',
    'The guests, the décor and the laughter, covered from start to finish.',
  ),
  category(
    'sports-events',
    'Sports Events',
    'Fast, sharp coverage of the action, the effort and the celebrations.',
  ),
  category(
    'outdoor-shoots',
    'Outdoor Shoots',
    'Natural light and open spaces for portraits with an easy, honest feel.',
  ),
];
