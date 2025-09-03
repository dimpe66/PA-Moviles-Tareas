//import Contador from "@/components/contador";
import App from "@/components/tarjetas";
import React from "react";
import { StyleSheet } from "react-native";

export default function ClickerFn() {
  

  return (
    <App/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black", // fondo oscuro
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
    color: "white", // texto blanco
  },
});



