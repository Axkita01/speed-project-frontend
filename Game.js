import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import PlaceHolder from "./components/PlaceHolder.js";
import Card from "./components/Card";
import CardBack from "./components/CardBack";
import { useState, useRef, useReducer } from "react";
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

const initialOppLength = {oppLength: []};
export default function Game({ navigation, route }) {
  const [deck, changeDeck] = useState("");
  const [hand, updateHand] = useState([]);
  const [selected, setSelected] = useState(null);
  const socket = useRef(null);
  const [deckTops, setTops] = useState([
    { color: "", number: "", selected: false },
    { color: "", number: "", selected: false },
  ]);
  /*integrate side decks into useReducer to optimize*/
  const [sideDecks, setSides] = useState([[], []]);
  const [oppLengthState, oppLengthDispatch] = useReducer(oppLengthReducer, initialOppLength);
  const cantPlaceOpp = useRef(false);
  const [win, setWinner] = useState(null);
  /*state determining user connection*/
  const [cannotPlace, setCannotPlace] = useState(false)
  /*state determining opponeng connection*/
  const [room, setRoom] = useState(null)
  const [oppConnected, setOppConnected] = useState(false);

  /*tops returned as list of 2 cards*/
  const nav = navigation;
  useEffect(
    function () {
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
        if (oppConnected ||hand || deck) {
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
        updateHand([]);
        oppLengthDispatch({type: 'reset'});
        setWinner(null);
        setSides([[], []]);
        setCannotPlace(false)
        setCannotPlace(false)
        setTops([
          { color: "", number: "", selected: false },
          { color: "", number: "", selected: false },
        ]);
        cantPlaceOpp.current = false;
        alert("Opponent Disconnected")
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
        console.log(res)
        oppLengthDispatch({type: res})
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
        changeDeck(res);
        setCannotPlace(false)
        updateHand([]);
        setWinner(null);
        cantPlaceOpp.current = false;
        oppLengthDispatch({type: 'reset'})
      });
      return function unMount () {
        socket.current.disconnect()
      }
    },
    [] /*sideDecks, nav*/
  );

  function placeCard(elements) {
    socket.current.emit("resetplace", room);
    socket.current.emit("update-opp", {hand_length: hand.length - 1, room: room, reduce: 'reduce'});
    socket.current.emit("place", {elements: elements, room: room});
    setTops(elements)
    setCannotPlace(false)
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

  const winningString = (winner) => {
    switch (winner) {
      case false:
        return "You Lose!";

      case true:
        return "You Win!";

      case "tie":
        return "Tie Game!";

      default:
        return null;
    }
  };

  function handleDraw() {
    if (deck.length === 0 || hand.length === 4 || win !== null) {
      return;
    }
    socket.current.emit("update-opp", {hand_length:hand.length + 1, room:room, reduce: 'increase'});
    var hand_copy = [...hand];
    var deck_copy = deck;
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
    updateHand(hand_copy);
    changeDeck(deck_copy);
  }

  function oppLengthReducer(state, action) {
    console.log(action.type)
    switch (action.type){
      case 'reduce':
        var newOppLength = [...state.oppLength]
        newOppLength.pop()
        return {oppLength: newOppLength}
      
      case 'increase':
        var newOppLength = [...state.oppLength, 1]
        return {oppLength: newOppLength}
      
      case 'reset':
        return initialOppLength

      default:
        throw Error('This is my Error')
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
        {oppLengthState.oppLength.length !== 0 ? (
          <FlatList
            style={{marginTop: '3.5vh' }}
            data={oppLengthState.oppLength}
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
              (hand[selected]["number"] ==
                parseInt(deckTops[0]["number"]) - 1 ||
                hand[selected]["number"] == deckTops[0]["number"] ||
                hand[selected]["number"] ==
                  parseInt(deckTops[0]["number"]) + 1 ||
                deckTops[0]["number"] == "" ||
                (deckTops[0]["number"] == "13" &&
                  hand[selected]["number"] == "1") ||
                (deckTops[0]["number"] == "1" &&
                  hand[selected]["number"] == "13"))
            ) {
              if (hand.length === 1 && deck.length === 0) {
                socket.current.emit("winner", room);
                updateHand([]);
                return;
              }
              placeCard([hand[selected], deckTops[1]]);
            } else {
              return;
            }

            var hand_copy = hand;
            for (var i = selected + 1; i < hand.length; i++) {
              hand_copy[i]["idx"] -= 1;
            }
            hand_copy.splice(selected, 1);
            updateHand(hand_copy);
            setSelected(null);
          }}
        />

        <Card
          color={deckTops[1]["color"]}
          number={deckTops[1]["number"]}
          onPress={() => {
            if (
              selected !== null &&
              win == null &&
              (hand[selected]["number"] ==
                parseInt(deckTops[1]["number"]) - 1 ||
                hand[selected]["number"] == deckTops[1]["number"] ||
                hand[selected]["number"] ==
                  parseInt(deckTops[1]["number"]) + 1 ||
                deckTops[1]["number"] == "" ||
                (deckTops[1]["number"] == "13" &&
                  hand[selected]["number"] == "1") ||
                (deckTops[1]["number"] == "1" &&
                  hand[selected]["number"] == "13"))
            ) {
              if (hand.length === 1 && deck.length === 0) {
                socket.current.emit("winner", room);
                updateHand([]);
                return;
              }
              placeCard([deckTops[0], hand[selected]]);
            } else {
              return;
            }
            var hand_copy = hand;
            for (var i = selected + 1; i < hand.length; i++) {
              hand_copy[i]["idx"] -= 1;
            }

            hand_copy.splice(selected, 1);
            updateHand(hand_copy);
            setSelected(null);
          }}
        />

        {sideDecks[0].length !== 0 ? <CardBack /> : null}
      </View>
      
      {/*current player's hand*/}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {hand.length !== 0 ? (
          <FlatList
            data={hand}
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
                    hand[selected]['selected'] = false;
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
          {deck.length > 0 ? (
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
