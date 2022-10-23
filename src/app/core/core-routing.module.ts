
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppUrls } from '../config/app-urls.config';


const routes: Routes = [
  { path: AppUrls.App, redirectTo: AppUrls.AppLocalProductList, pathMatch: 'full' },
  { path: AppUrls.AppLocalProductList, loadChildren: () => import('../+modules/local-product/local-product.module').then(m => m.LocalProductModule) },
  { path: AppUrls.AppLocalProductDetail, loadChildren: () => import('../+modules/local-product/local-product.module').then(m => m.LocalProductModule) },
]


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class CoreRoutingModule { }