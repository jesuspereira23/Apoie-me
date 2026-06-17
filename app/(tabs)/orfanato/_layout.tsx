// app/(tabs)/orfanato/_layout.tsx
import { Slot, router, useSegments } from "expo-router";
import React from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../../../constants/Colors";
import { useRequireRole } from "../../../hooks/useRequireRole";
import imgCriancaCasa from "../../assets/images/img-familia.png"; // ajuste o caminho se necessário

export default function OrfanatoLayoutWrapper() {
  useRequireRole("orfanato");
  return <OrfanatoLayout />;
}

function OrfanatoLayout() {
  return (
    <View style={styles.root}>
      <TopIllustration />
      <View style={styles.content}>
        <Slot />
      </View>
      <TabBar />
    </View>
  );
}

function TopIllustration() {
  return (
    <View style={styles.topIllustrationWrap}>
      <View style={styles.topIllustrationInner}>
        <Image source={imgCriancaCasa} style={styles.illustration} resizeMode="cover" />
        <Pressable style={styles.bell}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

function TabBar() {
  const segments = useSegments();
  const active = segments?.[segments.length - 1] ?? "home";
  const go = (path: string) => (router.replace as any)(path);

  return (
    <View style={styles.tabBar}>
      <Pressable style={styles.tabItem} onPress={() => go("/(tabs)/orfanato/home")}>
        <Ionicons
          name={active === "home" ? "home" : "home-outline"}
          size={22}
          color={active === "home" ? "#ffffff" : "#fff"}
        />
        <Text style={[styles.tabText, active === "home" && styles.tabActive]}>Início</Text>
      </Pressable>

      <Pressable style={styles.tabItem} onPress={() => go("/(tabs)/orfanato/doacoes-recebidas")}>
        <Ionicons
          name={active === "doacoes-recebidas" ? "gift" : "gift-outline"}
          size={22}
          color={active === "doacoes-recebidas" ? "#ffffff" : "#fff"}
        />
        <Text style={[styles.tabText, active === "doacoes-recebidas" && styles.tabActive]}>Doações Recebidas</Text>
      </Pressable>

      <Pressable style={styles.tabItem} onPress={() => go("/(tabs)/orfanato/profile")}>
        <Ionicons
          name={active === "profile" ? "person" : "person-outline"}
          size={22}
          color={active === "profile" ? "#ffffff" : "#fff"}
        />
        <Text style={[styles.tabText, active === "profile" && styles.tabActive]}>Perfil</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  topIllustrationWrap: {
    backgroundColor: Colors.verdeAgua,
    paddingTop: Platform.OS === "ios" ? 56 : 24,
    paddingBottom: 6,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  topIllustrationInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  illustration: { width: 92, height: 92, borderRadius: 12 },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  content: { flex: 1, backgroundColor: "#fff" },

  tabBar: {
    height: 72,
    borderTopWidth: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.verdeAgua,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 6,
  },
  tabItem: { alignItems: "center", justifyContent: "center" },
  tabText: { color: "#fff", fontSize: 12, marginTop: 4 },
  tabActive: { color:"#fff", fontWeight: "700" },
});
