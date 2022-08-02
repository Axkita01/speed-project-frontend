import {Button, View, StyleSheet, TouchableOpacity, Text} from "react-native-web"

export default function PlaceHolder () {
    return (
        <View style = {styles.card}/>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '8vh',
        height: '15.5vh',
        marginRight: '1vh',
    }


})