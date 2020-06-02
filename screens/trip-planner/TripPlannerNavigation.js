import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { useColorScheme } from "react-native-appearance";
import TripPlannerHomeScreen from "./TripPlannerHomeScreen";

const Stack = createStackNavigator();

export default function TripPlannerNavigator(props) {
  const scheme = useColorScheme();
  const {
    stations: { station },
  } = require("../../stations");

  return (
    <Stack.Navigator
      initialRouteName="TripPlanner Home"
      screenOptions={{
        gestureEnabled: false,
        headerTitleStyle: { fontSize: 18 },
      }}
    >
      <Stack.Screen
        name="TripPlanner Home"
        component={TripPlannerHomeScreen}
        options={{ title: "Trip Planner" }}
      />
    </Stack.Navigator>
  );
}