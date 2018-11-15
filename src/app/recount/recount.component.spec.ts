import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecountComponent } from './recount.component';

describe('RecountComponent', () => {
  let component: RecountComponent;
  let fixture: ComponentFixture<RecountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
