import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;
  title = 'dashboard-app';
  map: google.maps.Map;
  lat = 0;
  lng = 0;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 2
  };
public markers;


  constructor(public httpClient: HttpClient){
  }
  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement,
      this.mapOptions);
    this.getGlobalData();

  }
  ngAfterViewInit() {
    this.mapInitializer();
  }
  loadAllMarkers() {
    const finalData = [];
    let  updatedFormatted;
    this.markers.forEach(marker => {
      let casesString;
      let colorShade = '9900FF';
      if ( marker.cases > 1000 && marker.cases < 10000) {
        colorShade = '9900FF';
      } else if (marker.cases > 10000){
        colorShade = 'FF0000';
      } else if (marker.cases <= 1000){
        colorShade = '009933';
      }
      if ( marker.cases > 1000 ) {
         casesString = `${marker.cases.toString().slice(0, -3)}k+`;
      } else {
         casesString = marker.cases;
      }

      if ( marker.updated ) {
        updatedFormatted = new Date(marker.updated).toLocaleString();
      }
     const data = {
        position: new google.maps.LatLng(marker['countryInfo'].lat, marker['countryInfo'].long),
          map: this.map,
        title: marker.country,
        icon: 'http://chart.apis.google.com/chart?chst=d_map_spin&chld=0.8|0|'  + colorShade+'|12|_|'+casesString,
       confirmed: marker.cases,
       deaths: marker.deaths,
       recovered: marker.recovered,
       lastUpdate: updatedFormatted ? updatedFormatted : 'NA'
      };
     finalData.push(data);
    });
    const infoWindow = new google.maps.InfoWindow();
    finalData.forEach(markerInfo => {
      const contentString = '<div><h4>'+markerInfo.title+'<h4></div>\n' +
        '<div><h5>Confirmed: '+markerInfo.confirmed+'<h5></div>\n' +
        '<div><h5>Deaths: '+markerInfo.deaths+'<h5></div>\n' +
        '<div><h5>Recovered: '+markerInfo.recovered+'<h5></div>\n' +
        '<div><h5>Last Update: '+markerInfo.lastUpdate+'<h5></div>'

      const marker = new google.maps.Marker({
        ...markerInfo
      });

      marker.addListener('click', () => {

        infoWindow.setContent(contentString);
        infoWindow.open(marker.getMap(), marker);
      });
      marker.setMap(this.map);
    });
  }
  getGlobalData(){
      this.httpClient.get('http://localhost:3000/api/getData').subscribe((res) => {
      //  console.log(' response from API', res);
        this.markers = res;
        this.loadAllMarkers();
      });
  }
}
