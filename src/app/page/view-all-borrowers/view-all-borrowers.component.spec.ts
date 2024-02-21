import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllBorrowersComponent } from './view-all-borrowers.component';

describe('ViewAllBorrowersComponent', () => {
  let component: ViewAllBorrowersComponent;
  let fixture: ComponentFixture<ViewAllBorrowersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllBorrowersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAllBorrowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
