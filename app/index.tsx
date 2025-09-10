import { View, Text,StyleSheet,Pressable} from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Bienvenido!</Text>
      
      <Pressable style= {styles.button}>
        <Link href="/(tabs)/contador">
          <Text style={styles.buttonText}> Ingresar</Text>
        </Link>
      </Pressable>
      
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
    },
    text: {
      fontSize: 18,
      marginVertical: 10,
      color: "white",
      fontFamily:"Serif"
    },
    button: {
      backgroundColor: "black",
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginVertical: 10,
      borderRadius: 8,
      height:50,
      width:150,
      alignItems: "center",
      
    },
    buttonText: {
      color: "white",
      fontSize: 20,
      fontFamily:"",
    },
  });