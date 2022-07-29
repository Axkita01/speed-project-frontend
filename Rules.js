import * as React from 'react'
import { TouchableOpacity, View, Text, StyleSheet} from 'react-native'
import {io} from 'socket.io-client'

export default function Rules ({ navigation }) {
    return (
    <View style = {{display: 'flex', alignItems: 'center'}}>
        <Text style = {styles.header}>Welcome To Speed!</Text>
        <Text>The Rules:</Text>
        <Text style = {styles.description}>
            At the beginning of the game, each player will receieve the same
            amount of cards in their personal deck, the side piles in the Middle
            will initially contain five cards and the middle two piles will be empty. The
            game will begin as soon as both players connect.
        </Text>
        <TouchableOpacity
        style = {styles.connect}
        onPress={() => {
            /*temporary server link*/
            const socket = io('https://speed-project-server.herokuapp.com');
            navigation.navigate('game', {s: socket})}}
          ><Text>Play</Text></TouchableOpacity>
    </View>
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
        width: '5vw',
        fontSize: '.5vw',
        alignItems: 'center',
        display: 'flex'
    },

    description: {
        marginBottom: '2vh',
        width: '70vw',
        textAlign: 'center'
    }

})
