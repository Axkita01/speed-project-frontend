import {View, StyleSheet, Image} from "react-native-web"

export default function CardBack () {
    return (
        <View style = {styles.card}>
            <Image
            style = {styles.image}
            source = {require('../Images/card back.jpg')}/>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '10vh',
        height: '15vh',
        marginRight: '1vw',
        
    },

    image: {
        height: '100%',
        width: '100%',
        borderRadius: '1vh'
    }
})