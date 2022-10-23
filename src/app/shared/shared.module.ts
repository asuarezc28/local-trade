import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualsModule } from './visuals/visual.module'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginatePipe } from '../pipes/paginate.pipe';
import { DialogPhotoGalleryComponent } from './components/dialog-photo-gallery/dialog-photo-gallery.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';




@NgModule({
  declarations: [PaginatePipe, DialogPhotoGalleryComponent],
  providers: [],
  imports: [
    CommonModule,
    VisualsModule,
    NgbModule,
    MatCarouselModule.forRoot()
  ],
  exports: [
    VisualsModule,
    NgbModule,
    PaginatePipe
  ]
})
export class SharedModule { }