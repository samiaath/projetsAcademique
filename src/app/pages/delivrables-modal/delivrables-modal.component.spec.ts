import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelivrablesModalComponent } from './delivrables-modal.component';

describe('DelivrablesModalComponent', () => {
  let component: DelivrablesModalComponent;
  let fixture: ComponentFixture<DelivrablesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelivrablesModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DelivrablesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
