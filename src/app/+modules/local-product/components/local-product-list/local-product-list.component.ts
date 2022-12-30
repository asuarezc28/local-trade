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
import { Search } from '../../models/search';
import * as Globals from '../../../../shared/global';


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
  @ViewChild(Globals.PAGINATOR) paginator: MatPaginator;
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
    label: 'Alpha', value: Globals.ALPHA, checked: true
  };
  public orderLocationOption = {
    label: 'Location', value: Globals.LOCATION, checked: false
  };


  constructor(
    private router: Router,
    private mapSidebarService: MapSidebarService,
    private toDetailService: ToDetailPageService,
    private paginatorInfoToSearchService: PaginatorInfoToSearchService,
    private dialog: MatDialog
  ) {
    this.localForm = new FormGroup({
      shopping: new FormControl(Globals.EMPY),
      muni: new FormControl(Globals.EMPY),
      radioLocationMuni: new FormControl(Globals.EMPY),
      test: new FormControl(Globals.EMPY),
      byTerm: new FormControl(Globals.EMPY),
    });
  }

  ngOnInit(): void {
    this.mapSidebarService.formDetailPage$.subscribe(response => {
      this.formDetailPage = response;
    });

    if (!this.formDetailPage) {
      localStorage.removeItem(Globals.FILTERFORMLOCAL);
      localStorage.removeItem(Globals.PAGECHANGECLICK);
      localStorage.removeItem(Globals.PAGE);
      sessionStorage.removeItem(Globals.SHORT);
    }

    this.getDataShops();

    if (!this.formDetailPage) {
      this.localForm.controls[Globals.SHOPPING].setValue('All');
      const shoppingValue = this.localForm.get(Globals.SHOPPING).value;
      // const radioButtonsValue = this.localForm.get('radioLocationMuni').value;
      const filterFormLocal = [shoppingValue];
      localStorage.setItem(Globals.FILTERFORMLOCAL, JSON.stringify(filterFormLocal));
    }

    const formFilter = JSON.parse(localStorage.getItem(Globals.FILTERFORMLOCAL));

    if (formFilter && this.formDetailPage) {
      this.localForm.controls[Globals.SHOPPING].setValue(formFilter[0]);
    }

    this.mapSidebarService.isLoadingLogo$.subscribe(data => {
      this.isLoading = true;
    })
  }

  getDataShops(): void {
    this.mapSidebarService.dataToLocalProductLayer$.subscribe(async data => {
      this.originalData = data;
      const localSPage = localStorage.getItem(Globals.PAGE);
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
    this.sortBy = sessionStorage.getItem(Globals.SHORT) ? sessionStorage.getItem(Globals.SHORT) : Globals.ALPHA;
    if (this.sortBy === Globals.LOCATION) {
      this.localProductShops = [];
      setTimeout(() => {
        this.sortLocation(dataMap);
        this.isLoading = false;
      }, 2000);
    } else if (!this.sortBy || this.sortBy === Globals.ALPHA) {
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
      localStorage.setItem(Globals.PAGE, this.pageNumber);
    } else {
      this.changePage = true;
    }
    this.paginatorInfoToSearchService.isHandle$.emit(true);
  }

  pageChange(): void {
    const pageChangeClick = [this.paginator.pageIndex, this.pageNumber];
    localStorage.setItem(Globals.PAGECHANGECLICK, JSON.stringify(pageChangeClick));
  }


  goToDetail(event): void {
    const shopToEmit = this.localProductShops.filter(shop => shop.NOMBRE === event.NOMBRE);
    this.toDetailService.shopToDetailPage.next(shopToEmit);
    this.router.navigate([AppUrls.AppLocalProductList, Globals.DETAIL]);
  }

  zoomToMap(event): void {
    this.mapSidebarService.idItemToMap$.emit(event);
  }

  onSearchChange(filterValue): void {
    this.changePage = false;
    if (filterValue === Globals.EMPY) {
      this.localProductShops = this.onSearchShops;
      const pageChangeClick = JSON.parse(localStorage.getItem(Globals.PAGECHANGECLICK));
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


  onSubmit(): void {
    let dataFilter: Search;
    const userLatLon = JSON.parse(sessionStorage.getItem(Globals.USERUBICATION));
    if (userLatLon || this.sortBy === Globals.ALPHA) {
      this.isLoading = true;
    }
    if (this.isTermSelected) {
      const byTermValue = this.localForm.get(Globals.BYTERM).value;
      dataFilter = new Search(true, this.pageNumber, null, this.removeAccents(byTermValue));
      this.mapSidebarService.filtersToMap(dataFilter);
    } else {
      const shoppingValue = this.localForm.get(Globals.SHOPPING).value;
      dataFilter = new Search(false, this.pageNumber, shoppingValue);
      this.mapSidebarService.filtersToMap(dataFilter);
      const filterFormLocal = [shoppingValue];
      localStorage.setItem(Globals.FILTERFORMLOCAL, JSON.stringify(filterFormLocal));
    }
    setTimeout(() => {
      if (this.sortBy === Globals.LOCATION) {
        this.obtainLocation();
      }
    }, 2000);
    this.paginator.firstPage();
  }

  removeAccents(byTermValue): string {
    return byTermValue.normalize(Globals.NFD).replace(/[\u0300-\u036f]/g, Globals.EMPY).toLowerCase();
  }

  obtainLocation(): void {
    this.orderAlphaOption.checked = false;
    this.orderLocationOption.checked = true;
    this.returnFormDetail = false;
    const userLatLon = JSON.parse(sessionStorage.getItem(Globals.USERUBICATION));
    if (userLatLon) {
      this.isLoading = true;
      this.mapSidebarService.orderDataByLocation(userLatLon);
      this.sortByLocation = true;
      sessionStorage.setItem(Globals.SHORT, Globals.LOCATION);
      this.sortBy = sessionStorage.getItem(Globals.SHORT);
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
      sessionStorage.setItem(Globals.SHORT, Globals.ALPHA);
      this.sortBy = sessionStorage.getItem(Globals.SHORT);
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
    if (event.value === Globals.TERM) {
      this.isTermSelected = true;
    } else {
      this.isTermSelected = false;
    }
  }


  openDialog(item): void {
    const userLatLon = JSON.parse(sessionStorage.getItem(Globals.USERUBICATION));
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
      width: Globals.WIDTHMODALGOOGLELG,
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
    const page = localStorage.getItem(Globals.PAGE);
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
      if (this.sortBy === Globals.ALPHA) {
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


