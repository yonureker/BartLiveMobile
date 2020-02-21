import React, { useEffect } from "react";
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  Platform
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createAppContainer } from "react-navigation";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "react-navigation-tabs";
import * as firebase from "firebase";

import LiveMapScreen from "./screens/LiveMapScreen";
import ListScreen from "./screens/station-schedules/ListScreen";
import SystemScreen from "./screens/system-map/SystemScreen";
import AboutScreen from "./screens/AboutScreen";
import { firebaseConfig } from "./config/firebaseConfig";

require("firebase/firestore");

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

export default function AppContainer() {
  const dispatch = useDispatch();
  const userLocation = useSelector(state => state.userLocation);

  useEffect(() => {
    getLocation();
  }, []);

  

  const getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      dispatch({
        type: "RECEIVE_USER_LOCATION",
        payload: { coords: { latitude: 37.792874, longitude: -122.39703 } }
      });
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy:
        Platform.OS === "android"
          ? Location.Accuracy.Low
          : Location.Accuracy.Lowest
    });

    dispatch({
      type: "RECEIVE_USER_LOCATION",
      payload: location
    });

    db.collection("users")
      .add({
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        timestamp: {
          created: firebase.firestore.Timestamp.fromDate(new Date())
        }
      })
  };

  if (
    userLocation.coords.latitude !== null &&
    userLocation.coords.latitude !== undefined
  ) {
    return <AppWrapper />;
  } else {
    return (
      <View>
        <ImageBackground
          source={require("./assets/loading.png")}
          style={{ width: "100%", height: "100%" }}
        ></ImageBackground>
      </View>
    );
  }
}

// Bottom Tab Navigator Setup
const TabNavigator = createBottomTabNavigator(
  {
    "Station List": {
      screen: ListScreen,
      navigationOptions: {
        tabBarIcon: () => (
          <Ionicons
            name="md-list"
            size={32}
            color="black"
            style={styles.tabIcon}
          />
        )
      }
    },
    "Live Map": {
      screen: LiveMapScreen,
      navigationOptions: {
        tabBarIcon: () => (
          <MaterialCommunityIcons
            name="google-maps"
            size={32}
            color="black"
            style={styles.tabIcon}
          />
        )
      }
    },
    "System Map": {
      screen: SystemScreen,
      navigationOptions: {
        tabBarIcon: () => (
          <Ionicons
            name="ios-map"
            size={32}
            color="black"
            style={styles.tabIcon}
          />
        )
      }
    },
    About: {
      screen: AboutScreen,
      navigationOptions: {
        tabBarIcon: () => (
          <Ionicons
            name="ios-information-circle"
            size={32}
            color="black"
            style={styles.tabIcon}
          />
        )
      }
    }
  },
  {
    initialRouteName: "Station List"
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageBackground: {
    width: "100%",
    height: "100%"
  },
  tabIcon: {
    marginTop: 3
  }
});

const AppWrapper = createAppContainer(TabNavigator);