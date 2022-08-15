import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import PlaceHolder from "./components/PlaceHolder.js";
import Card from "./components/Card";
import CardBack from "./components/CardBack";
import { useState, useRef, useReducer, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native-web";
import WinningScreen from "./components/WinningScreen.js";
import Awaiting from "./components/Awaiting.js";
import Deck from "./components/Deck.js";

const initialGameState = {oppLength: [], deck: [], hand: []};
export default function Game({ navigation, route }) {
  const mounted = useRef(false)
  const [selected, setSelected] = useState(null);
  const socket = useRef(null);
  const [deckTops, setTops] = useState([
    { color: "", number: "", selected: false },
    { color: "", number: "", selected: false },
  ]);
  /*integrate side decks into useReducer to optimize*/
  const [sideDecks, setSides] = useState([[], []]);
  const [gameState, gameStateDispatch] = useReducer(mounted ? gameStateReducer: function (){}, initialGameState);
  const cantPlaceOpp = useRef(false);
  const [win, setWinner] = useState(null);
  const [cannotPlace, setCannotPlace] = useState(false)
  const [room, setRoom] = useState(null)
  const [oppConnected, setOppConnected] = useState(false);

  /*tops returned as list of 2 cards*/
  const nav = navigation;
  useEffect(
    function () {
      mounted.current = true
      socket.current = route.params.s;
      setRoom(route.params.room)
      socket.current.emit('join', route.params.room)
      socket.current.on("connection", function startGame() {
        setOppConnected(true);
        /*add rooms to previouslt empty emits*/
        socket.current.emit("reset", route.params.room);
      });

      socket.current.on('disconnect', function lostConnection() {
        /*displays if hand, deck empty and disconnected*/
        socket.current.disconnect()
        navigation.navigate('home')
        if (oppConnected || gameState.hand || gameState.deck) {
          alert('Left game (lost connection or exited)')
        }
      })

      socket.current.on("rejection", function rejected() {
        alert("Connection Failed, room full or does not exist");
        socket.current.disconnect();
        nav.navigate("home");
      });

      socket.current.on("disconnection", function stopGame() {
        setOppConnected(false);
        gameStateDispatch({type: 'startover'});
        setWinner(null);
        setSides([[], []]);
        setCannotPlace(false)
        setTops([
          { color: "", number: "", selected: false },
          { color: "", number: "", selected: false },
        ]);
        cantPlaceOpp.current = false;
      });
      /*resets cant place reference if opponent places card again*/
      socket.current.on("resetplace", function canPlace() {
        cantPlaceOpp.current = false;
      });

      socket.current.on("winner", function winner(res) {
        setWinner(res);
      });

      socket.current.on("noplace", function noPlace() {
        cantPlaceOpp.current = true;
      });

      socket.current.on("update-opp", function handOpp(res) {
        gameStateDispatch({type: res})
      });

      socket.current.on("tops-change", function tops(res) {
        setTops([res[0], res[1]]);
      });

      socket.current.on("side-deck", function side(res) {
        cantPlaceOpp.current = false;
        setCannotPlace(false)
        setSides(res);
      });

      socket.current.on("reset", function reset(res) {
        setCannotPlace(false)
        setWinner(null);
        setSelected(null)
        cantPlaceOpp.current = false;
        gameStateDispatch({type: 'reset', payload: res})
      });
      
      return function unMount () {
        socket.current.disconnect()
        mounted.current = false
      }
    },
    [] /*sideDecks, nav*/
  );

  function placeCard(elements, selected) {
    socket.current.emit("resetplace", room);
    socket.current.emit("update-opp", {room: room, reduce: 'reduce'});
    socket.current.emit("place", {elements: elements, room: room});
    setTops(elements)
    gameStateDispatch({type: 'place', payload: selected})
    setCannotPlace(false)
    setSelected(null)
  }

  function cantPlace() {
    /*event that indicates no more cards playable, use a ref not state,
      if opponent also cannot place, then draw the side decks*/
    if (cantPlaceOpp.current === true) {
      socket.current.emit("noplacemutual", {sides: sideDecks, room: room});
    } 
    
    else {
      socket.current.emit("noplace", room);
      setCannotPlace(true)
    }
  }

  function handleDraw() {
    if (gameState.deck.length === 0 || gameState.hand.length === 4 || win !== null) {
      return;
    }
    socket.current.emit("update-opp", {room:room, reduce: 'increase'});
    gameStateDispatch({type: 'draw'})
  }

  function gameStateReducer (state, action) {
    switch (action.type) {
      case 'reduce':
        var newOppLength = [...state.oppLength]
        newOppLength.pop()
        return {oppLength: newOppLength, deck: state.deck, hand: state.hand}
      
      case 'increase':
        var newOppLength = [...state.oppLength, 1]
        return {oppLength: newOppLength, deck: state.deck, hand: state.hand}
      
      case 'reset':
        return {oppLength: [], deck: action.payload, hand: []}
      
      case 'startover':
        return initialGameState
      
      case 'draw':
        var hand_copy = [...state.hand];
        var deck_copy = [...state.deck];
        const card = deck_copy[deck_copy.length - 1];
        const element = {
          key: card[2],
          idx: hand_copy.length,
          color: card[1],
          number: card[0],
          selected: false
        };

        deck_copy = deck_copy.slice(0, -1);
        hand_copy.push(element);
        return {oppLength: state.oppLength, hand: hand_copy, deck: deck_copy}
      
      case 'place':
            var hand_copy = [...state.hand];
            for (var i = action.payload + 1; i < state.hand.length; i++) {
              hand_copy[i]["idx"] -= 1;
            }

            hand_copy.splice(action.payload, 1);
            return {oppLength: state.oppLength, hand: hand_copy, deck: state.deck}
            

      default:
        throw Error('Something Went Wrong')
    }
  }

  const page = (
    <View style={styles(cannotPlace).container}>
      {React.useLayoutEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                socket.current.disconnect();
                navigation.navigate("home");
              }}
            >
              <Text style={styles(cannotPlace).exit}>Exit</Text>
            </TouchableOpacity>
          ),
        });

      }, [navigation])}
      {/*opponent's hand*/}
      <View>
        {gameState.oppLength.length !== 0 ? (
          <FlatList
            style={{marginTop: '3.5vh' }}
            data={gameState.oppLength}
            renderItem={function () {
              return <CardBack/>;
            }}
            horizontal={true}
          />
        ) : (
          /*FIXME: Cards moving down when opponent has cards in hand*/
          <PlaceHolder style = {{marginTop: '6vh'}}/>
        )}
      </View>

      {/*Middle Decks*/}
      <View
        style={{
          flexDirection: "row",
          marginBottom: "10vh",
          marginTop: "10vh",
        }}
      >
        {sideDecks[0].length !== 0 ? <CardBack style = {{marginRight: '1vw'}}/> : 
        null}

        <Card
          color={deckTops[0]["color"]}
          number={deckTops[0]["number"]}
          onPress={() => {
            if (
              selected !== null &&
              win == null &&
              (gameState.hand[selected]["number"] ==
                parseInt(deckTops[0]["number"]) - 1 ||
                gameState.hand[selected]["number"] == deckTops[0]["number"] ||
                gameState.hand[selected]["number"] ==
                  parseInt(deckTops[0]["number"]) + 1 ||
                deckTops[0]["number"] == "" ||
                (deckTops[0]["number"] == "13" &&
                  gameState.hand[selected]["number"] == "1") ||
                (deckTops[0]["number"] == "1" &&
                  gameState.hand[selected]["number"] == "13"))
            ) {
              if (gameState.hand.length === 1 && gameState.deck.length === 0) {
                socket.current.emit("winner", room);
                return;
              }
              placeCard([gameState.hand[selected], deckTops[1]], selected);
            } else {
              return;
            }
          }}
        />

        <Card
          color={deckTops[1]["color"]}
          number={deckTops[1]["number"]}
          onPress={() => {
            if (
              selected !== null &&
              win == null &&
              (gameState.hand[selected]["number"] ==
                parseInt(deckTops[1]["number"]) - 1 ||
                gameState.hand[selected]["number"] == deckTops[1]["number"] ||
                gameState.hand[selected]["number"] ==
                  parseInt(deckTops[1]["number"]) + 1 ||
                deckTops[1]["number"] == "" ||
                (deckTops[1]["number"] == "13" &&
                  gameState.hand[selected]["number"] == "1") ||
                (deckTops[1]["number"] == "1" &&
                  gameState.hand[selected]["number"] == "13"))
            ) {
              if (gameState.hand.length === 1 && gameState.deck.length === 0) {
                socket.current.emit("winner", room);
                return;
              }
              
              placeCard([deckTops[0], gameState.hand[selected]], selected);
            } else {
              return;
            }
          }}
        />

        {sideDecks[0].length !== 0 ? <CardBack /> : null}
      </View>
      
      {/*current player's hand*/}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {gameState.hand.length !== 0 ? (
          <FlatList
            data={gameState.hand}
            horizontal={true}
            style = {{marginBottom: '3.5vh', display: 'flex', overflow: 'visible'}}
            renderItem={function ({ item }) {
              return (
                /*ADD PLACEHOLDER WHEN HAND IS ABSENT*/
                <Card
                  color={item["color"]}
                  number={item["number"]}
                  selected = {item['selected']}
                  onPress={() => {
                    if (selected !== null) {
                    gameState.hand[selected]['selected'] = false;
                    }
                    setSelected(item["idx"]);
                    item['selected'] = true
                    
                  }}
                />
              );
            }}
          />
        ) : (
          <PlaceHolder />
        )}

        <View style = {{flexDirection: 'row', alignItems: 'center'}}>
          {gameState.deck.length > 0 ? (
            <View>
              <Deck onPress = {() => {handleDraw()}}/>
            </View>
          ) : (
            <PlaceHolder style = {styles(cannotPlace).deck}/>
          )}

          {/*Cannot place button*/}
          <TouchableOpacity
            onPress={() => {
              cantPlace();
            }}
            style={styles(cannotPlace).noPlace}
          >
            <Text textAlign = 'center' style = {styles(cannotPlace).cannotPlaceText}>Cannot Place</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View>
      {win === null ? (
        oppConnected ? (
          page
        ) : (
          <Awaiting room = {room}/>
        )
      ) : (
        <WinningScreen socket = {socket.current} room = {room} winner = {win}/>
      )}
      <StatusBar style="auto" />
    </View>
          
  );

}

const styles = (cannotPlace) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  exit: {
    fontWeight: "bold",
    color: "white",
    marginLeft: "1vw",
  },

  noPlace: {
    width: "10vh",
    height: "10vh",
    marginLeft: '10vw',
    borderRadius: '1vh',
    borderStyle: 'solid',
    borderWidth: '.1vh',
    color: 'white',
    backgroundColor: !cannotPlace ? '#56C7FF': '#C75610',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    color: 'white'
  },

  deck: {
    /*may not need this style*/
    left: '15vw'
  },

  cannotPlaceText: {
    fontWeight: 'bold',
    fontSize: '2vh',
    color: 'white'
  }

});
