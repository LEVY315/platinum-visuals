import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContactKind } from '../../data/contact.data';

/** Decorative contact icon: the hosted image when `iconUrl` is set, otherwise a generic inline SVG. */
@Component({
  selector: 'app-contact-icon',
  templateUrl: './contact-icon.html',
  styleUrl: './contact-icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactIcon {
  readonly kind = input.required<ContactKind>();
  readonly iconUrl = input<string | undefined>('');
}
