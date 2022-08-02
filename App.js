import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Game from "./Game.js";
import {View, StyleSheet, ScrollView} from 'react-native-web'
import Rules from "./Rules.js";
import Ready from "./Ready.js";

const Stack = createNativeStackNavigator();
/* Make side decks disappear when they run out, make game not reset
before restart screen so that displays winning string correctly, make restart screen not
biggy when opponent is not connected, fix image border radius,  */
export default function App(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={Rules}
          options={{ title: "Rules", 
                     headerBackground: () => {
                        return  (<View 
                                style = {{
                                    height: '65px',
                                    width: '100%', 
                                    background: '#56C7FF',
                                    color: 'white',
                                    borderStyle: 'solid',
                                    borderWidth: '.1vh'
                                    }}>
                                </View>)
                    },
                      headerTintColor: 'white',
                    }}
        />
        <Stack.Screen 
        name="game" 
        component={Game}
        options = {{ 
        title: "Play Game", 
        headerBackground: () => {
           return  (<View 
                   style = {{
                       height: '65px',
                       width: '100%', 
                       background: '#56C7FF',
                       color: 'white',
                       borderStyle: 'solid',
                       borderWidth: '.1vh'
                       }}>
                   </View>)
       },
         headerTintColor: 'white'
       }}
        />
        <Stack.Screen name="ready" component={Ready} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
