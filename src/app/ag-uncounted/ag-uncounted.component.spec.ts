import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgUncountedComponent } from './ag-uncounted.component';

describe('AgUncountedComponent', () => {
  let component: AgUncountedComponent;
  let fixture: ComponentFixture<AgUncountedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgUncountedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgUncountedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
