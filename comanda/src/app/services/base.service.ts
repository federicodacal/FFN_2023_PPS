import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, where, query, doc, getDoc, addDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Cliente } from '../clases/cliente';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(private bd: Firestore){ }

  getUsuariosGeneral(): Observable<any[]>{
    const usuarioRef = collection(this.bd, "usuarios");

    return collectionData(usuarioRef, {idField: 'uid'}) as Observable<any[]>;
  }

  getUsuarios(perfil: string): Observable<any[]>{
    const usuarioRef = collection(this.bd, "usuarios");
    const q = query(usuarioRef, where('perfil', '==', perfil));
    return collectionData(q, {idField: 'uid'}) as Observable<any[]>;
  }
 
  getUsuario(uid: string){ 
    const docRef = doc(this.bd, "usuarios", uid);
    return getDoc(docRef);
  }

  addUsuario(usr: any, uid: string = ''){
    const usrRef = doc(this.bd, 'usuarios', uid);
    return setDoc(usrRef, usr);   
  }

  updateEstadoUsario(usr:any) {
    const usrRef = doc(this.bd, `usuarios/${usr.uid}`);
    return updateDoc(usrRef, {estadoUsuario:usr.estadoUsuario})
  }

  addAnonimo(usr: any){
    const usrRef = collection(this.bd, 'usuarios');
    return addDoc(usrRef, usr);   
  }
}
