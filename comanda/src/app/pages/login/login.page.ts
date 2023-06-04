import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  loginHarcodeado(){
    this.auth.logIn('treg@gmail.com', '123456')
    .then(response => this.router.navigateByUrl('/home'))
    .catch(error => console.log(error));
    
    
  }

}
