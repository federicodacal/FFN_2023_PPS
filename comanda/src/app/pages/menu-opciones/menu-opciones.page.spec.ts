import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuOpcionesPage } from './menu-opciones.page';

describe('MenuOpcionesPage', () => {
  let component: MenuOpcionesPage;
  let fixture: ComponentFixture<MenuOpcionesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MenuOpcionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
