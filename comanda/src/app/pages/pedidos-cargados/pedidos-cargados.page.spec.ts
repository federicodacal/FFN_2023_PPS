import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidosCargadosPage } from './pedidos-cargados.page';

describe('PedidosCargadosPage', () => {
  let component: PedidosCargadosPage;
  let fixture: ComponentFixture<PedidosCargadosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PedidosCargadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
