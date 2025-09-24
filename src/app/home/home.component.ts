import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';

import { ButtonComponent } from '../shared/button/button.component';
import { InputComponent } from '../shared/components/input/input.component';
import { StreamModel } from '../shared/models/stream';
import { AccountService } from '../shared/services/account.service';
import { StreamService } from '../shared/services/stream.service';

@Component({
  selector: 'vs-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [ButtonComponent, RouterLink, InputComponent, FormsModule, MatTableModule]
})
export class HomeComponent implements OnInit {
  meetingCode: string = '';

  displayedColumns: string[] = ['id', 'type'];
  dataSource = [];

  constructor(private router: Router, private accountService: AccountService, private streamService: StreamService) {

  }

  ngOnInit(): void {
    this.dataSource = this.accountService.user?.streams || [];
    this.streamService.streamPassword = '';
  }

  joinMeeting() {
    this.router.navigate([`/stream/join/${this.meetingCode}`]);
  }

  onRowClicked(row: StreamModel) {
    this.router.navigate([`/stream/join/${row.id}`]);
  }
}
