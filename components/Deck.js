import { ImageBackground, View, Text, TouchableOpacity, StyleSheet } from "react-native-web";
import {useFonts} from 'expo-font'

export default function Deck(props) {
    let fonts = useFonts({
        'Karla': require('../assets/fonts/Karla-VariableFont_wght.ttf'),
        'KdamThmorPro': require('../assets/fonts/KdamThmorPro-Regular.ttf')
    })

    return (
        <TouchableOpacity onPress = {props.onPress} style = {styles.card}>
            <ImageBackground 
            source = {require('../assets/Images/card back.jpg')}
            style = {styles.cardInside}>
                <View style = {styles.textContainer}>
                    <Text style = {styles.cardText}>
                        Draw
                    </Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '8vh',
        height: '12vh',
        marginRight: '1.5vw',
        marginLeft: '1.5vw',
        borderRadius: '1vh',
        overflow: 'hidden'
    },

    cardInside: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    cardText: {
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: '2.5vh',
        fontFamily: 'KdamThmorPro'
    },

    textContainer: {
        backgroundColor: 'gray',
        borderRadius: '1vh'
    }
})