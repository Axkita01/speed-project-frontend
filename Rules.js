import * as React from 'react'
import { TouchableOpacity, View, Text, StyleSheet} from 'react-native'
import { ScrollView } from 'react-native-web';
import {io} from 'socket.io-client'

export default function Rules ({ navigation }) {
    return (
    <ScrollView style = {{background: '#DFDFDF'}}>
    <View style = {{display: 'flex', alignItems: 'center', marginBottom: '4vh'}}>
        <Text style = {styles.header}>Welcome To Speed!</Text>
        <Text>The Rules:</Text>
        <Text style = {styles.description}>
            Setup:<br/>
                Once both players connect, each will receieve cards in their deck.
                The two center piles will be initially empty and allow for any
                card to be placed within them. The two outermost piles are there in the
                case that neither player can place a card. Each player may have up to four
                cards in their hand. <br/><br/>

            Rules/Gameplay:<br/>
                To draw cards, click the deck located at the bottom of the screen. You may have
                up to four cards in your hand at once. To place a card, select a card in your hand by
                tapping it then tap on the middle deck to place (if valid). You may place a card on the
                middle deck if the top of the targetting pile has a card that has the same number or a difference 
                of 1 (with the exception of 1 and 13, those may be placed on each other). The deck will disappear 
                once empty. When one player runs out of cards in their deck and their hand, that player is
                declared the winner.<br/><br/>
           Additional Rules: <br/>
               If you cannot place a card on the field, press the "cannot place" button. If both players cannot
               place a card, it will replace the top cards of the middle decks with the top cards from the side decks.
               if both players cannot place and the side decks are empty, it is a tie.<br/><br/>
          Misc. Information: <br/>
                There is only one room for the game to take place. If a third person tries to connect, 
                their connection will be rejected from the room. This project is currently a work in progress
                but has most of its functionality. Have fun!
        </Text>
        <TouchableOpacity
        style = {styles.connect}
        onPress={() => {
            /*temporary server link*/
            const socket = io('https://speed-project-server.herokuapp.com');
            navigation.navigate('game', {s: socket})}}
          ><Text>Play</Text></TouchableOpacity>
    </View>
    </ScrollView>
    )
}

const styles = StyleSheet.create ( {
    header: {
        fontWeight: 'bold',
        marginBottom: '2vh',
        marginTop: '2vh'
    },

    connect: {
        borderStyle: 'solid',
        borderWidth: '.2vw',
        width: '10%',
        fontSize: '.5vw',
        alignItems: 'center',
        display: 'flex'
    },

    description: {
        marginBottom: '2vh',
        width: '70vw',
        textAlign: 'center',
        lineHeight: 40
    }

})
