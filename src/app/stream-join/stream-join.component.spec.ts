import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamJoinComponent } from './stream-join.component';

describe('StreamJoinComponent', () => {
  let component: StreamJoinComponent;
  let fixture: ComponentFixture<StreamJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamJoinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
