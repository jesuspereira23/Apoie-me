// app/(tabs)/doador/perfil.tsx
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Colors from "../../../constants/Colors";
import { supabase } from "../../../lib/supabase";

type Doador = {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  empresa?: boolean;
};

export default function DoadorProfile() {
  const [doador, setDoador] = useState<Doador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser();
        const userId = userRes?.user?.id;
        if (!userId) return;

        const { data, error } = await supabase
          .from("doadores")
          .select("id, nome, email, telefone, empresa")
          .eq("user_id", userId)
          .single();

        if (error) throw error;
        setDoador(data as Doador);
      } catch (e: any) {
        console.warn("fetchDoador:", e?.message ?? e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleLogout() {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await supabase.auth.signOut();
            (router.replace as any)("/login");
          } catch (e: any) {
            Alert.alert("Erro", e?.message ?? "Não foi possível sair");
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.verdeAgua} />
      </View>
    );
  }

  const iniciais = doador?.nome
    ? doador.nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "?";

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scroll}>
      {/* Nome */}
      <Text style={styles.nome}>{doador?.nome ?? "—"}</Text>

      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciais}</Text>
        </View>
        <Pressable
          style={styles.editIcon}
          onPress={() => (router.push as any)("/(doador)/editar-perfil")}
        >
          <Text style={styles.editIconText}>✏️</Text>
        </Pressable>
      </View>

      {/* Dados */}
      <View style={styles.infoSection}>
        {doador?.telefone ? (
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Telefone</Text>
            <Text style={styles.infoValue}>{doador.telefone}</Text>
          </View>
        ) : null}

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>E-mail</Text>
          <Text style={styles.infoValue}>{doador?.email ?? "—"}</Text>
        </View>
      </View>

      {/* Botões */}
      <View style={styles.actions}>
        <Pressable
          style={styles.btnEditar}
          onPress={() => (router.push as any)("/(doador)/editar-perfil")}
        >
          <Text style={styles.btnEditarText}>Editar Perfil</Text>
        </Pressable>

        <Pressable style={styles.btnSair} onPress={handleLogout}>
          <Text style={styles.btnSairText}>Sair da Conta</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const VERDE = Colors.verdeAgua ?? "#4DBFA8";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f5f5" },
  scroll: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  nome: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 24,
  },

  /* Avatar */
  avatarWrap: {
    alignSelf: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#1a3a4a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "700",
  },
  editIcon: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ff8a00",
    alignItems: "center",
    justifyContent: "center",
  },
  editIconText: { fontSize: 13 },

  /* Info */
  infoSection: { gap: 20, marginBottom: 40 },
  infoBlock: {},
  infoLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: "#4b5563",
  },

  /* Botões */
  actions: { gap: 12 },
  btnEditar: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  btnEditarText: {
    color: VERDE,
    fontWeight: "700",
    fontSize: 15,
  },
  btnSair: {
    height: 50,
    borderRadius: 12,
    backgroundColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSairText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});