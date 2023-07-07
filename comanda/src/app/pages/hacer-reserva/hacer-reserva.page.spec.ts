import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HacerReservaPage } from './hacer-reserva.page';

describe('HacerReservaPage', () => {
  let component: HacerReservaPage;
  let fixture: ComponentFixture<HacerReservaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HacerReservaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
