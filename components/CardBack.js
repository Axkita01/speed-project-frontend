import {View, StyleSheet, Image} from "react-native-web"

export default function CardBack () {
    return (
        <View style = {styles.card}>
            
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderStyle: 'solid',
        borderWidth: '.1vh',
        width: '8vh',
        height: '12vh',
        marginRight: '1vw',
        borderRadius: '.8vh'
    }
})