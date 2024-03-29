import {View, StyleSheet, Image} from "react-native-web"

export default function CardBack () {
    return (
        <View style = {styles.card}>
            <Image
            style = {styles.image}
            source = {require('../assets/Images/card back.jpg')}/>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '8vh',
        height: '12vh',
        marginRight: '1vw',
        marginLeft: '1vw'
        
    },

    image: {
        height: '100%',
        width: '100%',
        borderRadius: '1vh'
    }
})