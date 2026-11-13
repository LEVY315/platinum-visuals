import { GalleryImage, SERVICE_CATEGORIES, SERVICES_INTRO } from './services.data';

const EXPECTED_SLUGS = [
  'weddings',
  'matric-dances',
  'corporate-events',
  'studio-portraits',
  'professional-portraits',
  'maternity-shoots',
  'milestone-shoots',
  'birthday-shoots',
  'birthday-parties',
  'sports-events',
  'outdoor-shoots',
];

function expectValidImage(image: GalleryImage): void {
  expect(image.alt.trim()).not.toBe('');
  expect(image.thumb.trim()).not.toBe('');
  expect(image.full.trim()).not.toBe('');
  expect(image.thumb.startsWith('/images/')).toBe(true);
  expect(image.full.startsWith('/images/')).toBe(true);
  expect(image.width).toBeGreaterThan(0);
  expect(image.height).toBeGreaterThan(0);
}

describe('services data', () => {
  it('lists the 11 categories in the documented order', () => {
    expect(SERVICE_CATEGORIES.map((c) => c.slug)).toEqual(EXPECTED_SLUGS);
  });

  it('has the services summary', () => {
    expect(SERVICES_INTRO.heading).toBe('Our Services');
    expect(SERVICES_INTRO.summary.length).toBeGreaterThan(0);
  });

  for (const category of SERVICE_CATEGORIES) {
    describe(category.title, () => {
      it('has a valid cover and at least one image', () => {
        expect(category.cover).toBeTruthy();
        expectValidImage(category.cover);
        expect(category.images.length).toBeGreaterThan(0);
      });

      it('has valid images stored under its own slug folder', () => {
        for (const image of category.images) {
          expectValidImage(image);
          expect(image.thumb).toContain(`/images/services/${category.slug}/thumb/`);
          expect(image.full).toContain(`/images/services/${category.slug}/full/`);
        }
      });
    });
  }
});
