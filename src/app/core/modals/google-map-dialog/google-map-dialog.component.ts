import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-google-map-dialog',
  templateUrl: './google-map-dialog.component.html',
  styleUrls: ['./google-map-dialog.component.css'],
})
export class GoogleMapDialogComponent implements OnInit {
  travelModel: string = 'DRIVING';
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom: 14,
  };
  marker1 = { position: { lat: 38.9987208, lng: -77.2538699 } };
  marker2 = { position: { lat: 39.7, lng: -76.0 } };
  marker3 = { position: { lat: 37.9, lng: -76.8 } };
  markers = [this.marker1, this.marker2, this.marker3];

  @ViewChild(GoogleMap) map: GoogleMap;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<GoogleMapDialogComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close(true);
  }

  ngOnInit(): void {
    //https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-coordinateFormatter.html#fromUtm
  }

  getBounds(markers): any {
    let north;
    let south;
    let east;
    let west;

    for (const marker of markers) {
      // set the coordinates to marker's lat and lng on the first run.
      // if the coordinates exist, get max or min depends on the coordinates.
      north =
        north !== undefined
          ? Math.max(north, marker.position.lat)
          : marker.position.lat;
      south =
        south !== undefined
          ? Math.min(south, marker.position.lat)
          : marker.position.lat;
      east =
        east !== undefined
          ? Math.max(east, marker.position.lng)
          : marker.position.lng;
      west =
        west !== undefined
          ? Math.min(west, marker.position.lng)
          : marker.position.lng;
    }

    const bounds = { north, south, east, west };

    return bounds;
  }

  private calculateRoute(): void {
    console.log('dataKeyy', this.data.dataKey);
    this.directionsService.route(
      {
        //origin: { lat: this.data.dataKey.latitude, lng: this.data.dataKey.longitude },
        origin: { lat: 28.637702659757593, lng: -17.895406657412668 },
        destination: {
          lat: this.data.shop.latitude,
          lng: this.data.shop.longitude,
        },
        travelMode: google.maps.TravelMode[this.travelModel],
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsDisplay.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      }
    );
    const indicatorsEle: HTMLElement = document.getElementById('indicators');
    this.directionsDisplay.setPanel(indicatorsEle);
  }

  travelModeChange(e): void {
    this.travelModel = e.value;
    this.calculateRoute();
  }

  ngAfterViewInit(): void {
    const bounds = this.getBounds(this.markers);
    this.map.googleMap.fitBounds(bounds);
    this.directionsDisplay.setMap(this.map.googleMap);
    this.calculateRoute();
  }
}
