import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { ref, uploadBytes, Storage, getDownloadURL } from '@angular/fire/storage';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { firstValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

@Component({
  selector: 'app-alta-usuario',
  templateUrl: './alta-usuario.page.html',
  styleUrls: ['./alta-usuario.page.scss'],
})
export class AltaUsuarioPage implements OnInit {

  public photos: UserPhoto[] = [];
  fotoUsr: string = "";

  perfil = 'cliente';
  formUsuario: FormGroup;
  esAnonimo: boolean = false;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private bd: BaseService,
    private storage: Storage, private barcodeScanner: BarcodeScanner, private toastController: ToastController, private router: Router) { 
    this.formUsuario = this.formBuilder.group({ 
      apellidos: ['', [Validators.required]],
      nombres: ['', [Validators.required,]],
      DNI: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      correo: ['', [Validators.required]],
      clave: ['', Validators.required],
      claveRepetida: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    
  }

  async checkearAnonimo(){
    //let anonimo = !this.esAnonimo;
    //this.esAnonimo = anonimo;
    console.log(this.esAnonimo);
      if(!this.esAnonimo){
        this.formUsuario.controls["apellidos"].setValidators([Validators.required]);
        this.formUsuario.controls["apellidos"].updateValueAndValidity();
        this.formUsuario.controls["DNI"].setValidators([Validators.required]);
        this.formUsuario.controls["DNI"].updateValueAndValidity();
        this.formUsuario.controls["correo"].setValidators([Validators.required]);
        this.formUsuario.controls["correo"].updateValueAndValidity();
        this.formUsuario.controls["clave"].setValidators([Validators.required]);
        this.formUsuario.controls["clave"].updateValueAndValidity();        
        this.formUsuario.controls["claveRepetida"].setValidators([Validators.required]);
        this.formUsuario.controls["claveRepetida"].updateValueAndValidity();
      } else {
        this.formUsuario.controls["apellidos"].setValidators(null);
        this.formUsuario.controls["apellidos"].updateValueAndValidity();
        this.formUsuario.controls["DNI"].setValidators(null);
        this.formUsuario.controls["DNI"].updateValueAndValidity();
        this.formUsuario.controls["correo"].setValidators(null);
        this.formUsuario.controls["correo"].updateValueAndValidity();
        this.formUsuario.controls["clave"].setValidators(null);
        this.formUsuario.controls["clave"].updateValueAndValidity();
        this.formUsuario.controls["claveRepetida"].setValidators(null);
        this.formUsuario.controls["claveRepetida"].updateValueAndValidity();
      }
    }

    darDeAlta(){
      
      let ok = true;
      let usuario = this.cargarDatosClientes();

      Promise.all([
        firstValueFrom(this.bd.getUsuarios('cliente')),
        //firstValueFrom(this.getImagesFirebase())
      ]).then(([usr]) => {
          usr.forEach(u => {
            console.log(u.correo + ' - '+ usuario.correo)

            if(u.correo == usuario.correo){
              this.presentToast("bottom", "El correo está en uso", 'danger');
              ok = false;
            }
            if(u.dni == usuario.dni){
              this.presentToast("bottom", "El dni está en uso", 'danger');
              ok = false;
            }
            if(!this.esAnonimo && usuario.clave != usuario.claveRepetida){
              this.presentToast("bottom", "Las contraseñas no coinciden", 'warning');
              ok = false;

            }
  
          })
          if(ok){
            if(this.esAnonimo){
              this.auth.registrarAnonimo().then((usr: any) =>{
                usuario.uid = usr.user.uid;
                usuario.estadoUsuario = 1;
                this.bd.addAnonimo(usuario)
                this.router.navigateByUrl('home');
              })
            }else{
              this.auth.register(usuario.correo, usuario.clave)
              .then(response => this.bd.addUsuario(usuario, response.user.uid))
              .catch(error => console.log(error));
            }     
            this.formUsuario.reset();          
            this.presentToast("bottom", "Se dio de alta correctamente", 'success');
          }
            
      });
  
    }
    

    private cargarDatosClientes(){
      let usuario: any = {};
      switch(this.perfil){
        case 'cliente':

          if(this.esAnonimo)
          {
            usuario = {
            nombre: this.formUsuario.controls['nombres'].value,
            perfil: 'anonimo',
            foto: this.fotoUsr,
            dni:0
            }
          }
          else{
            usuario = {
              nombre: this.formUsuario.controls['nombres'].value,
              apellido: this.formUsuario.controls['apellidos'].value,
              dni: this.formUsuario.controls['DNI'].value,
              correo: this.formUsuario.controls['correo'].value,
              clave: this.formUsuario.controls['clave'].value,
              claveRepetida: this.formUsuario.controls['claveRepetida'].value,
              perfil: 'cliente',
              foto: this.fotoUsr
            }
          }
          usuario.mesa = -1;
          usuario.estadoUsuario = 0;
          
        break;
      }
      return usuario;
    }

    private async savePicture(photo: Photo) {
      const fileName = new Date().getTime() + '.jpeg';
     
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      const filepath = 'fotosUsr' + '/' + fileName;
      const imgRef= ref(this.storage, filepath);
  
      await uploadBytes(imgRef, blob)
      
      .then(()=>{
        getDownloadURL(ref(this.storage, 'fotosUsr/'+fileName))
        .then((url:any)=>{
          this.fotoUsr = url;
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
    

    async escanear(){
      let data = "";
      this.barcodeScanner.scan({formats:"PDF_417"}).then(barcodeData => {
        data = barcodeData.text;

        let array: string[] = [];
      //let result = await BarcodeScanner.startScan();
  
      array = data.split('@');
        if(array[2] == 'A' && array[3] == '1'){
          this.formUsuario.controls['apellidos'].setValue(array[4]);
          this.formUsuario.controls['nombres'].setValue(array[5]);
          this.formUsuario.controls['DNI'].setValue(array[1]);
        }
        else{
          //this.presentToast('middle', result.content!, 'success')
          this.formUsuario.controls['apellidos'].setValue(array[1]);
          this.formUsuario.controls['nombres'].setValue(array[2]);
          this.formUsuario.controls['DNI'].setValue(array[4]);
        }
      

      
      });
      
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
