import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CardProps = { text: string };

const randomHex = () => {
  const n = Math.floor(Math.random() * 0xffffff);
  return `#${n.toString(16).padStart(6, "0")}`;
};

function Card({ text }: CardProps) {
  const [bg, setBg] = useState("#ffffff");
  const [fg, setFg] = useState("#000000");

  const changeColors = () => {
    setBg(randomHex());
    setFg(randomHex());
  };

  return (
    <Pressable style={[styles.card, { backgroundColor: bg }]} onPress={changeColors}>
      <Text style={[styles.cardText, { color: fg }]}>{text}</Text>
    </Pressable>
  );
}

export default function App() {
  const items = ["Card 1", "Card 2", "Card 3", "Card 4"];

  return (
    <View style={styles.container}>
      <Card text = "Card 1"/>
      <Card text = "Card 2"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: "gray",
  },
  card: {
    width: 220,
    height: 90,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
  },
});