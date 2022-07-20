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
  const [selected, selectCard] = useState(null)
  const [deckTops, setTops] = useState([{color: 'empty', number: 'empty'}, {color: 'empty', number: 'empty'}])
  /*tops returned as list of 2 cards*/
  socket.on('tops-change', function tops (res) {
    setTops([res[0], res[1]])
  })

  socket.on('reset', function reset (res) {
    changeDeck(res)
  })
  socket.on('response', function respond (res) {
    changeMessage(res)
  })

  socket.on('card-res', function card (res) {
    console.log(res)
  })

  function placeCard (elements) {
    socket.emit('place', (elements))
  }

  function handleDraw () {
    if (deck.length === 0 || hand.length === 4) {
      return
    }
    var hand_copy = hand
    var deck_copy = deck
    const card = deck_copy[deck_copy.length -1 ]
    const element = {
                      key: card[2],
                      idx: hand_copy.length,
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
      <Text>{selected}</Text>
      <Button onPress = {() => {socket.emit('reset')}} title='test reset'/>
      <Button 
      onPress = {() => {handleDraw()}}
      title = 'draw'
      />
      <Card 
      color = {deckTops[0]['color']} 
      number = {deckTops[0]['number']}
      onPress = {
        () => { if (selected !== null) {
                placeCard([hand[selected], deckTops[1]]);
                }    
                else {
                  return
                }   
                for (var i = selected + 1; i < hand.length; i ++) {
                  hand[i]['idx'] -= 1
                }
                hand.splice(selected, 1);
                selectCard(null)
              }
      }/>
      <View>
        <FlatList 
        data = {hand}
        horizontal = {true}
        renderItem = {function ({ item }) { return (
          <Card 
            color = {item['color']} 
            number = {item['number']} 
            onPress = {() => (selectCard(item['idx']))}/> 
        )}}
        />
      </View>
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
