import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT_INTRO, CONTACT_METHODS } from '../../data/contact.data';
import { ContactIcon } from '../contact-icon/contact-icon';

@Component({
  selector: 'app-contact-section',
  imports: [ContactIcon],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSection {
  protected readonly intro = CONTACT_INTRO;
  protected readonly methods = CONTACT_METHODS;
}
