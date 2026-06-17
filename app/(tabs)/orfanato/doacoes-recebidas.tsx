// app/(tabs)/orfanato/doacoes-recebidas.tsx
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Colors from "../../../constants/Colors";
import { supabase } from "../../../lib/supabase";

type Doacao = {
  id: string;
  quantidade: number;
  created_at: string;
  doador: {
    nome: string;
    telefone: string | null;
  };
  necessidade: {
    item: string;
    categoria: string | null;
  };
};

const CATEGORIA_LABEL: Record<string, string> = {
  alimentos: "Alimentos",
  higiene: "Higiene",
  roupas: "Roupas",
  financeiro: "Financeiro",
};

export default function DoacoesRecebidas() {
  const [data, setData] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchDoacoes(isRefresh = false) {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      // Busca o orfanato do usuário logado
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes?.user?.id;
      if (!userId) return;

      const { data: orfanato } = await supabase
        .from("orfanatos")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!orfanato) return;

      // Busca doações vinculadas às necessidades deste orfanato
      const { data: rows, error } = await supabase
        .from("doacoes")
        .select(`
          id,
          quantidade,
          created_at,
          doador:doadores ( nome, telefone ),
          necessidade:necessidades ( item, categoria )
        `)
        .eq("necessidades.orfanato_id", orfanato.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setData((rows ?? []) as unknown as Doacao[]);
    } catch (e: any) {
      console.warn("fetchDoacoes error:", e?.message ?? e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchDoacoes(); }, []);

  function renderItem({ item }: { item: Doacao }) {
    const categoria = item.necessidade?.categoria ?? "";
    const categoriaLabel = CATEGORIA_LABEL[categoria] ?? categoria;

    return (
      <View style={styles.card}>
        <Text style={styles.cardName}>{item.doador?.nome ?? "—"}</Text>
        {item.doador?.telefone ? (
          <Text style={styles.cardPhone}>Telefone: {item.doador.telefone}</Text>
        ) : null}
        <Text style={styles.cardDoou}>Ele Doou:</Text>
        {categoriaLabel ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{categoriaLabel}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.verdeAgua} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma doação recebida ainda.</Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchDoacoes(true)}
            colors={[Colors.verdeAgua]}
            tintColor={Colors.verdeAgua}
          />
        }
      />
    </View>
  );
}

const VERDE = Colors.verdeAgua ?? "#4DBFA8";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
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
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  cardPhone: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  cardDoou: {
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
});