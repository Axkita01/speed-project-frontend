import {Button, View, StyleSheet, TouchableOpacity, Text} from "react-native-web"

export default function PlaceHolder () {
    return (
        <View style = {styles.card}/>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '10vh',
        height: '15vh',
        marginRight: '1vh',
        marginBottom: '.5vh'
    }


})