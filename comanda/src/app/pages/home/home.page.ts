import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  usuario: any = {};

  constructor(private bd: BaseService, private auth: AuthService) {}

  ngOnInit(){
    console.log(this.auth.getUid()!);
    this.bd.getUsuario(this.auth.getUid()!)
    .then(response => this.usuario =  response.data())
    .catch(error => console.log(error));
    console.log(this.auth.getUid()!);
    
  }

  

}
