import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ref, uploadBytes, Storage, getDownloadURL } from '@angular/fire/storage';
import { BaseService } from 'src/app/services/base.service';
import { ToastController } from '@ionic/angular';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';


export interface ProductoFoto {
  filepath: string;
  webviewPath?: string;
  urlFoto: any;
}


@Component({
  selector: 'app-alta-plato',
  templateUrl: './alta-plato.page.html',
  styleUrls: ['./alta-plato.page.scss'],
})
export class AltaPlatoPage implements OnInit {

  spinner: boolean = false;
  fotoUsr: string = "";
  public photos: ProductoFoto[] = [];
  arrayProductos : any[] = [];

  foto_1: string = "";
  foto_2: string = "";
  foto_3: string = "";
  precio!: number;
  tiempo!: number;
  nombre: string = "";

  constructor(private storage: Storage, private bd: BaseService, private toastController: ToastController,
    private bdFire : Firestore, private router : Router) { }

  ngOnInit() {
    this.bd.getProductos().subscribe(data => this.arrayProductos = data);
  }

  private async savePicture(photo: Photo) {
    this.spinner = true;
    const fileName = new Date().getTime() + '.jpeg';
   
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const filepath = 'productos' + '/' + fileName;
    const imgRef= ref(this.storage, filepath);

    await uploadBytes(imgRef, blob)
    
    .then(()=>{
      getDownloadURL(ref(this.storage, 'productos/'+fileName))
      .then((url:any)=>{
        this.fotoUsr = url;
        this.spinner = false;
        setTimeout(()=>{
          this.photos.push({
            filepath: fileName,
            webviewPath: photo.webPath,
            urlFoto: url
          });
        }, 300)
      });
    })

    // return {
    //   filepath: fileName,
    //   webviewPath: photo.webPath,
    //   urlFoto: this.fotoUsr
    // };
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
    // const savedImageFile = await this.savePicture(capturedPhoto);
    this.savePicture(capturedPhoto);
    // savedImageFile.urlFoto = this.fotoUsr;

    // this.photos.push(savedImageFile);
    // console.log(this.photos);
  }


  subirPlato(){
    if(this.tiempo != undefined && this.precio != undefined && this.nombre != '')
    {
      this.foto_1 = this.photos[0].urlFoto;
      this.foto_2 = this.photos[1].urlFoto;
      this.foto_3 = this.photos[2].urlFoto;
      console.log(this.photos);
      
      if(this.foto_1 != '' && this.foto_2 != '' && this.foto_3 != '')
      {
        const platoRef = collection(this.bdFire, 'productos');

        addDoc(platoRef,{
          foto: this.foto_1,
          foto2: this.foto_2,
          foto3: this.foto_3,
          descripcion: this.nombre,
          precio: this.precio,
          tiempo: this.tiempo
        }).then(()=>{
          this.presentToast('bottom', 'Plato cargado con exito!', 'success');
          this.router.navigate(['/home']);
        })
      }
      else
      {
        this.presentToast('bottom', 'Suba todas las fotos!', 'danger')
      }
    }
    else
    {
      this.presentToast('bottom', 'Complete todos los campos!', 'danger')
    }
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', msj:string, color: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 1000,
      position: position,
      color: color
    });

    await toast.present();
  }
}
