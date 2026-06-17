// app/(tabs)/doador/_layout.tsx
import { Slot, router, useSegments } from "expo-router";
import React from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../../../constants/Colors";
import { useRequireRole } from "../../../hooks/useRequireRole";
import imgFamilia from "../../assets/images/img-familia.png"; // ajuste se necessário

export default function DoadorLayoutWrapper() {
  useRequireRole("doador");
  return <DoadorLayout />;
}

function DoadorLayout() {
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
        <Image source={imgFamilia} style={styles.illustration} resizeMode="cover" />
        <Pressable style={styles.bell}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

function TabBar() {
  const segments = useSegments();
  const active = segments[1] ?? "home";
  const go = (path: string) => (router.replace as any)(path);

  return (
    <View style={styles.tabBar}>
      <Pressable style={styles.tabItem} onPress={() => go("/doador/home")}>
        <Ionicons name={active === "home" ? "home" : "home-outline"} size={22} color={active === "home" ? Colors.verdeAgua : "#fff"} />
        <Text style={[styles.tabText, active === "home" && styles.tabActive]}>Início</Text>
      </Pressable>

      <Pressable style={styles.tabItem} onPress={() => go("/doador/minhas-doacoes")}>
        <Ionicons name={active === "minhas-doacoes" ? "gift" : "gift-outline"} size={22} color={active === "minhas-doacoes" ? Colors.verdeAgua : "#fff"} />
        <Text style={[styles.tabText, active === "minhas-doacoes" && styles.tabActive]}>Doações</Text>
      </Pressable>

      <Pressable style={styles.tabItem} onPress={() => go("/doador/profile")}>
        <Ionicons name={active === "profile" ? "person" : "person-outline"} size={22} color={active === "profile" ? Colors.verdeAgua : "#fff"} />
        <Text style={[styles.tabText, active === "profile" && styles.tabActive]}>Perfil</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  /* Top illustration area (fundo teal) */
  topIllustrationWrap: {
    backgroundColor: "#0ea5a4",
    paddingTop: Platform.OS === "ios" ? 56 : 24,
    paddingBottom: 2,
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
  topTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginLeft: 12, flex: 1, marginHorizontal: 12 },

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
  tabActive: { color: Colors.verdeAgua, fontWeight: "700" },
});
