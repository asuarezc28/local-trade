import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppUrls } from 'src/app/config/app-urls.config';
import { LocalProductDetailComponent } from './components/local-product-detail/local-product-detail.component';
import { LocalProductListComponent } from './components/local-product-list/local-product-list.component';

const routes: Routes = [
  { path: AppUrls.AppLocalProductListRoot, redirectTo: AppUrls.AppLocalProductList, pathMatch: 'full' },
  { path: AppUrls.AppLocalProductList, component: LocalProductListComponent },
  { path: AppUrls.AppLocalProductDetail, component: LocalProductDetailComponent },
//   {
//     path: AppUrls.AppLocalProduct, component: LocalProductListComponent, children: [
//       { path: AppUrls.AppLocalProductDetail, component: LocalProductDetailComponent },
//     ]
//   }
]


@NgModule({
  imports: [
    RouterModule.forChild(routes), 
  ],
  exports: [RouterModule]
})
export class LocalProductRoutingModule { }