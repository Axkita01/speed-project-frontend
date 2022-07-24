import {Button, View, StyleSheet, TouchableOpacity, Text} from "react-native"

export default function PlaceHolder () {
    return (
        <View style = {styles.card}/>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '20vw',
        height: '30vw',
        marginRight: '2vw',
        marginBottom: '1vw'
    }


})