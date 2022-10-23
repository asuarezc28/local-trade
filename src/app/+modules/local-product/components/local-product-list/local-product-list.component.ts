import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppUrls } from 'src/app/config/app-urls.config';
import {
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MapSidebarService } from 'src/app/services/map-sidebar/map-sidebar.service';
import { ToDetailPageService } from 'src/app/services/to-detail-page-service/to-detail-page.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PaginatorInfoToSearchService } from 'src/app/services/paginator-info-to-search/paginator-info-to-search.service';
import { MatDialog } from '@angular/material/dialog';
import { GoogleMapDialogComponent } from 'src/app/core/modals/google-map-dialog/google-map-dialog.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-local-product',
  templateUrl: './local-product-list.component.html',
  styleUrls: ['./local-product-list.component.css']
})
export class LocalProductListComponent implements OnInit {

  show: boolean = false;
  formDetailPage: boolean = false;
  hasDataOnForm: boolean = false;
  localProductShops;
  onSearchShops;
  localForm;
  routesArray = [];
  pageSize;
  pageNumber;
  pageSizeOptions = [5, 10, 20];
  @ViewChild('paginator') paginator: MatPaginator;
  ordersData = [];
  pageIndexChangeClick;
  pageNumberChangeClick;
  changePage = true;
  byMunicipalitie: boolean = true;
  sliderValue: number;
  radioButtonValue: string;
  isSubmit: boolean = false;
  canChangePage: boolean = true;
  sortByLocation: boolean = false;
  sortBy: string;
  returnFormDetail: boolean;
  isTermSelected: boolean = true;
  coordinatesLocation: any;
  originalData: any;
  isLoading: boolean = false;
  public orderAlphaOption = {
    label: 'Alpha', value: 'alpha', checked: true
  };
  public orderLocationOption = {
    label: 'Location', value: 'location', checked: false
  };


  constructor(
    private router: Router,
    private mapSidebarService: MapSidebarService,
    private toDetailService: ToDetailPageService,
    private paginatorInfoToSearchService: PaginatorInfoToSearchService,
    private dialog: MatDialog
  ) {
    this.localForm = new FormGroup({
      shopping: new FormControl(''),
      muni: new FormControl(''),
      radioLocationMuni: new FormControl(''),
      test: new FormControl(''),
      byTerm: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.mapSidebarService.formDetailPage$.subscribe(response => {
      this.formDetailPage = response;
    });

    if (!this.formDetailPage) {
      localStorage.removeItem('filterFormLocal');
      localStorage.removeItem('pageChangeClick');
      localStorage.removeItem('page');
      sessionStorage.removeItem('sort');
    }

    this.getDataShops();

    if (!this.formDetailPage) {
      this.localForm.controls['shopping'].setValue('All');
      const shoppingValue = this.localForm.get('shopping').value;
      // const radioButtonsValue = this.localForm.get('radioLocationMuni').value;
      const filterFormLocal = [shoppingValue];
      localStorage.setItem('filterFormLocal', JSON.stringify(filterFormLocal));
    }

    const formFilter = JSON.parse(localStorage.getItem('filterFormLocal'));

    if (formFilter && this.formDetailPage) {
      this.localForm.controls['shopping'].setValue(formFilter[0]);
    }

    this.mapSidebarService.isLoadingLogo$.subscribe(data => {
      this.isLoading = true;
    })
  }

  getDataShops(): void {
    this.mapSidebarService.dataToLocalProductLayer$.subscribe(async data => {
      this.originalData = data;
      const localSPage = localStorage.getItem('page');
      if (localSPage && this.formDetailPage) {
        this.pageNumber = Number(localSPage);
      } else {
        this.pageNumber = 1;
      }
      this.pageSize = 20;
      const dataMap: any = data.map((feature) => feature.attributes);
      this.orderShops(dataMap);
    });
  }

  orderShops(dataMap: any): void {
    this.sortBy = sessionStorage.getItem('sort') ? sessionStorage.getItem('sort') : 'alpha';
    if (this.sortBy === 'location') {
      this.localProductShops = [];
      setTimeout(() => {
        this.sortLocation(dataMap);
        this.isLoading = false;
      }, 2000);
    } else if (!this.sortBy || this.sortBy === 'alpha') {
      const orderDataMap = dataMap.sort((a, b) => {
        return (a.NOMBRE > b.NOMBRE) ? 1 : -1;
      });
      this.localProductShops = orderDataMap;
      this.onSearchShops = orderDataMap;
      this.isLoading = false;
    }
  }


  handlePage(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    if (this.changePage) {
      localStorage.setItem('page', this.pageNumber);
    } else {
      this.changePage = true;
    }
    this.paginatorInfoToSearchService.isHandle$.emit(true);
  }

  pageChange(): void {
    const pageChangeClick = [this.paginator.pageIndex, this.pageNumber];
    localStorage.setItem('pageChangeClick', JSON.stringify(pageChangeClick));
  }


  goToDetail(event): void {
    const shopToEmit = this.localProductShops.filter(shop => shop.NOMBRE === event.NOMBRE);
    this.toDetailService.shopToDetailPage.next(shopToEmit);
    this.router.navigate([AppUrls.AppLocalProductList, 'detail']);
  }

  zoomToMap(event): void {
    this.mapSidebarService.idItemToMap$.emit(event);
  }

  onSearchChange(filterValue): void {
    this.changePage = false;
    if (filterValue === '') {
      this.localProductShops = this.onSearchShops;
      const pageChangeClick = JSON.parse(localStorage.getItem('pageChangeClick'));
      if (pageChangeClick) {
        this.paginator.pageIndex = pageChangeClick[0];
        this.pageNumber = pageChangeClick[1];
      }
    } else {
      const shopsFilteredBySearch = this.onSearchShops.filter(shop => shop.NOMBRE.toLowerCase().includes(filterValue.toLowerCase()));
      this.localProductShops = shopsFilteredBySearch;
      this.paginator.firstPage();
    }
  }

  onSearchTerm(event): void {

  }


  onSubmit(): void {
    const userLatLon = JSON.parse(sessionStorage.getItem('userUbication'));
    if (userLatLon || this.sortBy === 'alpha') {
      this.isLoading = true;
    }
    if (this.isTermSelected) {
      const byTermValue = this.localForm.get('byTerm').value;
      const dataFilter = [this.removeAccents(byTermValue), this.pageNumber, true];
      this.mapSidebarService.filtersToMap(dataFilter);
    } else {
      const shoppingValue = this.localForm.get('shopping').value;
      const dataFilter = [shoppingValue, this.pageNumber, false];
      this.mapSidebarService.filtersToMap(dataFilter);
      const filterFormLocal = [shoppingValue];
      localStorage.setItem('filterFormLocal', JSON.stringify(filterFormLocal));
    }
    setTimeout(() => {
      if (this.sortBy === 'location') {
        this.obtainLocation();
      }
    }, 2000);
    this.paginator.firstPage();
  }

  removeAccents(byTermValue): string {
    return byTermValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  obtainLocation(): void {
    this.orderAlphaOption.checked = false;
    this.orderLocationOption.checked = true;
    this.returnFormDetail = false;
    const userLatLon = JSON.parse(sessionStorage.getItem('userUbication'));
    if (userLatLon) {
      this.isLoading = true;
      this.mapSidebarService.orderDataByLocation(userLatLon);
      this.sortByLocation = true;
      sessionStorage.setItem('sort', 'location');
      this.sortBy = sessionStorage.getItem('sort');
    } else {
      this.mapSidebarService.requestUserLocation(true);
    }
  }


  orderByAlpha(): void {
    this.orderAlphaOption.checked = true;
    this.orderLocationOption.checked = false;
    this.localProductShops = [];
    setTimeout(() => {
      const data = this.onSearchShops;
      const orderDataMap = data.sort((a, b) => {
        return (a.NOMBRE > b.NOMBRE) ? 1 : -1;
      });
      this.localProductShops = orderDataMap;
      sessionStorage.setItem('sort', 'alpha');
      this.sortBy = sessionStorage.getItem('sort');
      this.paginator.firstPage();
    }, 1000);
  }


  sortLocation(dataMap): void {
    const orderDataMap = dataMap.sort((a, b) => {
      return parseFloat(a.distance) - parseFloat(b.distance);
    });
    this.localProductShops = orderDataMap;
    this.onSearchShops = dataMap;
    if (!this.returnFormDetail) {
      this.paginator.firstPage();
    }
  }

  byCatOrTerm(event): void {
    if (event.value === "term") {
      this.isTermSelected = true;
    } else {
      this.isTermSelected = false;
    }
  }


  openDialog(item): void {
    const userLatLon = JSON.parse(sessionStorage.getItem('userUbication'));
    if (userLatLon) {
      this.openMapDialog(userLatLon, item);
    } else {
      alert('You need allow the coordinates position')
    }
  }

  openMapDialog(coordinates: any, item: any): void {
    let shopChoosen;
    this.originalData.map((shop) => {
      if (shop.attributes.NOMBRE === item.NOMBRE) {
        shopChoosen = shop;
      }
    }
    );
    const dialogRef = this.dialog.open(GoogleMapDialogComponent, {
      width: '60%',
      data: {
        dataKey: coordinates,
        shop: {
          latitude: shopChoosen.geometry.latitude,
          longitude: shopChoosen.geometry.longitude
        }
      }
      //TO PHONE SCREEN:
      // maxWidth: '100vw',
      // maxHeight: '100vh',
      // height: '100%',
      // width: '100%',
      // panelClass: 'full-screen-modal'
    });
  }

  ngAfterViewInit(): void {
    const page = localStorage.getItem('page');
    const updatePage = Number(page);
    if (this.formDetailPage && updatePage) {
      setTimeout(() => {
        this.paginator.pageIndex = updatePage - 1;
        this.returnFormDetail = this.formDetailPage;
        this.mapSidebarService.detailPage(false);
        this.canChangePage = false;
      }, 1000);
    } else {
      setTimeout(() => {
        this.canChangePage = false;
      }, 1000);
    }
    if (this.formDetailPage) {
      if (this.sortBy === 'alpha') {
        this.orderAlphaOption.checked = true;
        this.orderLocationOption.checked = false;
      } else {
        this.orderAlphaOption.checked = false;
        this.orderLocationOption.checked = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.mapSidebarService.detailPage(false);
  }
}


