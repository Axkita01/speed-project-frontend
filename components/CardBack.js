import {View, StyleSheet, Image} from "react-native"

export default function CardBack () {
    const hex_color = props.color === 'black' ? '#000': '#F00'
    return (
        <View style = {styles.card}>
            <Image
            style = {{width: '100%', height: '100%'}}
            source = {require()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderStyle: 'solid',
        borderWidth: '.2vw',
        width: '20vw',
        height: '30vw',
        marginRight: '2vw',
        marginBottom: '1vw'
    }
})