import { bootstrapApplication } from '@angular/platform-browser';

import Swiper from 'swiper';
import { register } from 'swiper/element';
import { Autoplay } from 'swiper/modules';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

register();
Swiper.use([Autoplay]);
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
