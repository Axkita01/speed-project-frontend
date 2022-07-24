import * as React from 'react'
import { TouchableOpacity, View, Text, StyleSheet} from 'react-native'
import {io} from 'socket.io-client'

export default function Rules ({ navigation }) {
    return (
    <View>
        <Text>Welcome To Speed!</Text>
        <Text>The Rules:</Text>
        <Text>
            At the beginning of the game, each player will receieve the same
            amount of cards in their personal deck, the side piles in the Middle
            will initially contain five cards and the middle two piles will be empty.
        </Text>
        <TouchableOpacity
        style = {styles.connect}
        onPress={() => {
            const socket = io('http://localhost:5000');
            navigation.navigate('game', {s: socket})}}
          ><Text>Play</Text></TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create ( {
    header: {

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

    }

})