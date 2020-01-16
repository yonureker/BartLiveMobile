import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import stationDetails from "../stationDetails";
import StationCallout from "./stationCallout";
import stationLogo from "../assets/station.png";

const MapScreen = props => {
  const renderStationData = () => {
    return props.stationList.map((station, index) => {
      return (
        <MapView.Marker
          key={index}
          coordinate={{
            // receives station latitude and longitude from stationDetails.js
            latitude: parseFloat(stationDetails[station.abbr].gtfs_latitude),
            longitude: parseFloat(stationDetails[station.abbr].gtfs_longitude)
          }}
          image={stationLogo}
          zIndex={100}
          tracksInfoWindowChanges={true}
        >
          <MapView.Callout
            key={index}
            tooltip={true}
            style={{ backgroundColor: "#ffffff" }}
          >
            <View style={styles.calloutContainer}>
              <Text style={{ fontWeight: "bold" }}>{station.name}</Text>
            </View>
            <View
              style={{
                marginTop: 5,
                marginLeft: 5,
                marginRight: 5,
                marginBottom: 8
              }}
            >
              <StationCallout key={index} station={props.stationList[index]} />
            </View>
          </MapView.Callout>
        </MapView.Marker>
      );
    });
  };

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <MapView
        style={styles.mapContainer}
        // initial MapView is centered on either user location or [37.792874, -122.39703]
        initialRegion={{
          latitude: parseFloat(props.location.coords.latitude) || 37.792874,
          longitude: parseFloat(props.location.coords.longitude) || -122.39703,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        }}
        provider={"google"}
      >
        {renderStationData()}
      </MapView>
      <View style={styles.updateTimeContainer}>
        <Text style={styles.updateTimeText}>
          Last update at {props.lastUpdate}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 19
  },
  updateTimeContainer: {
    flex: 1,
    backgroundColor: "#0099CC",
    justifyContent: "center",
    alignContent: "center"
  },
  updateTimeText: {
    fontSize: 15,
    color: "white",
    alignSelf: "center"
  },
  calloutContainer: {
    marginHorizontal: 5,
    marginTop: 2,
    borderBottomWidth: "1px",
    borderBottomColor: "#c4c1b9"
  }
});

export default MapScreen;