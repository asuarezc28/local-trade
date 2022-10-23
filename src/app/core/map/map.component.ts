import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  NgZone
} from '@angular/core';

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Point from "@arcgis/core/geometry/Point";
import Graphic from '@arcgis/core/Graphic';
import Locate from "@arcgis/core/widgets/Locate";
import * as geometryService from "@arcgis/core/rest/geometryService";
import DistanceParameters from "@arcgis/core/rest/support/DistanceParameters";
import config from '@arcgis/core/config.js';
import { MapSidebarService } from 'src/app/services/map-sidebar/map-sidebar.service';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { DataMapServiceService } from 'src/app/services/data-map-service/data-map-service.service';
import { SidebarMenuService } from 'src/app/services/sidebar-menu-service/sidebar-menu.service';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnDestroy {


  private view: any = null;
  public actualLayer;
  public layerByLocation: FeatureLayer;
  public municipalitieLayer;
  public allElements;
  //public firstLoad: boolean = true;
  private shops;
  public viewEsriMap: boolean = false;
  public ubicationUserLayer;
  private userUbication: object;


  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

  title = 'ng-cli';
  graphicLayer;
  myMap;
  formDetailPage;
  actualURL;

  constructor(
    private zone: NgZone,
    private MapSidebarService: MapSidebarService,
    private router: Router,
    private dataMapServiceService: DataMapServiceService,
    private SidebarService: SidebarMenuService) {

    this.MapSidebarService.formDetailPage$.subscribe(response => {
      this.formDetailPage = response;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe(event => {
        this.actualURL = event['url'];
        // if (this.firstLoad) {
        //   this.firstLoad = false;
        // }
        if (event['url'] !== '/local-product' && event['url'] !== '/local-product/detail') {
          localStorage.removeItem('filterFormLocal');
        }
      });
  }

  initializeMap(layerArrived): Promise<any> {
    const container = this.mapViewEl.nativeElement;
    const LAYERS_MAP = {
      local: 'https://services9.arcgis.com/4RxTGB2fxcbFrzj3/ArcGIS/rest/services/categories_shops/FeatureServer/0',
    };

    const layerToMap = LAYERS_MAP[layerArrived];
    const municipalitieLayerUrl = 'https://services.arcgis.com/hkQNLKNeDVYBjvFE/ArcGIS/rest/services/Municipios/FeatureServer/0';
    this.municipalitieLayer = new FeatureLayer({
      url: municipalitieLayerUrl,
      visible: false
    });

    this.actualLayer = new FeatureLayer({
      url: layerToMap
    });

    this.myMap = new Map({
      basemap: "streets-vector",
      layers: [this.actualLayer]
    });


    this.graphicLayer = new GraphicsLayer({
      listMode: "hide"
    });
    this.myMap.add(this.graphicLayer);



    const view = new MapView({
      container,
      map: this.myMap,
      zoom: 10,
      center: [-17.93, 28.66]
    });

    let locateWidget = new Locate({
      view: view,   // Attaches the Locate button to the view
      useHeadingEnabled: false,
      goToLocationEnabled: false,
      graphic: new Graphic({
        // symbol: { type: "simple-marker" }  // overwrites the default symbol used for the
        // graphic placed at the location of the user when found
      })
    });

    view.ui.add(locateWidget, "top-left");

    // locateWidget.on("locate", function (locateEvent) {
    //   console.log('no button');
    //   const userUbication = { latitude: locateEvent.position.coords.latitude, longitude: locateEvent.position.coords.longitude };
    //   sessionStorage.setItem('userUbication', JSON.stringify(userUbication));
    // });

    view.when(function () {
      locateWidget.locate().then(function (pos) {
        const userUbication = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        sessionStorage.setItem('userUbication', JSON.stringify(userUbication));
      });
    });


    this.MapSidebarService.requiredUserLocation$.subscribe(data => {
      locateWidget.locate().then(function (pos) {
        const userUbication = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        sessionStorage.setItem('userUbication', JSON.stringify(userUbication));
        sessionStorage.setItem('sort', 'location');
      });
      setTimeout(() => {
        this.MapSidebarService.startIsLoadingLogo('');
        this.MapSidebarService.orderDataByLocation('');
      }, 1000);
    });

    this.view = view;
    return this.view.when();
  }

  ngOnInit(): void {
    const LAYERS_MAP = {
      local: 'https://services9.arcgis.com/4RxTGB2fxcbFrzj3/ArcGIS/rest/services/categories_shops/FeatureServer/0'
    };

    //DELETE OBSERVABLE
    // this.SidebarService.sidebarView$.subscribe(data => {
    //   this.changeLayer(data);
    // });

    config.assetsPath = 'assets/';
    const layer = 'local';  //local layer by default but we need change this and do dinamically

    this.zone.runOutsideAngular(() => {

      this.initializeMap(layer).then(() => {
        this.zone.run(() => {
        });
      });
    });

    this.MapSidebarService.changeLayerOnMap$.subscribe(data => {
      this.view.graphics.removeAll();
    });

    this.initDataMap();
    this.filterLocalProductByCategorieOrTerm();
    // this.filterLocalProductLayerByLocation();
    this.orderByLocation();
    this.zoomToFeature();
  }

  initDataMap(): void {
    const localProductLayer = new FeatureLayer({
      url: 'https://services9.arcgis.com/4RxTGB2fxcbFrzj3/ArcGIS/rest/services/alojamientos_turisticos_shp/FeatureServer/0'
    });
    const queryLocal = localProductLayer.createQuery();
    localProductLayer.queryFeatures(queryLocal)
      .then((response) => {
        const features = response.features;
        //const dataMap = features.map((feature) => feature.attributes);
        this.shops = features;
        this.MapSidebarService.sendDataFromMap(features);
      });
  }


  filterLocalProductByCategorieOrTerm() {
    //LOCAL PRODUCT LAYER FILTER BY CATEGORIE
    debugger;
    this.MapSidebarService.filtersToMapChanges$.subscribe(data => {
      this.view.graphics.removeAll();
      const layerUrl = this.myMap.layers.items[0].url;
      if (data.length > 0) {
        this.graphicLayer.graphics.removeAll();
        this.view.zoom = 10;
        this.view.center = [-17.93, 28.66];
        //definitionExpression
        if (data[0] === 'All') {
          this.actualLayer.definitionExpression = "1=1";
        } else {
          this.actualLayer.definitionExpression = "MODALIDAD" + "=" + "'" + data[0] + "'";
        }
        //query shops
        let query = this.actualLayer.createQuery();
        if (data[0] === 'All' || (data[2])) {
          query.where = "1=1"
        }
        else {
          query.where = "MODALIDAD" + "=" + "'" + data[0] + "'";
        }
        this.actualLayer.queryFeatures(query)
          .then((response) => {
            //BY TERM 
            if (data[2]) {
              this.actualLayer.visible = false;
              const allFeatures = response.features;
              const filteredShops = allFeatures.filter(item => item.attributes.Categories.includes(data[0]));
              const fields = response.fields;
              this.layerByLocation = new FeatureLayer({
                fields,
                objectIdField: "ObjectID",
                geometryType: "point",
                spatialReference: { wkid: 4326 },
                source: filteredShops,
                //popupTemplate: pTemplate,
                //renderer: uvRenderer 
              });
              this.myMap.removeAll();
              this.myMap.add(this.layerByLocation);
              this.layerByLocation.visible = true;
              this.shops = filteredShops;
              setTimeout(() => {
                this.MapSidebarService.sendDataFromMap(filteredShops);
              }, 2000);
            } else {
              if (this.layerByLocation) {
                this.layerByLocation.visible = false;
              }
              this.myMap.add(this.actualLayer);
              this.actualLayer.visible = true;
              const features = response.features;
              this.shops = features;
              const sortBy = sessionStorage.getItem('sort');
              if (!sortBy || sortBy === 'alpha') {
                this.MapSidebarService.sendDataFromMap(features);
              }
            }
          });
      }
    });
  }

  orderByLocation(): void {
    // https://www.npmjs.com/package/@arcgis/webpack-plugin

    //webpack-plugin

    this.MapSidebarService.orderByLocationChanges$.subscribe(async data => {
      const userLatLon = JSON.parse(sessionStorage.getItem('userUbication'));

      if (userLatLon) {
        const geometrySrv = geometryService;
        const url = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer';

        const newShopping = this.shops.map(shop => {
          const myPromise = new Promise((resolve, reject) => {
            // setTimeout(() => {
            // const testPointUserInTazacorte: Point = new Point({
            //   latitude: 28.65194343028121,
            //   longitude: -17.94569064538474
            // });

            const testPointUserInTazacorte: Point = new Point({
              latitude: 28.65194343028121,
              longitude: -17.94569064538474
            });

            //const testPointUserInTazacorte: Point = new Point(userLatLon);

            if (!this.ubicationUserLayer) {
              const graphicUbication = new Graphic({  // graphic with line geometry
                geometry: testPointUserInTazacorte, // set geometry here
                // symbol: new SimpleLineSymbol({...}) // set symbol here
              });
              const fields = [];
              this.ubicationUserLayer = new FeatureLayer({
                fields,
                objectIdField: "ObjectID",
                geometryType: "point",
                spatialReference: { wkid: 4326 },
                source: [graphicUbication],
                //popupTemplate: pTemplate,
                //renderer: uvRenderer 
              });
              this.myMap.add(this.ubicationUserLayer);
            }

            const distParams = new DistanceParameters();
            //distParams.geometry1 = locationUserPoint;
            distParams.geometry1 = testPointUserInTazacorte;
            distParams.distanceUnit = 'kilometers';
            distParams.geodesic = true;
            let shopUbication = new Point({
              latitude: shop.geometry.latitude,
              longitude: shop.geometry.longitude
            });
            distParams.geometry2 = shopUbication;
            resolve(geometrySrv.distance(url, distParams));
            // }, 1000);
          });
          myPromise.then((value: number) => {
            shop.attributes['distance'] = value.toFixed(2);
          });
          return shop;
        });
        //TO CONTROL THE PROBLEM WITH ASYNC DATA DISTANCE ************
        setTimeout(() => {
          this.MapSidebarService.sendDataFromMap(newShopping);
        }, 2000);
      }
      else {
        alert('You need allow the user ubication');
      }
    });
  }


  zoomToFeature(): void {
    this.MapSidebarService.idItemToMap$.subscribe(data => {
      const layerUrl = this.myMap.layers.items[0].url;
      const query = this.actualLayer.createQuery();
      query.where = "id = '" + data + "'";
      this.actualLayer.queryFeatures(query)
        .then((response) => {
          const features = response.features[0];
          const Sym = new SimpleMarkerSymbol({
            // type: "simple-marker",
            color: "blue",
            size: 8,
            outline: {
              width: 0.5,
              color: "darkblue"
            }
          });
          features.symbol = Sym;
          const graphs = this.view.graphics.items;
          const graphicsToDelete = graphs.filter(graph => graph.symbol?.size !== 12);
          graphicsToDelete.forEach(item => {
            this.view.graphics.remove(item);
          });
          //this.view.graphics.removeAll();
          this.view.graphics.add(features);
          this.view.goTo({
            target: features,
            zoom: 14
          });
        });
    });
  }


  ngOnDestroy(): void {
    if (this.view) {
      this.view.destroy();
    }
  }
}
