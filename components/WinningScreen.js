import {View,  StyleSheet, Text} from 'react-native-web'
import Fancy from './Fancy';

export default function WinningScreen(props) {
    /*Props are room, winner, and socket*/
    const winningString = (winner) => {
        switch (winner) {
          case false:
            return "You Lose!";
    
          case true:
            return "You Win!";
    
          case "tie":
            return "Tie Game!";
    
          default:
            return null;
        }
      };

    return (
        <View style = {styles.container}>
          {/*Play Again Screen*/}
          <Text style = {styles.winner}>{winningString(props.winner)}</Text>
          <Text style = {styles.winner}>Play Again?</Text>
          <Fancy
            onPress={() => {
              props.socket.emit("reset", props.room);
            }}
            text = 'Press to play again!'
          />
        </View>
    )
}

const styles = StyleSheet.create({
    winner: {
        fontFamily: 'Karla',
        color: 'white',
        marginBottom: '5vh',
        fontWeight: 'bold'
        },
    
    container: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        marginTop: '2vh'
    }
    })