import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '../shared/button/button.component';
import { InputComponent } from '../shared/components/input/input.component';

@Component({
  selector: 'vs-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [ButtonComponent, RouterLink, InputComponent, FormsModule]
})
export class HomeComponent {
  meetingCode: string = '';

  constructor() { }
}
