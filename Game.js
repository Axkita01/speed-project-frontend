import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import PlaceHolder from "./components/PlaceHolder.js";
import Card from "./components/Card";
import CardBack from "./components/CardBack";
import { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native-web";

export default function Game({ navigation, route }) {
  const [deck, changeDeck] = useState("");
  const [hand, updateHand] = useState([]);
  const selected = useRef(null);
  const socket = useRef(null);
  const [deckTops, setTops] = useState([
    { color: "empty", number: "empty" },
    { color: "empty", number: "empty" },
  ]);
  const [sideDecks, setSides] = useState([[], []]);
  const [oppLength, setOppLength] = useState([]);
  const cantPlaceOpp = useRef(false);
  const [win, setWinner] = useState(null);
  /*state determining user connection*/
  const [connected, setConnected] = useState(false);
  /*state determining opponeng connection*/
  const [oppConnected, setOppConnected] = useState(false);

  /*tops returned as list of 2 cards*/
  const nav = navigation;
  useEffect(
    function () {
      socket.current = route.params.s;
      socket.current.on("connection", function startGame() {
        setOppConnected(true);
        socket.current.emit("reset");
      });

      socket.current.on("rejection", function rejected() {
        alert("Connection Failed, Room Full");
        socket.current.disconnect();
        nav.navigate("home");
      });

      socket.current.on("disconnection", function stopGame() {
        setOppConnected(false);
        updateHand([]);
        setOppLength([]);
        setWinner(null);
        setSides([[], []]);
        setTops([
          { color: "empty", number: "empty" },
          { color: "empty", number: "empty" },
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
        setOppLength(res);
      });

      socket.current.on("tops-change", function tops(res) {
        setTops([res[0], res[1]]);
      });

      socket.current.on("side-deck", function side(res) {
        cantPlaceOpp.current = false;
        setSides(res);
      });

      socket.current.on("reset", function reset(res) {
        changeDeck(res);
        setOppLength([]);
        updateHand([]);
        setWinner(null);
        cantPlaceOpp.current = false;
      });
    },
    [sideDecks, nav]
  );

  function placeCard(elements) {
    socket.current.emit("resetplace");
    socket.current.emit("update-opp", hand.length - 1);
    socket.current.emit("place", elements);
  }

  function cantPlace() {
    /*event that indicates no more cards playable, use a ref not state,
      if opponent also cannot place, then draw the side decks*/
    if (cantPlaceOpp.current === true) {
      socket.current.emit("noplacemutual", sideDecks);
    } else {
      socket.current.emit("noplace");
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
    socket.current.emit("update-opp", hand.length + 1);
    var hand_copy = hand;
    var deck_copy = deck;
    const card = deck_copy[deck_copy.length - 1];
    const element = {
      key: card[2],
      idx: hand_copy.length,
      color: card[1],
      number: card[0],
    };

    deck_copy = deck_copy.slice(0, -1);
    hand_copy.push(element);
    updateHand(hand_copy);
    changeDeck(deck_copy);
  }

  const page = (
    <View style={styles.container}>
      {React.useLayoutEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                socket.current.disconnect();
                navigation.navigate("home");
              }}
            >
              <Text style={styles.exit}>Exit</Text>
            </TouchableOpacity>
          ),
        });
      }, [navigation])}

      <View>
        {oppLength.length !== 0 ? (
          <FlatList
            style={{ marginBottom: ".5vw", marginTop: '3.5vh' }}
            data={oppLength}
            renderItem={function () {
              return <CardBack/>;
            }}
            horizontal={true}
          />
        ) : (
          <PlaceHolder style = {{marginTop: '5'}}/>
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
        {sideDecks[0].length !== 0 ? <CardBack /> : null}

        <Card
          style={{ marginLeft: 0 }}
          color={deckTops[0]["color"]}
          number={deckTops[0]["number"]}
          onPress={() => {
            if (
              selected.current !== null &&
              win == null &&
              (hand[selected.current]["number"] ==
                parseInt(deckTops[0]["number"]) - 1 ||
                hand[selected.current]["number"] == deckTops[0]["number"] ||
                hand[selected.current]["number"] ==
                  parseInt(deckTops[0]["number"]) + 1 ||
                deckTops[0]["number"] == "empty" ||
                (deckTops[0]["number"] == "13" &&
                  hand[selected.current]["number"] == "1") ||
                (deckTops[0]["number"] == "1" &&
                  hand[selected.current]["number"] == "13"))
            ) {
              if (hand.length === 1 && deck.length === 0) {
                socket.current.emit("winner");
                updateHand([]);
                return;
              }
              placeCard([hand[selected.current], deckTops[1]]);
            } else {
              return;
            }

            var hand_copy = hand;
            for (var i = selected.current + 1; i < hand.length; i++) {
              hand_copy[i]["idx"] -= 1;
            }
            hand_copy.splice(selected.current, 1);
            updateHand(hand_copy);
            selected.current = null;
          }}
        />

        <Card
          color={deckTops[1]["color"]}
          number={deckTops[1]["number"]}
          onPress={() => {
            if (
              selected.current !== null &&
              win == null &&
              (hand[selected.current]["number"] ==
                parseInt(deckTops[1]["number"]) - 1 ||
                hand[selected.current]["number"] == deckTops[1]["number"] ||
                hand[selected.current]["number"] ==
                  parseInt(deckTops[1]["number"]) + 1 ||
                deckTops[1]["number"] == "empty" ||
                (deckTops[1]["number"] == "13" &&
                  hand[selected.current]["number"] == "1") ||
                (deckTops[1]["number"] == "1" &&
                  hand[selected.current]["number"] == "13"))
            ) {
              if (hand.length === 1 && deck.length === 0) {
                socket.current.emit("winner");
                updateHand([]);
                return;
              }
              placeCard([deckTops[0], hand[selected.current]]);
            } else {
              return;
            }
            var hand_copy = hand;
            for (var i = selected.current + 1; i < hand.length; i++) {
              hand_copy[i]["idx"] -= 1;
            }

            hand_copy.splice(selected.current, 1);
            updateHand(hand_copy);
            selected.current = null;
          }}
        />

        {sideDecks[0].length !== 0 ? <CardBack /> : null}
      </View>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {hand.length !== 0 ? (
          <FlatList
            data={hand}
            horizontal={true}
            style = {{marginBottom: '2vw'}}
            renderItem={function ({ item }) {
              return (
                /*ADD PLACEHOLDER WHEN HAND IS ABSENT*/
                <Card
                  color={item["color"]}
                  number={item["number"]}
                  onPress={() => (selected.current = item["idx"])}
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
              <Card
                color="black"
                number="deck"
                onPress={() => {
                  handleDraw();
                }}
              />
              <TouchableOpacity />
            </View>
          ) : (
            <PlaceHolder />
          )}

          {/*Cannot place button*/}
          <TouchableOpacity
            onPress={() => {
              cantPlace();
            }}
            style={styles.noPlace}
          >
            <Text textAlign = 'center'>Cannot Place</Text>
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
          <View>
            <Text>Awaiting Player Connection...</Text>
          </View>
        )
      ) : (
        <View>
          {/*Play Again Screen*/}
          <Text>{winningString(win)}</Text>
          <Text>Play Again?</Text>
          <TouchableOpacity
            onPress={() => {
              socket.current.emit("reset");
            }}
          >
            Cannot Place
          </TouchableOpacity>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    background: "transparent",
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
    borderRadius: '5vh',
    borderStyle: 'solid',
    borderWidth: '.1vh',
    background: "#56C7FF",
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center'
  },
});
