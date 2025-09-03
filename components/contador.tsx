import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Contador() {
  
  // b: Utilizar una variable de estado específica para clicks
  const [clicks, setClicks] = useState(0);
  const [clickNegative,setNegativeClicks]= useState(10);

  // función para actualizar la variable clicks
  function updateClicks() {
    setClicks(clicks + 1);
  }
  function reduceClicks() {
    setNegativeClicks(clickNegative - 1);
  }

  return (
   <View style={styles.container}>
      <Text style={styles.text}>Clicks positivos:</Text>
      <Pressable style={styles.button} onPress={updateClicks}>
        <Text style={styles.buttonText}>{clicks} clicks</Text>
      </Pressable>

      <Text style={styles.text}>Clicks negativos:</Text>
      <Pressable style={styles.button} onPress={reduceClicks}>
        <Text style={styles.buttonText}>{clickNegative} clicks</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "gray",
    },
    text: {
      fontSize: 18,
      marginVertical: 10,
      color: "white",
      fontFamily:"Serif"
    },
    button: {
      backgroundColor: "gray",
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginVertical: 10,
      borderRadius: 8,
      
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontFamily:"",
    },
  });





/** 
// a: Manejar todo el estado en un objeto
const [state, setState] = useState({ clicks: 0 });

// función para actualizar el objeto state
function updateStateClicks() {
  setState({ clicks: state.clicks + 1 });
}

<View style={styles.container}>
      <Text style={styles.text}>Ejemplo A (objeto state):</Text>
      <Button
        title={state.clicks + " clicks"}
        onPress={updateStateClicks}
      />

*/