import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BaseService } from 'src/app/services/base.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import * as htmlToImage from 'html-to-image'
import {Filesystem, Directory} from '@capacitor/filesystem'
import {Platform} from '@ionic/angular'
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { UserPhoto } from 'src/app/pages/alta-usuario/alta-usuario.page';


@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.component.html',
  styleUrls: ['./alta-mesa.component.scss'],
})
export class AltaMesaComponent  implements OnInit {
  nroMesa: any | undefined;
  foto: string = '';
  //test = 'hola la puta madre';

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;


  photos: UserPhoto[] = [];

  constructor(private bd: BaseService, private toastController: ToastController, private platform: Platform, private storage: Storage) { }

  ngOnInit() {
  }

  altaMesa(){
    if(this.nroMesa != undefined){
      let cargada = false;
      this.bd.getMesas().subscribe(mesas => {
        for(let i = 0; i<mesas.length; i++){
          if(mesas[i].numero == this.nroMesa){
            cargada = true;
            break;
          }
        }
        
        })
        setTimeout(()=>{
          if(!cargada){
            this.bd.addMesa(
              {numero: parseInt(this.nroMesa), 
              libre: true,
              foto: this.foto
              }).then(() => {this.nroMesa = undefined
                this.presentToast('bottom', 'Se dio de alta la mesa. El qr fue guardado en tu galería', 'success');
                htmlToImage.toJpeg(document.getElementById('imagenQr')!, {quality: 1})
                .then((dataUrl) => {
                  Filesystem.writeFile({
                    path: Date.now().toString() + '.jpeg',
                    data: dataUrl,
                    directory: Directory.Documents
                  })
                })
              })
          }
          else{
            this.presentToast('bottom', 'La mesa ya se encuentra cargada.', 'danger');
            this.nroMesa = undefined;
          }
         
        },1000)
      }
      
    else{
      this.presentToast('bottom', 'Debe especificar número de mesa.', 'warning')
    }
  }

  
  async presentToast(position: 'top' | 'middle' | 'bottom', msj:string, color: string, duration:number=1000) {
    const toast = await this.toastController.create({
      message: msj,
      duration: duration,
      position: position,
      color: color
    });

    await toast.present();
  }


  private async savePicture(photo: Photo) {
    const fileName = new Date().getTime() + '.jpeg';
   
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const filepath = 'fotoMesas' + '/' + fileName;
    const imgRef= ref(this.storage, filepath);

    await uploadBytes(imgRef, blob)
    
    .then(()=>{
      getDownloadURL(ref(this.storage, 'fotoMesas/'+fileName))
      .then((url:any)=>{
        this.foto = url;
      });
     
    })

    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }


  public async addNewToGallery() {
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

}
