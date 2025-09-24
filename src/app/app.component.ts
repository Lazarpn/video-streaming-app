import { Component, NgZone, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterComponent } from './footer/footer.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@Component({
  selector: 'vs-root',
  imports: [RouterOutlet, FooterComponent, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  showLoadingSpinner = true;

  constructor(private zone: NgZone, private translate: TranslateService) {
    this.translate.addLangs(['en']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.zone.onStable.subscribe(() => {
      this.showLoadingSpinner = false;
    });
  }
}
