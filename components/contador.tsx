import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Contador() {
  // Un solo contador
  const [count, setCount] = useState(0);

  function increase() {
    setCount(count + 1);
  }

  function decrease() {
    setCount(count - 1);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Contador:</Text>
      <Text style={styles.counter}>{count}</Text>

      <Pressable style={styles.button} onPress={increase}>
        <Text style={styles.buttonText}>Incrementar</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={decrease}>
        <Text style={styles.buttonText}>Decrementar</Text>
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
    fontSize: 20,
    marginBottom: 10,
    color: "white",
    fontFamily: "Serif",
  },
  counter: {
    fontSize: 30,
    color: "white",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
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