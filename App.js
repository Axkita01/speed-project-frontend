import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import Card from './components/Card';
import {useState, useRef} from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { io } from 'socket.io-client'


export default function App() {
  const [deck, changeDeck] = useState('')
  const [hand, updateHand] = useState([])
  const selected = useRef(null)
  const socket = useRef(null)
  const [deckTops, setTops] = useState([{color: 'empty', number: 'empty'}, {color: 'empty', number: 'empty'}])
  /*tops returned as list of 2 cards*/
  useEffect( function ()  {
    const s = io ('http://localhost:5000');
    socket.current = s
    socket.current.on('tops-change', function tops (res) {
    setTops([res[0], res[1]])
    })

    socket.current.on('reset', function reset (res) {
      changeDeck(res)
    })
    }, [])

    function placeCard (elements) {

      socket.current.emit('place', (elements))
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
  
  console.log(deck)
  return (
    <View style={styles.container}>
      <Button onPress = {() => {socket.current.emit('reset'); updateHand([])}} title='test reset'/>
      <Button 
      onPress = {() => {handleDraw()}}
      title = 'draw'
      />
      {/*Middle Decks*/}
      <View style = {{flexDirection: 'row'}}>
      <Card 
      color = {deckTops[0]['color']} 
      number = {deckTops[0]['number']}
      onPress = {
        () => { if (selected.current !== null && 
                    (hand[selected.current]['number'] == parseInt(deckTops[0]['number']) - 1 ||
                     hand[selected.current]['number'] == deckTops[0]['number'] ||
                     hand[selected.current]['number'] == parseInt(deckTops[0]['number']) + 1 ||
                     deckTops[0]['number'] == 'empty')
                     ) {
                        placeCard([hand[selected.current], deckTops[1]]);
                      }     

                else {
                  return
                }  

                var hand_copy = hand;
                for (var i = selected.current + 1; i < hand.length; i ++) {
                  hand_copy[i]['idx'] -= 1
                }

                hand_copy.splice(selected.current, 1);
                updateHand(hand_copy)
                selected.current = null
              }
      }/>
      <Card 
      color = {deckTops[1]['color']} 
      number = {deckTops[1]['number']}
      onPress = {
        () => { if (selected.current !== null && 
              (hand[selected.current]['number'] == parseInt(deckTops[1]['number']) - 1 ||
              hand[selected.current]['number'] == deckTops[1]['number'] ||
              hand[selected.current]['number'] == parseInt(deckTops[1]['number']) + 1 ||
              deckTops[1]['number'] == 'empty')
              ) {
                placeCard([deckTops[0], hand[selected.current]]);
                }    
                else {
                  return
                }   
                var hand_copy = hand;
                for (var i = selected.current + 1; i < hand.length; i ++) {
                  hand_copy[i]['idx'] -= 1
                }
                hand_copy.splice(selected.current, 1);
                updateHand(hand_copy)
                selected.current = null
              }
      }/>
      </View>
      <View style = {{justifyContent: 'center', alignItems: 'center'}}>
        {hand ? <FlatList 
        data = {hand}
        horizontal = {true}
        renderItem = {function ({ item }) { return (
          /*ADD PLACEHOLDER WHEN HAND IS ABSENT*/
          <Card 
            color = {item['color']} 
            number = {item['number']} 
            onPress = {() => (selected.current = item['idx'])}/> 
        )}}
        />: <Card color = '' number = '' onPress = {null}/>}
        <View>
        <Card 
        color = 'black' 
        number = 'deck'
        onPress = {() => {handleDraw()}}/>
        </View>
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
    justifyContent: 'center'
  },
});
