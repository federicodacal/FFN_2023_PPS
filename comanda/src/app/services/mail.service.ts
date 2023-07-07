import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { init } from '@emailjs/browser';
init('SoRqwpwlCQgFjOxAB');

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor() { }

  sendConfirmationEmail(user:any) {

    let message;
    if(user.estadoUsuario == 1) {
      message = 'Su cuenta fue verificada con éxito por FFN Restaurante. Puede ingresar a la aplicación.'; 
    }
    else if(user.estadoUsuario == -1) {
      message = 'Su cuenta fue rechazada por FFN Restaurante. No puede ingresar a la aplicacion. Pruebe en otro momento.';
    }

    const params = {
      to_name: user.nombre,
      message: message,
      user_email: user.correo,
      from_name: 'FFN Restaurante'
    }

    emailjs.send('service_xnuuwrz', 'template_d9knm2k', params)
    .then(res => {
      console.log('Email enviado', res.status, res.text)
    })
    .catch(err => {
      console.log('Email error', err);
    });
  }

  sendConfirmationEmailReserva(user:any) {

    let message;
    message = 'Su reserva fue confirmada. Sea puntual'; 

    const params = {
      to_name: user.nombre,
      message: message,
      user_email: user.correo,
      from_name: 'FFN Restaurante'
    }

    emailjs.send('service_xnuuwrz', 'template_d9knm2k', params)
    .then(res => {
      console.log('Email enviado', res.status, res.text)
    })
    .catch(err => {
      console.log('Email error', err);
    });
  }
}
