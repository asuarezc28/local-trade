import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { SidebarMenuService } from './services/sidebar-menu-service/sidebar-menu.service';
import { HomeComponent } from './+modules/home/components/home/home.component';
import { DataMapServiceService } from './services/data-map-service/data-map-service.service';
import { MapSidebarService } from 'src/app/services/map-sidebar/map-sidebar.service';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    NgbModule,
    //NoopAnimationsModule,
    SharedModule,
    AppRoutingModule,
    GoogleMapsModule
  ],
  providers: [SidebarMenuService, DataMapServiceService, MapSidebarService],
  exports: [],
  bootstrap: [AppComponent]
})

export class AppModule {

};