// app/(tabs)/doador/minhas-doacoes.tsx
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "../../../constants/Colors";
import { supabase } from "../../../lib/supabase";

type Orfanato = {
  id: string;
  nome?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
};

type Necessidade = {
  id: string;
  item: string;
  categoria: string;
  quantidade: number;
  status: string;
  orfanato_id?: string;
  orfanato?: Orfanato;
};

type Doacao = {
  id: string;
  doador_id?: string;
  necessidade_id?: string;
  quantidade: number;
  created_at?: string;
  necessidade?: Necessidade;
};

const CATEGORIA_LABEL: Record<string, string> = {
  alimentos: "Alimentos",
  higiene: "Higiene",
  roupas: "Roupas",
  financeiro: "Financeiro",
};

export default function MinhasDoacoes() {
  const [data, setData] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchMyDonations() {
    setLoading(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes?.user?.id;
      if (!userId) { setData([]); return; }

      // Busca o doador vinculado ao usuário
      const { data: doador } = await supabase
        .from("doadores")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!doador) { setData([]); return; }

      const { data: rows, error } = await supabase
        .from("doacoes")
        .select(`
          id, doador_id, necessidade_id, quantidade, created_at,
          necessidade:necessidades(
            id, item, categoria, quantidade, status, orfanato_id,
            orfanato:orfanatos(id, nome, endereco, telefone, email)
          )
        `)
        .eq("doador_id", doador.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setData((rows ?? []) as unknown as Doacao[]);
    } catch (e: any) {
      console.warn("fetchMyDonations error:", e?.message ?? e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMyDonations(); }, []);

  function renderItem({ item }: { item: Doacao }) {
    const nec = item.necessidade;
    const org = nec?.orfanato ?? ({} as Orfanato);
    const nome = org.nome ?? nec?.item ?? "Doação";
    const endereco = org.endereco ?? null;
    const categoria = nec?.categoria ?? "";
    const catLabel = CATEGORIA_LABEL[categoria] ?? categoria;

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          (router.push as any)(`/(doador)/doacao/${nec?.id ?? item.necessidade_id}`)
        }
      >
        <Text style={styles.cardName}>{nome}</Text>

        {endereco ? (
          <Text style={styles.cardEndereco}>Endereço: {endereco}</Text>
        ) : null}

        <Text style={styles.cardVoceDou}>Você doou:</Text>

        {catLabel ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{catLabel}</Text>
          </View>
        ) : null}
      </Pressable>
    );
  }

  return (
    <View style={styles.root}>
      {loading ? (
        <ActivityIndicator color={Colors.verdeAgua} style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(d) => d.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>Você ainda não fez doações.</Text>
          }
          refreshing={loading}
          onRefresh={fetchMyDonations}
        />
      )}

      {/* Ilustração flutuante no canto inferior direito */}
      <Image
        source={require("../../../assets/images/img-crianca-casa.png")}
        style={styles.illustration}
        resizeMode="contain"
        pointerEvents="none"
      />
    </View>
  );
}

const VERDE = Colors.verdeAgua ?? "#4DBFA8";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 240,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  cardEndereco: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 10,
  },
  cardVoceDou: {
    fontSize: 13,
    color: VERDE,
    fontWeight: "600",
    marginBottom: 6,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#ff8a00",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  empty: {
    textAlign: "center",
    marginTop: 48,
    color: "#9ca3af",
    fontSize: 14,
  },

  /* Ilustração flutuante */
  illustration: {
    position: "absolute",
    right: 0,
    bottom: Platform.OS === "ios" ? 80 : 16,
    width: 210,
    height: 210,
    pointerEvents: "none",
  },
});