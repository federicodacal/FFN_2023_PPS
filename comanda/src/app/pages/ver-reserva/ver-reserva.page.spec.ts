import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerReservaPage } from './ver-reserva.page';

describe('VerReservaPage', () => {
  let component: VerReservaPage;
  let fixture: ComponentFixture<VerReservaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VerReservaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
