import { Component, OnInit } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, uploadString } from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { LoadingController, ToastController } from '@ionic/angular';
import { Chart, ChartType, registerables } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';
Chart.register(...registerables);

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {

  fotosSubidas:number=0;
  imgSource:any;

  chartdata: any;

  labeldataCalificacion: any[] = [];
  realdataCalificacion: any[] = [];

  labeldataQR: any[] = [];
  realdataQR: any[] = [];


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

  constructor(private toast:ToastController, private bd:BaseService, private auth:AuthService, private fs:Firestore, private loadingCtrl:LoadingController, private toastCtrl:ToastController) { }

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
              console.log(this.encuestas.length);

              this.labeldataCalificacion = [1,2,3,4,5,6,7,8,9,10];
              this.labeldataQR = ['si', 'mejorar', 'no'];

              for(let i=0; i<this.encuestas.length; i++) { 

                //console.log(this.encuestas[i].calificacion);
                this.realdataCalificacion.push(this.encuestas[i].calificacion);

                this.realdataQR.push(this.encuestas[i].interaccionQrs);
              }

              //console.log(this.labeldataCalificacion);
              //console.log(this.realdataCalificacion);

              this.renderChart(this.labeldataCalificacion,this.realdataCalificacion,'pie','piechart');
              this.renderChart(this.labeldataQR,this.realdataQR,'bar','barchart');

              //this.renderChart(this.labeldata,this.realdata,this.colordata,'doughnut','dochart');

            }
            
          }, 2000);

            
        }
      });
    },1000)
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
        itemMasImporante: this.resRadioBtn,
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
          label: '',
          data: maindata,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
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

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false, 
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
      saveToGallery: false
    })
      this.imgSource = 'data:image/jpeg;base64,' + image.base64String;
      
      console.info('img', this.imgSource);

      if(image) {
        const loading = await this.loadingCtrl.create();
        await loading.present();

        const result = await this.uploadImage(image, 'fotoCliente');
        
        if(result) {
          const toast = await this.toastCtrl.create({
            message: 'La imagen fue subida correctamente',
            position: 'bottom',
            duration: 2000
          });

          toast.present();
        }
        loading.dismiss();
      }
    }   

    async uploadImage(cameraFile:Photo, foto:string) { 
      return null;
    }
}
