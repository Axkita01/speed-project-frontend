import * as React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Game from "./Game.js";
import {View} from 'react-native-web'
import Rules from "./Rules.js";
import Home from "./Home.js";

const Stack = createNativeStackNavigator();
export default function App(props) {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#555555'
    },
  };

  return (
    <NavigationContainer theme = {theme}>
      <Stack.Navigator>
        <Stack.Screen
        name="home"
        component={Home}
        options={{ title: "Home", 
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
                  }}/>
        <Stack.Screen
          name="rules"
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
