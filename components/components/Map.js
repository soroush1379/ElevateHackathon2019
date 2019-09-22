import React, { Component } from 'react'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import cafe from "../../assets/images/cafe.png";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';



export default class Map extends Component {
    state = {
        location: null,
        errorMessage: null,
     
    };

    async componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
            this.subscribeToLocation();
        }
        console.log("geocoding")
        const add = await this.geocode('')
        console.log("adsfdsfdsafsdafsd", add)

    }


    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
        console.log(location)
        console.log(location.coords)
    };

    subscribeToLocation = async () => {
        console.log("subscribing to location")
        Location.watchPositionAsync({ distanceInterval: 0, timeInterval: 0 }, (location) => {
            console.log("updated location")
            this.setState({ location });
        })
    }

    geocode = async (address) => {
        const location = await Location.geocodeAsync(address)
        return location
    }


    render() {
        const location = this.state.location;
      
        let map;
        console.log("render function")
        console.log(location)
        console.log("found")

        if (location) {
            map = (
                <View style={{flex:1}}>
                    <View style={{margin:10}}>
                              <Text>Latitude: {location.coords.latitude}</Text>
                    <Text>Longitude: {location.coords.longitude}</Text>
                    </View>
      
              
        
                    <MapView
                        initialRegion={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        region={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
               
                        }}
                        style={{ flex: 1 }}
                  
                    >
                        <Marker coordinate={{latitude: location.coords.latitude, longitude: location.coords.longitude}} title={'You'} description={'Human being'}>
                        </Marker>
                        <Marker coordinate={{latitude: 43.6571306, longitude: -79.388302}} title={'Starbucks'} description={'555 University Ave, Toronto, ON M5G 1X8'} pinColor={'blue'}></Marker>
                        <Marker coordinate={{latitude: 43.658474, longitude: -79.385582}} title={'Jimmys Coffee'} description={'84 Gerrard St W, Toronto, ON M5G 1Z4'} pinColor={'blue'}>
                        </Marker>
                    </MapView>
                </View>
         )
        } else {
            map = <Text>Enable location services to use this map</Text>
        }
        return (
            <View style={{ flex: 1 }}>

                {map}
            </View>
        )
    }
}
