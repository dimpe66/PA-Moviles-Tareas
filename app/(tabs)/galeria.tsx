import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  Pressable,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { API_URL } from "../../constants/config"; // ajustá el path si hace falta

// El tipo se mantiene igual que tu mock
type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  // Puede ser require(...) o { uri: string }
  source: any;
};

// en la misma pantalla
const formatARS = (n: number) => {
  try {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);
  } catch {
    // Fallback: $ 12.345
    const s = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `$ ${s}`;
  }
};


const RESIZE_MODES = ["cover", "contain", "stretch", "center"] as const;
type ResizeMode = (typeof RESIZE_MODES)[number];

export default function Galeria() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Product | null>(null);
  const [resizeMode, setResizeMode] = useState<ResizeMode>("cover");

  // backend
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // modal "Nuevo producto"
  const [showNew, setShowNew] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formPrice, setFormPrice] = useState(""); // string para el TextInput
  const [formDesc, setFormDesc] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");

  // Cargar del backend
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error(`GET /products ${res.status}`);
      const data: Product[] = await res.json();
      // La API ya devuelve { source: { uri } } → listo para <Image />
      setProducts(data);
    } catch (e: any) {
      console.error(e);
      setErr("No se pudo cargar la lista de productos.");
    } finally {
      setLoading(false);
    }
  }

  async function createProduct() {
    // Validación mínima
    if (!formTitle.trim()) return Alert.alert("Falta título");
    const priceNum = Number(formPrice);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return Alert.alert("Precio inválido");
    }

    try {
      const body = {
        title: formTitle.trim(),
        price: priceNum,
        description: formDesc.trim(),
        // Enviamos string (URL); el backend lo guarda como string y lo devuelve como { uri }
        ...(formImageUrl.trim() ? { source: formImageUrl.trim() } : {}),
      };

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`POST /products ${res.status}`);
      const created: Product = await res.json();

      // Actualizar lista en memoria sin otro GET
      setProducts((prev) => [created, ...prev]);

      // Limpiar y cerrar
      setShowNew(false);
      setFormTitle("");
      setFormPrice("");
      setFormDesc("");
      setFormImageUrl("");
    } catch (e: any) {
      console.error(e);
      Alert.alert("No se pudo crear el producto");
    }
  }

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? products.filter((p) => p.title.toLowerCase().includes(q)) : products;
  }, [query, products]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Galería</Text>

        <Pressable
          onPress={() => setShowNew(true)}
          style={({ pressed }) => [styles.newBtn, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.newBtnText}>+ Nuevo</Text>
        </Pressable>
      </View>

      <TextInput
        placeholder="Buscar por título..."
        placeholderTextColor="#6f6f78"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {loading ? (
        <View style={{ paddingTop: 24 }}>
          <ActivityIndicator />
        </View>
      ) : err ? (
        <View style={{ paddingTop: 24 }}>
          <Text style={{ color: "#ff9b9b" }}>{err}</Text>
          <Pressable onPress={fetchProducts} style={styles.retryBtn}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => {
            const fav = favorites.has(item.id);
            return (
              <Pressable
                onPress={() => {
                  setSelected(item);
                  setResizeMode("cover");
                }}
                onLongPress={() => toggleFavorite(item.id)}
                style={({ pressed }) => [
                  styles.card,
                  fav && styles.cardFav,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View style={styles.thumbWrap}>
                  <Image source={item.source} style={styles.thumb} />
                  {fav && (
                    <View style={styles.starBadge}>
                      <Text style={styles.starText}>★</Text>
                    </View>
                  )}
                </View>

                <View style={styles.meta}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.price}>{formatARS(item.price)}</Text>

                </View>
              </Pressable>
            );
          }}
        />
      )}

      {/* Modal de detalle (igual que tu versión) */}
      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modal}>
          {selected && (
            <>
              <Image source={selected.source} style={styles.bigImage} resizeMode={resizeMode} />

              <Text style={styles.modalTitle}>{selected.title}</Text>
              <Text style={styles.modalDesc}>{selected.description}</Text>

              <View style={styles.resizeBar}>
                {RESIZE_MODES.map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => setResizeMode(m)}
                    style={({ pressed }) => [
                      styles.modeBtn,
                      resizeMode === m && styles.modeBtnActive,
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text
                      style={[styles.modeText, resizeMode === m && styles.modeTextActive]}
                    >
                      {m}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable onPress={() => setSelected(null)} style={styles.closeBtn}>
                <Text style={styles.closeText}>Cerrar</Text>
              </Pressable>
            </>
          )}
        </View>
      </Modal>

      {/* Modal: Nuevo producto */}
      <Modal visible={showNew} animationType="slide" onRequestClose={() => setShowNew(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modal}
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={styles.modalTitle}>Nuevo producto</Text>

            <TextInput
              placeholder="Título"
              placeholderTextColor="#6f6f78"
              value={formTitle}
              onChangeText={setFormTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Precio (número)"
              placeholderTextColor="#6f6f78"
              keyboardType="numeric"
              value={formPrice}
              onChangeText={setFormPrice}
              style={styles.input}
            />
            <TextInput
              placeholder="Descripción"
              placeholderTextColor="#6f6f78"
              value={formDesc}
              onChangeText={setFormDesc}
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              multiline
            />
            <TextInput
              placeholder="URL de imagen (opcional)"
              placeholderTextColor="#6f6f78"
              value={formImageUrl}
              onChangeText={setFormImageUrl}
              style={styles.input}
              autoCapitalize="none"
            />

            <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
              <Pressable onPress={() => setShowNew(false)} style={[styles.closeBtn, { backgroundColor: "#3a3a46" }]}>
                <Text style={styles.closeText}>Cancelar</Text>
              </Pressable>

              <Pressable onPress={createProduct} style={styles.closeBtn}>
                <Text style={styles.closeText}>Guardar</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const CARD_RADIUS = 14;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0b0b0c" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  header: { fontSize: 24, fontWeight: "700", color: "white", marginBottom: 8 },
  newBtn: {
    backgroundColor: "#2b2bf7",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  newBtnText: { color: "white", fontWeight: "700" },

  input: {
    backgroundColor: "#1a1a1d",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "white",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a2f",
  },

  card: {
    backgroundColor: "#141417",
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: "#24242a",
    overflow: "hidden",
  },
  cardFav: { borderColor: "#f0b90b" },

  thumbWrap: { position: "relative" },
  thumb: { width: "100%", height: 160 },

  starBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  starText: { color: "#f0b90b", fontSize: 18, fontWeight: "700" },

  meta: { padding: 12, gap: 4 },
  title: { color: "white", fontSize: 16, fontWeight: "600" },
  price: { color: "#a3a3ad", fontSize: 14 },

  modal: {
    flex: 1,
    backgroundColor: "#0b0b0c",
    padding: 16,
    justifyContent: "flex-start",
  },
  bigImage: {
    width: "100%",
    height: 280,
    backgroundColor: "#111114",
    borderRadius: CARD_RADIUS,
  },
  modalTitle: { marginTop: 12, color: "white", fontSize: 20, fontWeight: "700" },
  modalDesc: { marginTop: 6, color: "#c6c6cf", fontSize: 14 },

  resizeBar: { flexDirection: "row", gap: 8, marginTop: 14, flexWrap: "wrap" },
  modeBtn: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2a2a2f",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#141417",
  },
  modeBtnActive: { borderColor: "#5b5bf7", backgroundColor: "#1b1b29" },
  modeText: { color: "#c6c6cf", fontSize: 12, fontWeight: "600" },
  modeTextActive: { color: "white" },

  closeBtn: {
    marginTop: 18,
    alignSelf: "flex-start",
    backgroundColor: "#2b2bf7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  closeText: { color: "white", fontWeight: "700" },

  retryBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#2b2bf7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  retryText: { color: "white", fontWeight: "700" },
});
