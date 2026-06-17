// app/(tabs)/doador/home.tsx
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
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
  created_at: string;
  orfanato_id?: string;
  orfanato?: Orfanato;
};

const FILTROS = ["todos", "alimentos", "higiene", "roupas", "financeiro"];

const CATEGORIA_LABEL: Record<string, string> = {
  alimentos: "Alimentos",
  higiene: "Higiene",
  roupas: "Roupas",
  financeiro: "Financeiro",
};

export default function DoadorHome() {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [data, setData] = useState<Necessidade[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchNeeds() {
    setLoading(true);
    try {
      let q = supabase
        .from("necessidades")
        .select(
          `id,item,categoria,quantidade,status,created_at,orfanato_id,
           orfanato:orfanatos(id,nome,endereco,telefone,email)`
        )
        .eq("status", "pendente");

      if (categoria) q = q.eq("categoria", categoria);
      if (query) q = q.ilike("item", `%${query}%`);

      const { data: rows, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      setData((rows ?? []) as unknown as Necessidade[]);
    } catch (e: any) {
      console.warn("fetchNeeds error:", e?.message ?? e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchNeeds(); }, [categoria, query]);

  function renderItem({ item }: { item: Necessidade }) {
    const org = item.orfanato ?? ({} as Orfanato);
    const catLabel = CATEGORIA_LABEL[item.categoria] ?? item.categoria;

    return (
      <View style={styles.card}>
        <Text style={styles.cardName}>{org.nome ?? item.item}</Text>

        {org.endereco ? (
          <Text style={styles.cardMeta}>Endereço: {org.endereco}</Text>
        ) : null}
        {org.telefone ? (
          <Text style={styles.cardMeta}>Telefone: {org.telefone}</Text>
        ) : null}
        {org.email ? (
          <Text style={styles.cardMeta}>E-mail: {org.email}</Text>
        ) : null}

        <Text style={styles.cardDoe}>Doe:</Text>

        {catLabel ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{catLabel}</Text>
          </View>
        ) : null}

        <Pressable
          style={styles.apoiarBtn}
          onPress={() => (router.push as any)(`/doador/doacao/${item.id}`)}
        >
          <Text style={styles.apoiarBtnText}>Apoiar agora</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Busca */}
      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Buscar"
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={setQuery}
          style={styles.search}
          returnKeyType="search"
        />
      </View>

      {/* Filtros */}
      <View style={styles.filtersWrap}>
        <FlatList
          data={FILTROS}
          keyExtractor={(f) => f}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: f }) => {
            const active = (f === "todos" && categoria === null) || categoria === f;
            return (
              <Pressable
                onPress={() => setCategoria(f === "todos" ? null : f)}
                style={[styles.filterBtn, active && styles.filterBtnActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </Pressable>
            );
          }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        />
      </View>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} color={Colors.verdeAgua} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={fetchNeeds}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhuma necessidade encontrada</Text>
          }
        />
      )}
    </View>
  );
}

const VERDE = Colors.verdeAgua ?? "#4DBFA8";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f5f5" },

  /* Busca */
  searchWrap: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 44,
  },
  search: {
    flex: 1,
    fontSize: 14,
    color: "#1a1a1a",
  },

  /* Filtros */
  filtersWrap: { marginBottom: 12 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterBtnActive: {
    backgroundColor: "#ff8a00",
    borderColor: "#ff8a00",
  },
  filterText: { fontSize: 13, fontWeight: "700", color: "#6b7280" },
  filterTextActive: { color: "#fff" },

  /* Lista */
  list: { paddingHorizontal: 16, paddingBottom: 120 },

  /* Card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  cardMeta: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 2,
  },
  cardDoe: {
    fontSize: 13,
    color: VERDE,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#ff8a00",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  /* Botão Apoiar */
  apoiarBtn: {
    backgroundColor: VERDE,
    borderRadius: 12,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  apoiarBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  empty: {
    textAlign: "center",
    marginTop: 48,
    color: "#9ca3af",
    fontSize: 14,
  },
});