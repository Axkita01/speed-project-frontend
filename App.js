import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Card from './components/Card';
import {useState} from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { io } from 'socket.io-client'

const socket = io ('http://localhost:5000')


export default function App() {
  const [deck, changeDeck] = useState('')
  const [hand, updateHand] = useState([])


  socket.on('reset', function reset (res) {
    changeDeck(res)

    
  })
  socket.on('response', function respond (res) {
    changeMessage(res)
  })

  socket.on('card-res', function card (res) {
    console.log(res)
  })

  function handleDraw () {
    if (deck.length === 0) {
      return
    }
    var hand_copy = hand
    var deck_copy = deck
    const card = deck_copy[deck_copy.length -1 ]
    console.log(card)
    const element = {
                      key: card[2],
                      color: card[1],
                      number: card[0]
                    }
    deck_copy = deck_copy.slice(0, -1)
    hand_copy.push(element)
    updateHand(hand_copy)
    changeDeck(deck_copy)
  }
  
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button onPress = {() => {socket.emit('push')}}>
        Push Me!
      </Button>
      <Card color = 'red' number = '9' socket = {socket}></Card>
      <Button onPress = {() => {socket.emit('reset')}} title='test reset'/>
      <Button 
      onPress = {() => {handleDraw()}}
      title = 'draw'
      />
      <FlatList 
      data = {hand}
      renderItem = {function ({ item }) { return (
         <Card color = {item['color']} number = {item['number']} socket = {socket}/> 
      )}}
      />
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
