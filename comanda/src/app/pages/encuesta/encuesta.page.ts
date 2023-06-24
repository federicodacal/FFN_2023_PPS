import { Component, OnInit } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { LoadingController, ToastController } from '@ionic/angular';
import { Chart, ChartType, registerables } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { UserPhoto } from '../alta-usuario/alta-usuario.page';
import { getDownloadURL, ref, uploadBytes, Storage } from '@angular/fire/storage';
Chart.register(...registerables);

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {

  public photos: UserPhoto[] = [];
  fotoUsr: string = "";

  fotosSubidas=0;

  usuarioActual: any = {};

  encuestas:any[] = [];

  resRadioBtn!:string;

  cbChat!:string;
  cbEstadoPedido!:string;
  cbJuegos!:string;
  cbDni!:string;

  calificacion:number=5;
  resSelect!:string;
  comentario!:string;

  constructor(private toast:ToastController, private bd:BaseService, private auth:AuthService, private fs:Firestore, private loadingCtrl:LoadingController, private toastCtrl:ToastController, private storage:Storage) { }

  ngOnInit() {

    setTimeout(()=>{
      let uid = this.auth.getUid()!;

      this.bd.getUser(uid).subscribe((res:any) => {
        this.usuarioActual = res;
        console.log(this.usuarioActual);

        //this.presentToast('top', `${this.usuarioActual.nombre}`, 'warning', 3000)

        console.log(this.usuarioActual.completoEncuesta);

        if(this.usuarioActual.completoEncuesta) {

          this.bd.getEncuestas().subscribe((res:any) => {
            this.encuestas = res;
            console.log(this.encuestas);
          });
          
          
          setTimeout(() => {

            if(this.encuestas) {

              this.cargarDatosPregunta1();
              this.cargarDatosPregunta2();
              this.cargarDatosPregunta3();
              this.cargarDatosPregunta4();

            }
          
          }, 1000);

            
        }
      });
    },1000)
  }

  valorRespuesta1: any = [0,0,0,0,0,0,0,0,0,0]; //[1,2,3,4,5,6,7,8,9,10]
  cargarDatosPregunta1(){
    for (let i = 0; i < this.encuestas.length; i++) {
        switch (this.encuestas[i].calificacion) {
          case 1:
            this.valorRespuesta1[0]++;
          break;
          case 2:
            this.valorRespuesta1[1]++;
          break; 
          case 3:
            this.valorRespuesta1[2]++;
          break;
          case 4:
            this.valorRespuesta1[3]++;
          break;
          case 5:
            this.valorRespuesta1[4]++;
          break;
          case 6:
            this.valorRespuesta1[5]++;
          break;
          case 7:
            this.valorRespuesta1[6]++;
          break;
          case 8:
            this.valorRespuesta1[7]++;
          break;
          case 9:
            this.valorRespuesta1[8]++;
          break;
          case 10:
            this.valorRespuesta1[9]++;
          break;   
        }
    }
    
    this.renderChart([1,2,3,4,5,6,7,8,9,10],this.valorRespuesta1,'pie','piechart');
  }

  valorRespuesta2: any = [0,0,0]; //[si, mejorar, no]
  cargarDatosPregunta2() {
    for (let i = 0; i < this.encuestas.length; i++) {
      switch (this.encuestas[i].interaccionQrs) {
        case 'si':
          this.valorRespuesta2[0]++;
          break;
        case 'mejorar':
          this.valorRespuesta2[1]++;
          break; 
        case 'no':
          this.valorRespuesta2[2]++;
          break;
      }
  }

    this.renderChart(['Si', 'Puede mejorar', 'No'],this.valorRespuesta2,'bar','barchart');
  }

  valorRespuesta3: any = [0,0,0,0]; //[comida, comunicacion, local, pedido]
  cargarDatosPregunta3() {
    for (let i = 0; i < this.encuestas.length; i++) {

      console.log(this.encuestas[i].itemMasImportante);

      switch (this.encuestas[i].itemMasImportante) {
        case 'comida':
          this.valorRespuesta3[0]++;
          break;
        case 'comunicacion':
          this.valorRespuesta3[1]++;
          break; 
        case 'local':
          this.valorRespuesta3[2]++;
          break;
        case 'pedido':
          this.valorRespuesta3[3]++;
          break;
      }
  }

    this.renderChart(['Comida', 'Comunicación', 'Local', 'Metodologia de Pedido'],this.valorRespuesta3,'doughnut','dochart');
  }

  valorRespuesta4: any = [0,0,0,0]; //[chat, dni, estado pedido, juegos]
  cargarDatosPregunta4() {

    for (let i = 0; i < this.encuestas.length; i++) {

      console.log(this.encuestas[i].itemsUtilizados);

        if(this.encuestas[i].itemsUtilizados.chat) {
          this.valorRespuesta4[0]++;
        }
        if(this.encuestas[i].itemsUtilizados.dni) {
          this.valorRespuesta4[1]++;
        }
        if(this.encuestas[i].itemsUtilizados.estadoPedido) {
          this.valorRespuesta4[2]++;
        }
        if(this.encuestas[i].itemsUtilizados.juegos) {
          this.valorRespuesta4[3]++;
        }
  }

    this.renderChart(['Chat', 'Scan DNI', 'Estado Pedido', 'Juegos'],this.valorRespuesta4,'polarArea','polarchart');
  }



  enviarEncuesta() {
    /*
    console.log('rb', this.resRadioBtn);
    console.log('cb chat', this.cbChat);
    console.log('cb pedido', this.cbEstadoPedido);
    console.log('cb juegos', this.cbJuegos);
    console.log('cb dni', this.cbDni);
    console.log('calificacion', this.calificacion);
    console.log('select', this.resSelect);
    console.log('comentario', this.comentario);
    */

    if(this.checkControles()) {

      const encuesta:any = {
        calificacion: this.calificacion,
        itemMasImportante: this.resRadioBtn,
        itemsUtilizados: {
          chat: this.cbChat != undefined ? true : false,
          estadoPedido: this.cbEstadoPedido != undefined ? true : false,
          juegos: this.cbJuegos != undefined ? true : false,
          dni: this.cbDni != undefined ? true : false,
        },
        interaccionQrs: this.resSelect,
        comentario: this.comentario != undefined ? this.comentario : ''
      };

      console.info(encuesta);

      this.bd.addEncuesta(encuesta);

      this.cambiarEstadoEncuesta();
    }

  }

  checkControles() {
    if(this.resRadioBtn != undefined && this.calificacion != undefined && this.resSelect != undefined) {
      this.presentToast('bottom', 'Gracias por responder nuestra encuesta!', 'success');
      return true;
    }
    else {
      this.presentToast('bottom', 'Quedaron campos sin completar', 'warning');
      return false;
    }
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', msj:string, color: string, duration:number=1000) {
    const toast = await this.toast.create({
      message: msj,
      duration: duration,
      position: position,
      color: color
    });

    await toast.present();
  }

  private async cambiarEstadoEncuesta() {
    const ref = doc(this.fs, 'usuarios', this.usuarioActual.uid);
    await updateDoc(ref, {completoEncuesta: true});
  }


  renderChart(labeldata:any, maindata:any, type:any, id:any) {
    const myChart = new Chart(id, {
      type: type,
      data: {
        labels: labeldata,
        datasets: [{
          label: 'Votos',
          data: maindata,
          backgroundColor: [
            'rgba(255, 99, 132)',
            'rgba(255, 159, 64)',
            'rgba(255, 205, 86)',
            'rgba(75, 192, 192)',
            'rgba(54, 162, 235)',
            'rgba(153, 102, 255)',
            'rgba(201, 203, 207)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  }

  private async savePicture(photo: Photo) {
    const fileName = new Date().getTime() + '.jpeg';
    
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const filepath = 'fotosEncuesta' + '/' + fileName;
    const imgRef= ref(this.storage, filepath);

    await uploadBytes(imgRef, blob)
    
    .then(()=>{
      getDownloadURL(ref(this.storage, 'fotosEncuesta/'+fileName))
      .then((url:any)=>{
        this.fotoUsr = url;
        this.fotosSubidas++;
        this.presentToast('middle', `Foto agregada: ${this.fotosSubidas} de 3 disponibles`, 'success');
      });
      
    })

    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }


  public async addNewToGallery() {

    if(this.fotosSubidas < 3) {
      // Take a photo
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri, // file-based data; provides best performance
        source: CameraSource.Camera, // automatically take a new photo with the camera
        quality: 100 // highest quality (0 to 100)
        
      });
      // Save the picture and add it to photo collection
      //this.mostrarFoto = true
      const savedImageFile = await this.savePicture(capturedPhoto);
      
      this.photos.unshift(savedImageFile);
    }
    else {
      this.presentToast('middle', 'Límite de fotos alcanzado', 'warning');
    }
  }


}