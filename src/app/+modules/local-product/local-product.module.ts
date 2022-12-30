import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalProductListComponent } from './components/local-product-list/local-product-list.component'
import { SharedModule } from 'src/app/shared/shared.module';
import { LocalProductDetailComponent } from './components/local-product-detail/local-product-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatePipe } from 'src/app/pipes/paginate.pipe';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as Globals from '../../../app/shared/global';
// import { VisualsModule } from 'src/app/shared/visuals/visuals.module';

//Because is the "local-product" page  ----> "RouterModule.forChild(["   in imports 

@NgModule({
  declarations: [LocalProductListComponent, LocalProductDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    RouterModule.forChild([
      {
        path: '',
        component: LocalProductListComponent
      },
      {
        path: Globals.DETAIL,
        component: LocalProductDetailComponent
      }
    ]),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
    // VisualsModule
  ],
  exports: [
    
  ]
})

export class LocalProductModule { }