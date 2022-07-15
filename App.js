import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Card from './components/Card';
import {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { io } from 'socket.io-client'

const socket = io ('http://localhost:5000')


export default function App() {
  const [message, changeMessage] = useState('')
  const [deck, changeDeck] = useState('')

  socket.on('reset', function reset (res) {

    changeDeck(res)
    console.log(deck)
  })
  socket.on('response', function respond (res) {
    changeMessage(res)
  })

  socket.on('card-res', function card (res) {
    console.log(res)
  })
  
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <button onClick = {() => {socket.emit('push')}}>
        Push Me!
      </button>
      <Card color = 'red' number = '9' socket = {socket}></Card>
      <button onClick = {() => {socket.emit('reset')}}>
        test reset
      </button>
      {message}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
