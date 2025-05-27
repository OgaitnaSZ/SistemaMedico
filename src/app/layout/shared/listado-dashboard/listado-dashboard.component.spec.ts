import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDashboardComponent } from './listado-dashboard.component';

describe('ListadoDashboardComponent', () => {
  let component: ListadoDashboardComponent;
  let fixture: ComponentFixture<ListadoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
