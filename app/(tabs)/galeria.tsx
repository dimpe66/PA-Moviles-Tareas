import React, { useMemo, useState } from "react";
import {View,Text,Image,TextInput,FlatList,Pressable,Modal,StyleSheet,} from "react-native";

type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  // Puede ser require(...) o { uri: string }
  source: any;
};

const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Auriculares Pro",
    price: 39999,
    description:
      "Auriculares inalámbricos con cancelación activa de ruido y hasta 30h de batería.",
    source: require("../../assets/products/auriculares.jpg"),
  },
  {
    id: "2",
    title: "Smartwatch",
    price: 59999,
    description:
      "Reloj inteligente con GPS, monitoreo de salud y resistencia al agua.",
    source: {
      uri: "https://www.apple.com/newsroom/images/2023/09/apple-introduces-the-advanced-new-apple-watch-series-9/article/Apple-Watch-S9-display-2000-nits-230912_big.jpg.large_2x.jpg",
    },
  },
  {
    id: "3",
    title: "Cámara Mirrorless",
    price: 279999,
    description:
      "Sensor APS-C, video 4K y enfoque automático rápido. Ideal para creadores.",
    source: {
      uri: "https://filmadorasperu.com/cdn/shop/articles/BLOGS_6_74db71ef-8f57-4c5a-a2c2-370f398a6dbc.png?v=1740515539&width=1000",
    },
  },
];

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const RESIZE_MODES = ["cover", "contain", "stretch", "center"] as const;
type ResizeMode = (typeof RESIZE_MODES)[number];

export default function Galeria() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Product | null>(null);
  const [resizeMode, setResizeMode] = useState<ResizeMode>("cover");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? PRODUCTS.filter((p) => p.title.toLowerCase().includes(q))
      : PRODUCTS;
  }, [query]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Galería</Text>

      <TextInput
        placeholder="Buscar por título..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
      />

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
                <Text style={styles.price}>{currency.format(item.price)}</Text>
              </View>
            </Pressable>
          );
        }}
      />

      {/* Modal de detalle */}
      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modal}>
          {selected && (
            <>
              <Image
                source={selected.source}
                style={styles.bigImage}
                resizeMode={resizeMode}
              />

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
                      style={[
                        styles.modeText,
                        resizeMode === m && styles.modeTextActive,
                      ]}
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
    </View>
  );
}

const CARD_RADIUS = 14;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0b0b0c" },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
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
  cardFav: {
    borderColor: "#f0b90b",
  },

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
  modalTitle: {
    marginTop: 12,
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  modalDesc: {
    marginTop: 6,
    color: "#c6c6cf",
    fontSize: 14,
  },

  resizeBar: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    flexWrap: "wrap",
  },
  modeBtn: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2a2a2f",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#141417",
  },
  modeBtnActive: {
    borderColor: "#5b5bf7",
    backgroundColor: "#1b1b29",
  },
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
});
