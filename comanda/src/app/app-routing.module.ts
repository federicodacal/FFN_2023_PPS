import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'alta-usuario',
    loadChildren: () => import('./pages/alta-usuario/alta-usuario.module').then( m => m.AltaUsuarioPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pagesComp/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'encuesta',
    loadChildren: () => import('./pages/encuesta/encuesta.module').then( m => m.EncuestaPageModule)
  },
  {
    path: 'menu-opciones',
    loadChildren: () => import('./pages/menu-opciones/menu-opciones.module').then( m => m.MenuOpcionesPageModule)
  },
  {
    path: 'pedidos-cargados',
    loadChildren: () => import('./pages/pedidos-cargados/pedidos-cargados.module').then( m => m.PedidosCargadosPageModule)
  },
  {
    path: 'ver-pedidos',
    loadChildren: () => import('./pages/ver-pedidos/ver-pedidos.module').then( m => m.VerPedidosPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule)
  },








];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
