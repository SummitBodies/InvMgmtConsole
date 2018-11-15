import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgLocationsComponent } from './ag-locations.component';

describe('AgLocationsComponent', () => {
  let component: AgLocationsComponent;
  let fixture: ComponentFixture<AgLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
