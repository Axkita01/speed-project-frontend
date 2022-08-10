import * as React from 'react'
import { TouchableOpacity, View, Text, StyleSheet} from 'react-native-web'




export default function Rules ({ navigation}) {
    return (
    <View style = {styles.container}>
    {React.useLayoutEffect(() => {
            navigation.setOptions({
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("home");
                  }}
                >
                  <Text style={styles.exit}>Exit</Text>
                </TouchableOpacity>
              ),
            });
          }, [navigation])}
        <Text style = {styles.header}>The Rules:</Text>
        <View>
        <Text style = {styles.description}>
            Setup:<br/>
                Once both players connect to the same room, each will receieve cards in their deck.
                The two center piles will be initially empty and allow for any
                card to be placed within them. The two outermost piles are there in the
                case that neither player can place a card. Each player may have up to four
                cards in their hand.
        </Text> <br/>
        </View>
        <View>
        <Text style = {styles.description}>
            Rules/Gameplay:<br/>
                To draw cards, click the deck located at the bottom of the screen. You may have
                up to four cards in your hand at once. To place a card, select a card in your hand by
                tapping it then tap on the middle deck to place (if valid). You may place a card on the
                middle deck if the top of the targetting pile has a card that has the same number or a difference 
                of 1 (with the exception of 1 and 13, those may be placed on each other). The deck will disappear 
                once empty. When one player runs out of cards in their deck and their hand, that player is
                declared the winner. Whenever the game ends, both players will see the play again screen but only
                player 1 (first to join) may restart the game.<br/>
        </Text>
        </View>
        <View>
        <Text style = {styles.description}>
           Additional Rules: <br/>
               If you cannot place a card on the field, press the "cannot place" button. If both players cannot
               place a card, it will replace the top cards of the middle decks with the top cards from the side decks.
               if both players cannot place and the side decks are empty, it is a tie.<br/>
        </Text>
        </View>
        <View>
        <Text style = {styles.description}>
          Misc. Information: <br/>
                This project is currently a work in progress
                but has most of its functionality. Have fun!
        </Text>
        </View>
    </View>
    )
}

const styles = StyleSheet.create ( {
    header: {
        fontWeight: 'bold',
        marginBottom: '1vh',
        marginTop: '1vh',
        color: 'white'
    },

    container: {
        display: 'flex', 
        alignItems: 'center', 
        color: 'white'
    },

    description: {
        marginBottom: '3vh',
        width: '70vw',
        textAlign: 'center',
        lineHeight: 30,
        color: 'white',
        borderStyle: 'solid',
        borderWidth: '.1vh',
        borderRadius: '1vh',
        paddingLeft: '2vw',
        paddingRight: '2vw'
    },

    exit: {
        fontWeight: "bold",
        color: "white",
        marginLeft: "1vw",
      },

})
