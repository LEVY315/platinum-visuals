import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ServiceCategory } from '../../data/services.data';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.html',
  styleUrl: './service-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCard {
  readonly category = input.required<ServiceCategory>();
  /** Emits the card's button so focus can return to it when the gallery closes. */
  readonly opened = output<HTMLButtonElement>();
}
