import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppUrls } from 'src/app/config/app-urls.config';
import { MapSidebarService } from 'src/app/services/map-sidebar/map-sidebar.service';
import { ToDetailPageService } from 'src/app/services/to-detail-page-service/to-detail-page.service';
import { DialogPhotoGalleryComponent } from 'src/app/shared/components/dialog-photo-gallery/dialog-photo-gallery.component';

@Component({
  selector: 'app-local-product-detail',
  templateUrl: './local-product-detail.component.html',
  styleUrls: ['./local-product-detail.component.css']
})
export class LocalProductDetailComponent implements OnInit {

  shopShowed;
  images = [944, 1011].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor(
    public router: Router,
    private toDetailService: ToDetailPageService,
    private mapSidebarService: MapSidebarService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.toDetailService.shopToDetailPage$.subscribe(shop => {
      if (shop.length > 0) {
        this.shopShowed = shop[0];
        this.mapSidebarService.detailPage(true);
      } 
    });
  }

  goToBackPage(): void {
    this.router.navigate([AppUrls.AppLocalProductList]);
  }


  openDialog(): void {
    // width: '100vw',
    // maxWidth: '100vw',
    this.dialog.open(DialogPhotoGalleryComponent, {
      width: '800px'
      // maxWidth: '100vw',
    });
  }

  ngAfterViewInit(): void {
    if (!this.shopShowed) {
      this.router.navigate([AppUrls.AppLocalProductList]).then(() => {
        window.location.reload();
      });
    }
}
}