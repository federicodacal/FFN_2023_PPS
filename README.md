# :fork_and_knife: FFN Restaurante

<img src="comanda/src/assets/logo_ffn.png" width=230>

## :clipboard: Trabajo Práctico Grupal PPS (UTN-Fra) 

### :computer: Integrantes: Franco Sultana, Nicolas Caretti, Federico Dacal

***

## Franco Sultana:
* Diseño Home.
* Alta Cliente. Validar datos.
* Registro mediante lectura QR DNI.
* Listado de productos.
* Consulta al mozo. Respuesta mozo.
* Cliente realiza pedido. Importe y tiempo estimado.
* Mozo entrega pedido y confirmación de cliente. Confirmación de pago.
* Push notification.
* Alta mesa. Generación de QRs nuevas mesas.

## Nicolas Caretti
* Diseño Login.
* Diseño registro cliente anónimo.
* Ingreso cliente anónimo. Login cliente anónimo.
* QR Mesa. Cliente accede al listado de productos para hacer el pedido.
* Confirmación mozo del pedido. Acepta o rechaza pedido.
* Interacción cliente y mozo.
* QR Propina, detalle de la propina y confirmación de pago.
* Push notification.
* Diseño y Alta plato de chef con fotos.

## Federico Dacal
* Supervisor acepta o rechaza registro.
* Autorización de correos electrónicos del restaurante.
* QR de entrada al local.
* Asignación de mesas por parte del Metre.
* Confirmación del chef y bartender.
* Listado pedido mozo. Verificación estado pedidos.
* Encuesta de satisfacción cliente.
* Gráficos de la encuesta de clientes.
* Push notification.
* Alta bebida de bartender con fotos.

### :pushpin: Planificación:

***

### :mag_right: Detalles de trabajo semana 1:

:calendar: 03/06/23: 
* El equipo de desarrollo es conformado y se toman decisiones respecto a la metodología de trabajo, entorno de desarrollo, tecnologías y servicios a utilizar y se acuerda el cronograma de actividades de la primera semana para cada programador.
* Decisión del nombre de la empresa/restaurante.
* El entorno de servicios de Firebase se prepara para autentificar usuarios y persistir los datos necesarios.

:calendar: 04/06/23:
* Diseño del tema para la UI.
* Diseño de page Home y Login de prueba.
* Se implementan las funcionalidades para comenzar a logear usuarios y dar de alta a nuevos clientes, con sus respectivos datos.

:calendar: 09/06/23:
* Diseño de page Login para los diferentes perfiles y autenticación de los usuarios.
* Modificaciones en la page Home.
* Desarrollo de funcionalidades específicas para el perfil Supervisor, aceptar o rechazar nuevos clientes.
* Automatización de emails del restaurante hacia los clientes registrados.

:calendar: 10/06/23:
* Modificaciones en page Login 
* Implementación del nuevo Login con 'Cliente anónimo'. Los clientes pueden accede con un perfil anónimo.

***

### :mag_right: Detalles de trabajo semana 2:

:calendar: 13/06/23:
* Generamos QR de entrada del restaurante. El cliente lo escanea para acceder a lista de espera hasta que se le asigne una mesa o el pedido sea rechazado.
* Funcionalidades del perfil Metre, quién debe asignar una mesa a los clientes en espera.

***

### :mag_right: Detalles de trabajo semana 3:

:calendar: 16/06/23:
* Consultas y comunicacion via chat con mozo.
* Relizacion de pedido por el cliente y verificacion en pantalla del mozo.
* Implementacion para que el cliente puede cargar su pedido.

:calendar: 17/06/23:
* Generamos QR de mesa del restaurante. El cliente lo escanea para que el cliente acceda al listado de los productos.
* El cliente realiza el pedido.
* Submenú home.

:calendar: 18/06/23:
* QR Mesa, confirmación mozo y actualización del estado del pedido para la verificación en pantalla del cliente.
* Chef y Bartender confirman que terminaron sus tareas y el pedido esta listo para entregar.
* Diseño page encuesta.

:calendar: 19/06/23:
* El cliente solicita la cuenta.
* QR propina. Mediante un codigo QR el cliente puede realizar un pago de propina.
* Detalle de la propina y confirmación.

:calendar: 20/06/23:
* Encuesta cliente.
* Confirmación del pago por parte del mozo.

:calendar: 21/06/23:
* Modificación del ingreso de cliente anónimo.
* Graficos de las encuentas de clientes.

:calendar: 23/06/23:
* Push notifications.
* Correcciones de diseño.
* Correciones generales.
* Diseño del logo.
* Splash estático y splash dinámico

***

### :mag_right: Detalles de trabajo semana 3:

:calendar: 02/07/23:
* Modificaciones en diseño UI.
* Correciones del flujo para cliente anónimo.
* Seguimiento de pedido.
* Al terminar de preparar el plato y/o bebida se le avisa al mozo, que luego confirma la entrega del pedido.

:calendar: 03/07/23:
* Generacion de QRs de propina. Modificaciones de cuenta y propina.
* Generación de QRs de nuevas mesas.
* Alta de mesas.
* Alta de platos.
* Alta bebidas.

***

### :iphone: Códigos QR:

* QR Entrada:
<img src="comanda/src/assets/qrEntrada.JPG" width=230>

* QR Mesas:
* Mesa 1:
<img src="comanda/src/assets/mesa1.png" width=230>

* Mesa 2:
<img src="comanda/src/assets/mesa2.png" width=230>

* Mesa 3:
<img src="comanda/src/assets/mesa3.png" width=230>

* Mesa 4:
<img src="comanda/src/assets/mesa4.png" width=230>

* Mesa 5:
<img src="comanda/src/assets/mesa5.png" width=230>

* QR Propina:
* Excelente (20%):
<img src="comanda/src/assets/qr_propina_excelente.png" width=230>

* Muy bueno (15%):
<img src="comanda/src/assets/qr_propina_muybueno.png" width=230>

* Bueno (10%):
<img src="comanda/src/assets/qr_propina_bueno.png" width=230>

* Regular (5%):
<img src="comanda/src/assets/qr_propina_regular.png" width=230>

* Malo (0%):
<img src="comanda/src/assets/qr_propina_malo.png" width=230>

***
