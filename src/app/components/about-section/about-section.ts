import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ABOUT } from '../../data/about.data';
import { SITE } from '../../data/site.data';

@Component({
  selector: 'app-about-section',
  templateUrl: './about-section.html',
  styleUrl: './about-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutSection {
  protected readonly about = ABOUT;
  protected readonly logoAlt = SITE.logoAlt;
}
