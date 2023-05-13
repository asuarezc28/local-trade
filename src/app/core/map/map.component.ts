import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  NgZone,
} from '@angular/core';

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import Locate from '@arcgis/core/widgets/Locate';
import Legend from '@arcgis/core/widgets/Legend';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import LayerList from '@arcgis/core/widgets/LayerList';
import Expand from '@arcgis/core/widgets/Expand';
import * as geometryService from '@arcgis/core/rest/geometryService';
import DistanceParameters from '@arcgis/core/rest/support/DistanceParameters';
import config from '@arcgis/core/config.js';
import { MapSidebarService } from 'src/app/services/map-sidebar/map-sidebar.service';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import * as Globals from '../../../app/shared/global';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine.js';
import Draw from '@arcgis/core/views/draw/Draw.js';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy {
  private view: any = null;
  public actualLayer;
  public layerSearchByTerm: FeatureLayer;
  public allElements;
  private shops;
  public viewEsriMap: boolean = false;
  public ubicationUserLayer;
  public centroidePoint: Point;
  public featureInsularLimit: any;

  @ViewChild(Globals.MAPVIEWNODE, { static: true })
  private mapViewEl: ElementRef;
  graphicLayer;
  myMap: Map;
  formDetailPage: boolean;
  actualURL: string;

  constructor(
    private zone: NgZone,
    private MapSidebarService: MapSidebarService,
    private router: Router
  ) {
    this.MapSidebarService.formDetailPage$.subscribe((response) => {
      this.formDetailPage = response;
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.actualURL = event[Globals.URL];
        if (
          event[Globals.URL] !== Globals.LOCALPRODUCTURL &&
          event[Globals.URL] !== '/local-product/detail'
        ) {
          localStorage.removeItem(Globals.FILTERFORMLOCAL);
        }
      });
  }

  initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;

    this.actualLayer = new FeatureLayer({
      url: Globals.SHOPLAYER,
    });

    this.myMap = new Map({
      basemap: Globals.BASEMAPSTREETSVECTOR,
      layers: [this.actualLayer],
    });

    this.graphicLayer = new GraphicsLayer({
      listMode: 'hide',
    });

    this.myMap.add(this.graphicLayer);

    const view = new MapView({
      container,
      map: this.myMap,
      zoom: 10,
      center: [-17.93, 28.66],
    });

    const locateWidget: Locate = new Locate({
      view: view, // Attaches the Locate button to the view
      useHeadingEnabled: false,
      goToLocationEnabled: false,
      graphic: new Graphic({
        // symbol: { type: "simple-marker" }  // overwrites the default symbol used for the
        // graphic placed at the location of the user when found
      }),
    });

    view.ui.add(locateWidget, Globals.TOPLEFT);

    const layerList: LayerList = new LayerList({
      container: document.createElement(Globals.DIV),
      view: view,
    });

    const layerListExpand = new Expand({
      expandIconClass: Globals.ICONLAYERLIST, // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
      expandTooltip: 'Expand LayerList',
      view: view,
      content: layerList,
    });
    view.ui.add(layerListExpand, Globals.TOPLEFT);

    const legend: Legend = new Legend({
      container: document.createElement(Globals.DIV),
      view: view,
    });
    const legendExpand: Expand = new Expand({
      expandIconClass: Globals.ICONLEGEND,
      expandTooltip: 'Expand Legend',
      view: view,
      content: legend,
    });
    view.ui.add(legendExpand, Globals.TOPLEFT);

    const basemapGallery: BasemapGallery = new BasemapGallery({
      container: document.createElement(Globals.DIV),
      view: view,
    });
    const basemapGalleryExpand: Expand = new Expand({
      expandIconClass: Globals.ICONBASEMAP,
      expandTooltip: 'Expand Base Map Gallery',
      view: view,
      content: basemapGallery,
    });
    view.ui.add(basemapGalleryExpand, Globals.TOPLEFT);

    // locateWidget.on("locate", function (locateEvent) {
    //   console.log('no button');
    //   const userUbication = { latitude: locateEvent.position.coords.latitude, longitude: locateEvent.position.coords.longitude };
    //   sessionStorage.setItem(Globals.USERUBICATION, JSON.stringify(userUbication));
    // });

    view.when(function () {
      locateWidget.locate().then(function (pos) {
        const userUbication = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        sessionStorage.setItem(
          Globals.USERUBICATION,
          JSON.stringify(userUbication)
        );
      });
    });

    this.MapSidebarService.requiredUserLocation$.subscribe((data) => {
      locateWidget.locate().then(function (pos) {
        const userUbication = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        sessionStorage.setItem(
          Globals.USERUBICATION,
          JSON.stringify(userUbication)
        );
        sessionStorage.setItem('sort', 'location');
      });
      setTimeout(() => {
        this.MapSidebarService.startIsLoadingLogo(true);
        this.MapSidebarService.orderDataByLocation('');
      }, 1000);
    });

    this.view = view;
    return this.view.when();
  }

  ngOnInit(): void {
    config.assetsPath = 'assets/';
    // const layer = 'local';

    this.zone.runOutsideAngular(() => {
      this.initializeMap().then(() => {
        this.zone.run(() => {});
      });
    });

    this.MapSidebarService.changeLayerOnMap$.subscribe((data) => {
      this.view.graphics.removeAll();
    });

    this.initDataMap();
    this.filterLocalProductByCategorieOrTerm();
    this.orderByLocation();
    this.zoomToFeature();
  }

  initDataMap(): void {
    const localProductLayer = new FeatureLayer({
      url: 'https://services9.arcgis.com/4RxTGB2fxcbFrzj3/ArcGIS/rest/services/alojamientos_turisticos_shp/FeatureServer/0',
    });
    const queryLocal = localProductLayer.createQuery();
    localProductLayer.queryFeatures(queryLocal).then((response) => {
      const features = response.features;
      this.shops = features;
      this.MapSidebarService.sendDataFromMap(features);
    });
  }

  filterLocalProductByCategorieOrTerm(): void {
    this.MapSidebarService.filtersToMapChanges$.subscribe((data) => {
      this.view.graphics.removeAll();
      if (data) {
        this.graphicLayer.graphics.removeAll();
        this.view.zoom = 10;
        this.view.center = [-17.93, 28.66];
        if (data.categorie === 'All') {
          this.actualLayer.definitionExpression = '1=1';
        } else {
          this.actualLayer.definitionExpression =
            'MODALIDAD' + '=' + "'" + data.categorie + "'";
        }
        let query = this.actualLayer.createQuery();
        if (data.categorie === 'All' || data.searchByTerm) {
          query.where = '1=1';
        } else {
          query.where = 'MODALIDAD' + '=' + "'" + data.categorie + "'";
        }
        this.actualLayer.queryFeatures(query).then((response) => {
          if (data.searchByTerm) {
            this.actualLayer.visible = false;
            const allFeatures = response.features;
            // const filteredShops = allFeatures.filter(item => item.attributes.Categories.includes(data.term));
            const filteredShopsSplit = allFeatures.map((item) => {
              item.attributes.Categories =
                item.attributes.Categories.split(', ');
              return item;
            });
            const filteredShopsCategorie = filteredShopsSplit.map((item) => {
              const categorieSearched = item.attributes.Categories.filter(
                (ele) => ele === data.term
              );
              item.attributes.Categories = categorieSearched;
              return item;
            });
            const newShops = filteredShopsCategorie.filter(
              (ele) => ele.attributes.Categories.length === 1
            );

            const fields = response.fields;
            this.layerSearchByTerm = new FeatureLayer({
              fields,
              objectIdField: 'ObjectID',
              geometryType: 'point',
              spatialReference: { wkid: 4326 },
              source: newShops,
              //popupTemplate: pTemplate,
              //renderer: uvRenderer
              title: 'TEST',
            });
            this.myMap.removeAll();
            this.myMap.add(this.layerSearchByTerm);
            this.layerSearchByTerm.visible = true;
            this.shops = newShops;
            setTimeout(() => {
              this.MapSidebarService.sendDataFromMap(newShops);
            }, 2000);
          } else {
            if (this.layerSearchByTerm) {
              this.layerSearchByTerm.visible = false;
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
    this.MapSidebarService.orderByLocationChanges$.subscribe(async (data) => {
      const userLatLon = JSON.parse(
        sessionStorage.getItem(Globals.USERUBICATION)
      );
      if (userLatLon) {
        const graphicsLayer = new GraphicsLayer();

        const centroidePoint = new Point({
          x: -17.8673,
          y: 28.7158,
        });

        const markerSymbol = {
          type: 'simple-marker',
          size: 20,
          color: [226, 119, 40],
          outline: {
            color: [255, 255, 255],
            width: 2,
          },
        };

        const pointGraphic = new Graphic({
          geometry: centroidePoint,
          symbol: markerSymbol,
        });

        graphicsLayer.add(pointGraphic);

        const buffer: any = geometryEngine.geodesicBuffer(
          pointGraphic.geometry,
          30,
          'kilometers'
        );

        const testPointUserInTazacorteToBuffer: Point = new Point({
          latitude: 28.659,
          longitude: -17.9148,
        });

        const intersecting = geometryEngine.intersect(
          testPointUserInTazacorteToBuffer,
          buffer
        );
        console.log('inter FUNCIONANDO', intersecting);

        // let bufferGraphic = new Graphic({
        //   geometry: buffer,
        //   symbol: {
        //     // type: "simple-fill",
        //     color: [227, 139, 79, 0.5],
        //     // outline: {
        //     //   color: [255, 255, 255, 255],
        //     // },
        //   },
        // });

        //graphicsLayer.add(bufferGraphic);

        //https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-geometryEngine.html#intersect

        this.myMap.add(graphicsLayer);

        if (intersecting) {
          console.log('you are in to La Palma');
          const geometrySrv = geometryService;
          const url = Globals.GEOMETRYSERVERURL;
          const newShopping = this.shops.map((shop) => {
            const myPromise = new Promise((resolve, reject) => {
              const testPointUserInTazacorte: Point = new Point({
                latitude: 28.65194343028121,
                longitude: -17.94569064538474,
              });

              //const testPointUserInTazacorte: Point = new Point(userLatLon);

              const markerSymbolUserUbication = {
                type: 'simple-marker',
                size: 20,
                color: [226, 119, 40],
                outline: {
                  color: [255, 255, 255],
                  width: 2,
                },
              };

              if (!this.ubicationUserLayer) {
                const graphicUbication = new Graphic({
                  geometry: testPointUserInTazacorte,
                  symbol: markerSymbolUserUbication,
                });
                //THE BEST OPTION IS CREATE A GRAPHIC TO PRINT THE USER LOCATION
                const fields = [];
                this.ubicationUserLayer = new FeatureLayer({
                  fields,
                  objectIdField: Globals.OBJECTID,
                  geometryType: 'point',
                  spatialReference: this.view.spatialReference, //{ wkid: 4326 },
                  source: [graphicUbication],
                  //popupTemplate: pTemplate,
                  //renderer: uvRenderer
                });

                //this.myMap.add(this.ubicationUserLayer);
              }

              const distParams = new DistanceParameters();
              //distParams.geometry1 = locationUserPoint;
              distParams.geometry1 = testPointUserInTazacorte;
              distParams.distanceUnit = 'kilometers';
              distParams.geodesic = true;
              let shopUbication = new Point({
                latitude: shop.geometry.latitude,
                longitude: shop.geometry.longitude,
              });
              distParams.geometry2 = shopUbication;
              resolve(geometrySrv.distance(url, distParams));
              // }, 1000);
            });
            myPromise.then((value: number) => {
              shop.attributes[Globals.DISTANCE] = value.toFixed(2);
            });
            return shop;
          });
          setTimeout(() => {
            this.MapSidebarService.sendDataFromMap(newShopping);
          }, 2000);
        } else {
          this.MapSidebarService.startIsLoadingLogo(false);
          //DELETE LOADING ICON WHEN THIS WORKS
          alert('YOUR LOCATION IS OUTSIDE OF LA PALMA');
        }
      } else {
        alert('You need allow the user ubication');
      }
    });
  }

  zoomToFeature(): void {
    this.MapSidebarService.idItemToMap$.subscribe((data) => {
      const query = this.actualLayer.createQuery();
      query.where = "id = '" + data + "'";
      this.actualLayer.queryFeatures(query).then((response) => {
        const features = response.features[0];
        const Sym = new SimpleMarkerSymbol({
          // type: "simple-marker",
          color: Globals.BLUE,
          size: 8,
          outline: {
            width: 0.5,
            color: Globals.DARKBLUE,
          },
        });
        features.symbol = Sym;
        const graphs = this.view.graphics.items;
        const graphicsToDelete = graphs.filter(
          (graph) => graph.symbol?.size !== 12
        );
        graphicsToDelete.forEach((item) => {
          this.view.graphics.remove(item);
        });
        //this.view.graphics.removeAll();
        this.view.graphics.add(features);
        this.view.goTo({
          target: features,
          zoom: 14,
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

//DELETEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
//const insularLimit = new FeatureLayer({
//url: 'https://services.arcgis.com/hkQNLKNeDVYBjvFE/arcgis/rest/services/Limite_insular/FeatureServer/0',
//spatialReference: view.spatialReference,
//});
//const queryLocal = insularLimit.createQuery();
//insularLimit.queryFeatures(queryLocal).then((response) => {
//response.features[0].geometry.spatialReference = view.spatialReference;
//console.log(
//'GEOMETRY FROM LAYER LIMIT ISLAND',
//response.features[0].geometry
//);
//this.featureInsularLimit = response.features[0].geometry;
//const tazacortePoint_ = new Point({
//x: -17.9189,
//y: 28.6559,
//spatialReference: view.spatialReference,
//});

//let intersecting = geometryEngine.intersect(
//this.featureInsularLimit,
//tazacortePoint_
//);
//console.log('intersecting POINT LOS LLANOS', intersecting);
//});
//DELETEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
