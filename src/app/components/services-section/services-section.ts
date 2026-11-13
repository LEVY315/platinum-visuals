import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { SERVICES_INTRO, SERVICE_CATEGORIES, ServiceCategory } from '../../data/services.data';
import { Carousel } from '../carousel/carousel';
import { GalleryModal } from '../gallery-modal/gallery-modal';
import { ServiceCard } from '../service-card/service-card';

@Component({
  selector: 'app-services-section',
  imports: [Carousel, ServiceCard, GalleryModal],
  templateUrl: './services-section.html',
  styleUrl: './services-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesSection {
  protected readonly intro = SERVICES_INTRO;
  protected readonly categories = SERVICE_CATEGORIES;
  protected readonly titleOf = (category: ServiceCategory) => category.title;
  protected readonly modal = viewChild.required(GalleryModal);

  protected openGallery(category: ServiceCategory, opener: HTMLElement): void {
    this.modal().open(category, opener);
  }
}
