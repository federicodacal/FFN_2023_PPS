import { Injectable } from '@angular/core';
import { Auth, FacebookAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInAnonymously, signInWithCredential, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut } from '@angular/fire/auth';
import { callbackify } from 'util';

import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { 
    //if(!isPlatform('capacitor')){
      //GoogleAuth.initialize()
    //}
  }

  


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

  async signInGoogle(){
    return await GoogleAuth.signIn()
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /*const auth = getAuth();
    return signInWithPopup(auth, new GoogleAuthProvider());*/
 // return signInWithPopup(this.auth, new GoogleAuthProvider())
    //return signInWithRedirect(this.auth ,new GoogleAuthProvider())
/*
      // 1. Create credentials on the native layer
      const result = await FirebaseAuthentication.signInWithGoogle();
      // 2. Sign in on the web layer using the id token
      const credential = GoogleAuthProvider.credential(result.credential?.idToken);
      const auth = getAuth();
      return await signInWithCredential(auth, credential);
*/













    //return await signInWithPopup(this.auth, new GoogleAuthProvider())


  
      //return  await FirebaseAuthentication.signInWithGoogle()!;
    
 

      /*console.log('entra')
      // 1. Create credentials on the native layer
      const result = await FirebaseAuthentication.signInWithGoogle();
      // 2. Sign in on the web layer using the id token
      const credential = GoogleAuthProvider.credential(result.credential?.idToken);
      const auth = getAuth();
      return await signInWithCredential(auth, credential);*/

       /*const result = await FirebaseAuthentication.signInWithFace book();
  // 2. Sign in on the web layer using the access token
      const credential = FacebookAuthProvider.credential(
        result.credential?.accessToken!,
      );
      const auth = getAuth();
      return await signInWithCredential(auth, credential)*/

      /*const result =  signInWithPopup(this.auth, new FacebookAuthProvider())
      result.credential?.accessToken!*/
    
  }

}
