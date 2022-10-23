import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MapSidebarService } from 'src/app/services/map-sidebar/map-sidebar.service';



@Injectable({
  providedIn: 'root'
})
export class DataMapServiceService {

 // private dataToLocalProductLayer = new BehaviorSubject<string[]>([]);
  //dataToLocalProductLayer$ = this.dataToLocalProductLayer.asObservable();

  //private dataToWalkingTrailsLayer = new BehaviorSubject<string[]>([]);
  //dataToWalkingTrailsLayer$ = this.dataToWalkingTrailsLayer.asObservable();

  //formDetailPage;
  //dataToComponent;
  //isFirstLoad: boolean = true;

  //constructor(
    //private MapSidebarService: MapSidebarService,
    //private router: Router) {

    //this.MapSidebarService.formDetailPage$.subscribe(response => {
      //this.formDetailPage = response;
    //});

    //if (this.isFirstLoad) {
      //this.localPageLoad();
    //}

    //this.router.events.pipe(
      //filter(event => event instanceof NavigationEnd)
    //)
      //.subscribe(event => {
        //if (event['url'] === '/local-product' && this.formDetailPage === false) {
          //this.localPageLoad();
          //this.isFirstLoad = false;
        //} else if (event['url'] === '/walking-trails' && this.formDetailPage === false) {
          //const walkingTrailsLayer = new FeatureLayer({
            //url: "https://services.arcgis.com/hkQNLKNeDVYBjvFE/arcgis/rest/services/senderos/FeatureServer/2"
          //});
          //const queryWalking = walkingTrailsLayer.createQuery();
          //walkingTrailsLayer.queryFeatures(queryWalking)
            //.then((response) => {
              //const features = response.features;
              //const attributes = features.map((feature) => feature.attributes);
              //this.dataToComponent = attributes;
              //this.dataToWalkingTrailsLayer.next(this.dataToComponent);
            //});

        //}
        //else {

        //}

      //});
  //}

  //localPageLoad() {
    //const localProductLayer = new FeatureLayer({
      //url: "https://services9.arcgis.com/4RxTGB2fxcbFrzj3/ArcGIS/rest/services/alojamientos_turisticos_shp/FeatureServer/0"
    //});
    //const queryLocal = localProductLayer.createQuery();
    //localProductLayer.queryFeatures(queryLocal)
      //.then((response) => {
        //const features = response.features;
        //const attributes = features.map((feature) => feature.attributes);
        //this.dataToComponent = attributes;
        //this.dataToLocalProductLayer.next(this.dataToComponent);
      //});
  //}

  //sendInfoByLocation(data) {
    //this.dataToLocalProductLayer.next(data);
  //}

}














