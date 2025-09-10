import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function EjemploModal() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("Nombre Apellido");

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: "black" }]}>{name}</Text>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.text}>Cambiar Nombre</Text>
      </Pressable>

      <Modal
        transparent={true}      // que se vea el fondo oscuro
        visible={visible}       // si se muestra o no
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Aqui abajo puedes cambiarlo</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre aquí"
              placeholderTextColor="#888"
              value={name}                 // lo que se ve en el input
              onChangeText={setName}       // actualiza el estado cuando escribís
            />
            <Pressable style={[styles.button, { marginTop: 20 }]} onPress={() => setVisible(false)}>
              <Text style={styles.text}>Guardar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  button: { backgroundColor: "blue", padding: 12, borderRadius: 8 },
  text: { color: "white" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalCard: { backgroundColor: "white", padding: 20, borderRadius: 12, width: "80%", alignItems: "center" },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
});