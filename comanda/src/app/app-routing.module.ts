import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
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
  },  {
    path: 'encuesta',
    loadChildren: () => import('./pages/encuesta/encuesta.module').then( m => m.EncuestaPageModule)
  },







];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
