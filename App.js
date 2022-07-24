import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import PlaceHolder from './components/PlaceHolder.js';
import Card from './components/Card';
import {useState, useRef} from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { io } from 'socket.io-client'

const s = io ('http://localhost:5000');

export default function App() {
  const [deck, changeDeck] = useState('')
  const [hand, updateHand] = useState([])
  const selected = useRef(null)
  const socket = useRef(null)
  const [deckTops, setTops] = useState([{color: 'empty', number: 'empty'}, {color: 'empty', number: 'empty'}])
  const [sideDecks, setSides] = useState([null, null])
  const [oppLength, setOppLength] = useState([])
  const cantPlaceOpp = useRef(false)
  const [win, setWinner] = useState(null)
  /*tops returned as list of 2 cards*/
  console.log(sideDecks)
  useEffect(function ()  {
    socket.current = s

    socket.current.on('winner', function winner (res) {
      setWinner(res)
    })

    socket.current.on('noplace', function noPlace () {
      cantPlaceOpp.current = true
    })

    socket.current.on('update-opp', function handOpp (res) {
      setOppLength(res)
    })

    socket.current.on('tops-change', function tops (res) {
      setTops([res[0], res[1]])
    })

    socket.current.on('side-deck', function side (res) {
      cantPlaceOpp.current = false
      setSides(res)
    })

    socket.current.on('reset', function reset (res) {
      changeDeck(res)
      setOppLength([])
      updateHand([])
      setWinner(null)
      cantPlaceOpp.current = false
    })
    
    }, [s, sideDecks])

    function placeCard (elements) {
      socket.current.emit('update-opp', hand.length - 1)
      socket.current.emit('place', (elements))
    }

    function cantPlace() {
      /*event that indicates no more cards playable, use a ref not state,
      if opponent also cannot place, then draw the side decks*/
      if (cantPlaceOpp.current === true) {
        socket.current.emit('noplacemutual', sideDecks)
      }

      else {
        socket.current.emit('noplace')
      }
    }
    
    const winningString = (winner) => {
      switch (winner) {
        case false:
          return 'You Lose!'
        
        case true:
          return 'You Win!'
        
        case 'tie':
          return 'Tie Game!'

        default:
          return null
      }
    }

    function handleDraw () {
      if (deck.length === 0 || hand.length === 4) {
        return
      }
      socket.current.emit('update-opp', hand.length + 1)
      var hand_copy = hand
      var deck_copy = deck
      const card = deck_copy[deck_copy.length - 1 ]
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
      {winningString(win)}
      <FlatList
      data = {oppLength}
      renderItem = {function (item) {
        return (<Card color = '' number = ''/>)
      }}
      horizontal = {true}
      />
      <Button
      title = {'Cannot Place'}
      onPress = {() => {cantPlace()}}
      />
      <Button 
      onPress = {() => {socket.current.emit('reset');}} 
      title='test reset'/>
      {/*Middle Decks*/}
      <View style = {{flexDirection: 'row', marginBottom: '.5vw'}}>

      {sideDecks[0]? 
      <Card
      color = 'black'
      number = {sideDecks[0].length}
      />
      : null}

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
                      if (hand.length === 1 && deck.length === 0) {
                        socket.current.emit('winner')
                        updateHand([])
                        return
                      }
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
                if (hand.length === 1 && deck.length === 0) {
                  socket.current.emit('winner')
                  updateHand([])
                  return
                }
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

    {sideDecks[0] ? 
      <Card
      color = 'black'
      number = {sideDecks[1].length}
      />
      : null}

      </View>

      <View style = {{justifyContent: 'center', alignItems: 'center'}}>
        {hand.length !== 0 ? 
        <FlatList 
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
        {deck.length > 0 ? <Card 
        color = 'black' 
        number = 'deck'
        onPress = {() => {handleDraw()}}/>: <PlaceHolder/>}
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
