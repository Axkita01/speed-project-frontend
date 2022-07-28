import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Game from "./Game.js";
import Rules from "./Rules.js";
import Ready from "./Ready.js";

const Stack = createNativeStackNavigator();

export default function App(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={Rules}
          options={{ title: "Rules" }}
        />
        <Stack.Screen name="game" component={Game} />
        <Stack.Screen name="ready" component={Ready} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
