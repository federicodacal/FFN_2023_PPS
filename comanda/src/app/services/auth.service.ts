import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { callbackify } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  getUid(){
    return this.auth.currentUser?.uid;
  }

  logIn(email: string, clave: string){
    return signInWithEmailAndPassword(this.auth, email, clave);
  }

  register(email: string, clave: string){
    return createUserWithEmailAndPassword(this.auth, email, clave); 
  }

  logOut()
  {
    return signOut(this.auth);
  }

  registrarAnonimo(){
    return signInAnonymously(this.auth)
  }
}
