import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsEComponent } from './project-details-e.component';

describe('ProjectDetailsEComponent', () => {
  let component: ProjectDetailsEComponent;
  let fixture: ComponentFixture<ProjectDetailsEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsEComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectDetailsEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
