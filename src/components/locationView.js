import React from "react"
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class LocationView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentLatitude: null,
      currentLongitude: null,
      showInfoWindow: false,
      activeMarker: null,
      destination: null,
      searchMarkers: [], 
      category: props.category
    }

    let setCurrentPosition = (lat, long) => {
      this.setState({currentLatitude: lat,currentLongitude: long })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        setCurrentPosition(position.coords.latitude, position.coords.longitude)
      })
    }
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      activeMarker: marker,
      showInfoWindow: true,
      destination: marker.title
    })
  }

  onMapClick = (props) => {
    if (this.state.showInfoWindow) {
      this.setState({
        showInfoWindow: false,
        activeMarker: null
      })
    }
  }

  renderDestinationMarket(){
    const {latitude, longitude} = this.props
    return <Marker
              title={'Destination'}
              name={'destination'}
              position={{lat: latitude, lng: longitude}}
              onClick ={this.onMarkerClick} />
  }

  renderCurrentLocationMarker(){
    const {currentLatitude, currentLongitude} = this.state
    const marker = <Marker
                    title={'Current Location'}
                    name={'current'}
                    position={{lat: currentLatitude, lng: currentLongitude}}
                    onClick ={this.onMarkerClick} />
    return marker
  }

  fetchPlaces = (mapProps, map) => {
    const {latitude, longitude} = this.props
    const {category} = this.state
    if(category == "") return null

    const {google} = mapProps;
    let destination = new google.maps.LatLng(latitude,longitude)
    var type
    switch (category) {
      case "Food":
        type = "restaurant"
        break
      case "Cafes":
        type = "cafe"
        break
      case "Car Repair": 
        type = "car_repair"
        break
      case "Parking":
        type = "parking"
        break
      case "Gas Station":
        type = "gas_station"
        break
    }

    var request = {
      location: destination,
      radius: '50',
      type: [type]
    };
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          let location = place.geometry.location;
          this.addToSearchMarkers(<Marker
              key={`result-${i}`}
              title={place.name}
              name={`result-${i}`}
              position={{lat: location.lat(), lng: location.lng()}}
              onClick ={this.onMarkerClick} />)
        }
      }
    })
  }

  addToSearchMarkers = (marker) => {
    this.setState({searchMarkers: [...this.state.searchMarkers, marker]})
  }

  render(){
    const {google, latitude, longitude} = this.props
    const {activeMarker, showInfoWindow, destination, searchMarkers} = this.state
    return (
    <Map 
      google={google} 
      zoom={8} 
      style={{width: '100%', height: '100%', position: 'relative'}}
      className="location-map"
      initialCenter={{
        lat: latitude,
        lng: longitude
      }}
      onClick={this.onMapClick}
      onReady={this.fetchPlaces}
      >
      {this.renderDestinationMarket()}
      {this.renderCurrentLocationMarker()}
      {
        searchMarkers.map(function(marker){
          return marker
        })
      }
      <InfoWindow
          marker={activeMarker}
          visible={showInfoWindow}>
            <div>
              <h1>{destination}</h1>
            </div>
        </InfoWindow>
    </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo")
})(LocationView)