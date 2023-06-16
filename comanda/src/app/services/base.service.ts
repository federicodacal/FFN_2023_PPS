import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, where, query, doc, getDoc, addDoc, setDoc, updateDoc, docData, orderBy } from '@angular/fire/firestore';
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
 
  getUsuario(uid: string) { 
    const docRef = doc(this.bd, "usuarios", uid);
    return getDoc(docRef);
  }

  addUsuario(usr: any, uid: string = ''){
    const usrRef = doc(this.bd, 'usuarios', uid);
    return setDoc(usrRef, usr);   
  }

  updateEstadoUsario(usr:any) {
    const usrRef = doc(this.bd, `usuarios/${usr.uid}`);
    return updateDoc(usrRef, {estadoUsuario:usr.estadoUsuario});
  }

  updateMesaUsuario(usr:any) {
    const usrRef = doc(this.bd, `usuarios/${usr.uid}`);
    return updateDoc(usrRef, {mesa:usr.mesa});
  }

  addAnonimo(usr: any){
    const usrRef = collection(this.bd, 'usuarios');
    return addDoc(usrRef, usr);   
  }

  getMesas(): Observable<any[]> {
    const usuarioRef = collection(this.bd, "mesas");
    return collectionData(usuarioRef, {idField: 'uid'}) as Observable<any[]>;
  }

  updateEstadoMesa(mesa:any) {
    const usrRef = doc(this.bd, `mesas/${mesa.uid}`);
    return updateDoc(usrRef, {libre:mesa.libre});
  }



  //PRODUCTOS
  getProductos(){
    const prodRef = collection(this.bd, 'productos');
    return collectionData(prodRef, {idField: 'id'});
  }



  //CONSULTA
    crearConsulta(uidUsuario:any, usuario: any) {
    
    const consRef = doc(this.bd, 'consultas', uidUsuario);

    
    return setDoc(consRef, usuario, {merge: true});
  }

  comprobarSiExisteConsulta(uidUsuario:any){
    const consRef = doc(this.bd, 'consultas', uidUsuario);
    const a = doc(this.bd, 'consultas', 'xd');
    return getDoc(consRef )

  }

  addConsulta(consultaId: string, texto: string, sender: string = consultaId){
    const ref = collection(this.bd, 'consultas', consultaId, 'pregunta');
    const pregRef = doc(this.bd, 'consultas', consultaId);
    setDoc(pregRef,{
      ultimoMsj: texto,
      fecha: Date.now()
    }, {merge: true})
    return addDoc(ref, {
      horaEnvio: Date.now(),
      senderId: sender,
      texto: texto
    })
  }

  getConsulta(chatId: string) {
    const consRef = collection(this.bd, 'consultas', chatId, 'pregunta');
    const q = query(consRef, orderBy('horaEnvio', 'asc'))
    return collectionData(q) as Observable<any[]>;
  }

  getDatosConsulta(){
    const consRef = collection(this.bd, 'consultas');
    const q = query(consRef, orderBy('fecha', 'desc'));
    return collectionData(q, {idField: 'id'}) as Observable<any[]>;
  }
}
