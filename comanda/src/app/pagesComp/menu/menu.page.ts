import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  productos: any[] = [];
  constructor(private bd: BaseService) { }

  ngOnInit() {
  this.bd.getProductos().subscribe((prods)=>{
    this.productos = prods;
  })
  }

}
