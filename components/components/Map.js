import React, { Component } from 'react'

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import cafe from "../../assets/images/cafe.png";
import firebase from "firebase";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    FlatList,
    Modal,
    TouchableHighlight,
    Alert
} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Toast } from 'native-base';




export default class Map extends Component {
    state = {
        location: null,
        errorMessage: null,
        data: [],
        modalVisible: false,
        selectedLocation: []
    };


    // Initialize Firebase


    async componentWillMount() {
        const firebaseConfig = {
            apiKey: "AIzaSyATqXCOMSRsgOBenYcmLHXJj7OKycFPtjk",
            authDomain: "openspot-7313a.firebaseapp.com",
            databaseURL: "https://openspot-7313a.firebaseio.com",
            projectId: "openspot-7313a",
            storageBucket: "",
            messagingSenderId: "436513055290",
            appId: "1:436513055290:web:c7fa3b1300b10932dc4b03"
        };
        firebase.initializeApp(firebaseConfig);

        firebase.database().ref('locations').once('value', (snapshot) => {



        })
        firebase.database().ref('locations').on('value', (snapshot) => {


            var items = [];
            snapshot.forEach((child) => {
                var r = []
                var rCount = 0



                firebase.database().ref('locations/' + child.key).once('value', async (snapshot) => {

                    firebase.database().ref('locations/' + child.key + '/rooms').once('value', async (rooms) => {

                        for (var room in rooms.val()) {
                            let count = rooms.val()[room]
                            let roomInfo = {
                                roomName: room,
                                count
                            }
                            rCount += count

                            r.push(roomInfo)
                        }

                    })


                    items.push({
                        address: snapshot.key,
                        name: snapshot.val().name,
                        rooms: r,
                        count: rCount,
                        image: snapshot.val().image

                    })
                })


            })
            this.setState((state) => ({
                ...state,
                data: items
            }));




        })
        let t = 0

        // setInterval(() => {
        //     t += 1
        //     firebase.database().ref('locations/' + t + ' st George').set({
        //         name: 'Starbucks ' + t,
        //         rooms: {
        //             "100": 50,
        //             "101": 2,
        //             "44": 3
        //         }
        //     }).then(() => {
        //         console.log("inserted")
        //     }).catch(err => {
        //         console.log(err)
        //     })
        // }, 5000);






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

    };

    subscribeToLocation = async () => {
        console.log("subscribing to location")
        Location.watchPositionAsync({}, (location) => {
            console.log("updated location")
            this.setState({ location });
        })
    }

    geocode = async (address) => {
        const location = await Location.geocodeAsync(address)
        return location
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }


    render() {
        const location = this.state.location;

        let map;
        let openSpotsNearMeText;

        let markers;

        const data = this.state.data;



        if (location) {
            openSpotsNearMeText = (
                <Text>Open spots near me ({location.coords.latitude},{location.coords.longitude})</Text>
            )
        }

        if (location) {
            map = (
                <View style={{ flex: 2 }}>



                    <MapView
                        initialRegion={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                
                        style={{ flex: 1 }}

                    >

                        {/* {this.state.data.map(item => 
                    
                            (
                                <Marker
                                    coordinate={{ latitude: testLat, longitude: -79.88302 }}
                                    title={item.name}
                                    description={item.address}
                                />
                            ))
                        } */}

                        <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} title={'You'} description={'Human being'}>
                        </Marker>
                        <Marker coordinate={{ latitude: 43.6571306, longitude: -79.388302 }} title={'Starbucks'} description={'555 University Ave, Toronto, ON M5G 1X8'} pinColor={'blue'}></Marker>
                        <Marker coordinate={{ latitude: 43.658474, longitude: -79.385582 }} title={'Jimmys Coffee'} description={'84 Gerrard St W, Toronto, ON M5G 1Z4'} pinColor={'blue'}>
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
                <View>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                            }}>
                            <View style={{ marginTop: 100, marginLeft: 30, marginRight:30}}>
                            
                                    {this.state.selectedLocation.map(room => (
                                        <Card>
                                            <CardItem>
                                                <Body>
                                                    <Text>
                                                        Room id: {room.roomName}
                                                    </Text>
                                                    <Text>
                                                        Open seats: {room.count}
                                                    </Text>
                                                </Body>
                                            </CardItem>
                                        </Card>
                                    ))}


                                <Button
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    }} style={{marginTop:10}}>
                                    <Text>Close</Text>
                                </Button>
                            </View>
                        </Modal>


                    </View>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}>
                    <Text note style={{ marginBottom: 10 }}>Scanning vacant seats in cafes and libraries near me</Text>
              
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) => (
                            
                                item.count > 0 &&
                                (
                                    <TouchableOpacity onPress={() => {

                                        this.setModalVisible(true)
                                        this.setState({
        
                                            selectedLocation: item.rooms
                                        })
                                    }} hidden>
        
        
                                        <Card>
                                            <CardItem>
                                                <Left>
                                                    <Thumbnail source={{ uri: `${item.image}` }} />
                                                    <Body>
                                                        <Text>{item.name}</Text>
                                                        <Text note>{item.address}</Text>
                                                    </Body>
                                                </Left>
                                            </CardItem>
        
                                            <CardItem>
                                                <Left>
                                                    <Button transparent>
                                                        <Icon active name="thumbs-up" />
                                                        <Text>12 Likes</Text>
                                                    </Button>
                                                </Left>
                                                <Body>
                                                    <Button transparent>
                                                        <Icon active name="chatbubbles" />
                                                        <Text>4 Comments</Text>
                                                    </Button>
                                                </Body>
                                                <Right>
        
                                                    <Text style={{ color: 'green' }}>
        
                                                        {item.count} open spots left
                                            {/* <Icon name='person' /> */}
                                                    </Text>
                                                </Right>
                                            </CardItem>
                                        </Card>
                                    </TouchableOpacity>
                                )

                            
                           
                        )
                        }
                    />


                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    contentContainer: {
        padding: 10,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
    },
    navigationFilename: {
        marginTop: 5,
    },
    helpContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
});
