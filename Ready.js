import {View, Text, TouchableOpacity, StyleSheet} from 'react-native-web';

export default function Ready ({navigation}) {
    return (
        <View style = {styles.container}>
            <Text>Opponent Joined.</Text>
            <TouchableOpacity style = {styles.button} onPress = {navigation.navigate('home')}>
                <Text>
                    Return To Home
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create(
    {
        button: {
            display: 'flex',
            alignItems: 'center'
        },
        container: {
            display: 'flex',
            alignItems: 'center'
        }
    }
)