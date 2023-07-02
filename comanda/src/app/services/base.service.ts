import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, where, query, doc, getDoc, addDoc, setDoc, updateDoc, docData, orderBy, deleteDoc, and } from '@angular/fire/firestore';
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


  getUsuarioCollection(uid: string) { 
    const docRef = collection(this.bd, "usuarios");
    const q = query(docRef, where('uid', '==', uid));
    return collectionData(q);
  }

  
  getUser(uid:string) {
    const noteDocRef = doc(this.bd, `usuarios/${uid}`);
    return docData(noteDocRef, {idField: 'uid'}) as Observable<any>;
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
    return updateDoc(usrRef, {mesa:usr.mesa, estadoQrEspera:usr.estadoQrEspera});
  }

  updateSoloMesaUsuario(usr:any) {
    const usrRef = doc(this.bd, `usuarios/${usr.uid}`);
    return updateDoc(usrRef, {mesa:usr.mesa});
  }

  addAnonimo(usr: any){
    const usrRef = doc(this.bd, 'usuarios', usr.uid);
    return setDoc(usrRef, usr);   
  }

  getMesas(): Observable<any[]> {
    const usuarioRef = collection(this.bd, "mesas");
    return collectionData(usuarioRef, {idField: 'uid'}) as Observable<any[]>;
  }

  updateEstadoMesa(mesa:any) {
    const usrRef = doc(this.bd, `mesas/${mesa.uid}`);
    return updateDoc(usrRef, {libre:mesa.libre});
  }

  updateEstadoMesaNumero(mesa:any) {
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



  //PEDIDOS
  addPedido(pedido: any){
    const ref = collection(this.bd, 'pedidos');
    return addDoc(ref, pedido);
  }

  addPedidoChef(pedidos: any){
    const ref = collection(this.bd, 'pedidosChef');
    console.log(pedidos);
    return addDoc(ref, pedidos);
  }

  updateEstadoPedido(estado: string, id: string){
    //console.log(pedido.id)
    const ref = doc(this.bd, 'pedidos', id);
    return setDoc(ref, {estado: estado}, {merge: true});
  }

  addPedidoBartender(pedidos: any){
    const ref = collection(this.bd, 'pedidosBartender');
    console.log(pedidos);
    return addDoc(ref, pedidos);
  }

  getPedidos() {
    const consRef = collection(this.bd, 'pedidos');
    const q = query(consRef, orderBy('hora', 'desc'))
    return collectionData(q, {idField: 'id'}) as Observable<any[]>;
  }

  getPedidosTerminados() {
    const consRef = collection(this.bd, 'pedidos');
    const q = query(consRef, where('estado', '==', 'terminado'));
    return collectionData(q, {idField: 'id'}) as Observable<any[]>;
  }

  getPedidosChef(){
    const consRef = collection(this.bd, 'pedidosChef');
    return collectionData(consRef, {idField: 'id'});
  }

  getPedidosBartender(){
    const consRef = collection(this.bd, 'pedidosBartender');
    return collectionData(consRef, {idField: 'id'});
  }

  getPedidoByClienteUid(uid:string) {
    const colRef = collection(this.bd, "pedidos");
    const q = query(colRef, where('uid', '==', uid));
    return collectionData(q, {idField:'id'}) as Observable<any[]>;
  }

  getPedidoByClienteUidOrden(uid:string) {
    const colRef = collection(this.bd, "pedidos");
    const q = query(colRef, where('uid', '==', uid), orderBy('hora', 'desc'));
    return collectionData(q, {idField:'id'}) as Observable<any[]>;
  }


  deletePedidoFromChef(uidProd:string) {
    const colRef = doc(this.bd, `pedidosChef/${uidProd}`);
    return deleteDoc(colRef);
  }

  deletePedidoFromBartender(uidProd:string) {
    const colRef = doc(this.bd, `pedidosBartender/${uidProd}`);
    return deleteDoc(colRef);
  }


  deletePedido(uidPedido:string) {
    const colRef = doc(this.bd, `pedidos/${uidPedido}`);
    return deleteDoc(colRef);
  }

  getPedidosPagados(){
    const colRef = collection(this.bd, "pedidos");
    const q = query(colRef, where('estadoPago', '==', 'pagado'));
    return collectionData(q, {idField:'id'}) as Observable<any[]>;
  }


  updateEstadoPagado(estado: string, id: string){
    //console.log(pedido.id)
    const ref = doc(this.bd, 'pedidos', id);
    return setDoc(ref, {estadoPago: estado}, {merge: true});
  }



  // Encuesta
  addEncuesta(encuesta:any) {
    const colRef = collection(this.bd, 'encuestas');
    return addDoc(colRef, encuesta);
  }

  getEncuestas() {
    const colRef = collection(this.bd, 'encuestas');
    return collectionData(colRef, {idField: 'id'}) as Observable<any[]>;
  }

}
