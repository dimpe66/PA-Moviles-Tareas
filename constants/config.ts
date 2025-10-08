// constants/config.ts
import { Platform } from "react-native";

// ⚠️ REEMPLAZÁ esta IP por la de tu PC en la LAN si vas a usar el teléfono
const FALLBACK_IP = "http://192.168.0.48:3001";

const FALLBACK =
  Platform.OS === "android" ? "http://10.0.2.2:3001" : FALLBACK_IP;

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || FALLBACK).replace(
  /\/+$/,
  ""
);

// Validación en tiempo de ejecución (ayuda a detectar .env no cargado)
if (!API_URL.startsWith("http")) {
  console.error(`API_URL inválida: "${API_URL}"`);
  throw new Error(
    `API_URL inválida. Revisá .env (EXPO_PUBLIC_API_URL) o constants/config.ts`
  );
}
