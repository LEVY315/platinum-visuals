import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AboutSection } from './components/about-section/about-section';
import { ContactSection } from './components/contact-section/contact-section';
import { ServicesSection } from './components/services-section/services-section';
import { SiteFooter } from './components/site-footer/site-footer';
import { SiteHeader } from './components/site-header/site-header';

@Component({
  selector: 'app-root',
  imports: [SiteHeader, AboutSection, ServicesSection, ContactSection, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
