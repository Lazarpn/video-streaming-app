import { Component } from '@angular/core';

@Component({
  selector: 'vs-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  sidenavOpened = false;

  goToSection(section: string) {
    this.sidenavOpened = false;
    const sectionDiv = document.getElementById(section);
    sectionDiv?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
