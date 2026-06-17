// app/(doador)/doacao/[id].tsx
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Colors from "../../../../constants/Colors";
import { supabase } from "../../../../lib/supabase";

type Necessidade = {
  id: string;
  item: string;
  categoria: string;
  quantidade: number;
  orfanato?: { nome?: string };
};

const CATEGORIAS = [
  { label: "Alimentos", value: "alimentos" },
  { label: "Higiene", value: "higiene" },
  { label: "Roupas", value: "roupas" },
  { label: "Financeiro", value: "financeiro" },
];

const MODOS = [
  { label: "Entrega", value: "entrega" },
  { label: "Retirada", value: "retirada" },
];

const DATAS = [
  { label: "Próxima semana", value: "proxima_semana" },
  { label: "Em 15 dias", value: "em_15_dias" },
  { label: "Em 1 mês", value: "em_1_mes" },
];

type DropdownKey = "categoria" | "modo" | "data";

export default function DoacaoForm() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [necessidade, setNecessidade] = useState<Necessidade | null>(null);
  const [loadingNec, setLoadingNec] = useState(true);

  const [categoria, setCategoria] = useState("");
  const [modo, setModo] = useState("");
  const [data, setData] = useState("");
  const [telefone, setTelefone] = useState("");
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNecessidade() {
      try {
        const { data: row, error } = await supabase
          .from("necessidades")
          .select("id, item, categoria, quantidade, orfanato:orfanatos(nome)")
          .eq("id", id)
          .single();
        if (error) throw error;
        setNecessidade(row as unknown as Necessidade);
        if (row?.categoria) setCategoria(row.categoria);
      } catch (e: any) {
        console.warn("fetchNecessidade:", e?.message ?? e);
      } finally {
        setLoadingNec(false);
      }
    }
    if (id) fetchNecessidade();
  }, [id]);

  function toggleDropdown(key: DropdownKey) {
    setOpenDropdown((prev) => (prev === key ? null : key));
  }

  async function handleEnviar() {
    if (!categoria) { Alert.alert("Atenção", "Selecione o que vai doar."); return; }
    if (!modo) { Alert.alert("Atenção", "Selecione como vai doar."); return; }
    if (!data) { Alert.alert("Atenção", "Selecione a data estimada."); return; }
    if (!telefone.trim()) { Alert.alert("Atenção", "Informe seu telefone."); return; }

    setLoading(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes?.user?.id;
      if (!userId) { Alert.alert("Erro", "Usuário não autenticado."); return; }

      // Busca o doador vinculado ao usuário
      const { data: doador, error: doadorError } = await supabase
        .from("doadores")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (doadorError || !doador) {
        Alert.alert("Erro", "Doador não encontrado para este usuário.");
        return;
      }

      const { error } = await supabase.from("doacoes").insert({
        doador_id: doador.id,
        necessidade_id: id,
        quantidade: necessidade?.quantidade ?? 1,
        modo_entrega: modo,
        data_estimada: dataEstimadaISO(data),
        telefone_contato: telefone.trim(),
      });

      if (error) throw error;

      Alert.alert("Doação enviada!", "Obrigado pelo seu apoio.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      console.warn("enviar doacao:", e?.message ?? e);
      Alert.alert("Erro", "Não foi possível enviar a doação.");
    } finally {
      setLoading(false);
    }
  }

  function dataEstimadaISO(valor: string): string {
    const hoje = new Date();
    if (valor === "proxima_semana") hoje.setDate(hoje.getDate() + 7);
    else if (valor === "em_15_dias") hoje.setDate(hoje.getDate() + 15);
    else if (valor === "em_1_mes") hoje.setMonth(hoje.getMonth() + 1);
    return hoje.toISOString().split("T")[0];
  }

  if (loadingNec) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.verdeAgua} />
      </View>
    );
  }

  const orfanatoNome = necessidade?.orfanato?.nome ?? "Orfanato";
  const categoriaLabel = CATEGORIAS.find((c) => c.value === categoria)?.label ?? "Ex: Roupas...";
  const modoLabel = MODOS.find((m) => m.value === modo)?.label ?? "Ex: Entrega ...";
  const dataLabel = DATAS.find((d) => d.value === data)?.label ?? "Ex: Próxima semana,...";

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Nome do orfanato */}
        <Text style={styles.orfanatoNome}>{orfanatoNome}</Text>

        {/* O que vai doar */}
        <Text style={styles.label}>O que vai doar?</Text>
        <Pressable style={styles.dropdown} onPress={() => toggleDropdown("categoria")}>
          <Text style={categoria ? styles.dropdownText : styles.dropdownPlaceholder}>
            {categoriaLabel}
          </Text>
          <Text style={[styles.arrow, openDropdown === "categoria" && styles.arrowOpen]}>›</Text>
        </Pressable>
        {openDropdown === "categoria" && (
          <View style={styles.dropdownList}>
            {CATEGORIAS.map((c) => (
              <Pressable
                key={c.value}
                style={[styles.dropdownItem, categoria === c.value && styles.dropdownItemActive]}
                onPress={() => { setCategoria(c.value); setOpenDropdown(null); }}
              >
                <Text style={[styles.dropdownItemText, categoria === c.value && styles.dropdownItemTextActive]}>
                  {c.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Como vai doar */}
        <Text style={[styles.label, { marginTop: 16 }]}>Como vai doar?</Text>
        <Pressable style={styles.dropdown} onPress={() => toggleDropdown("modo")}>
          <Text style={modo ? styles.dropdownText : styles.dropdownPlaceholder}>
            {modoLabel}
          </Text>
          <Text style={[styles.arrow, openDropdown === "modo" && styles.arrowOpen]}>›</Text>
        </Pressable>
        {openDropdown === "modo" && (
          <View style={styles.dropdownList}>
            {MODOS.map((m) => (
              <Pressable
                key={m.value}
                style={[styles.dropdownItem, modo === m.value && styles.dropdownItemActive]}
                onPress={() => { setModo(m.value); setOpenDropdown(null); }}
              >
                <Text style={[styles.dropdownItemText, modo === m.value && styles.dropdownItemTextActive]}>
                  {m.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Data estimada */}
        <Text style={[styles.label, { marginTop: 16 }]}>Data da Estimada da Entrega.</Text>
        <Pressable style={styles.dropdown} onPress={() => toggleDropdown("data")}>
          <Text style={data ? styles.dropdownText : styles.dropdownPlaceholder}>
            {dataLabel}
          </Text>
          <Text style={[styles.arrow, openDropdown === "data" && styles.arrowOpen]}>›</Text>
        </Pressable>
        {openDropdown === "data" && (
          <View style={styles.dropdownList}>
            {DATAS.map((d) => (
              <Pressable
                key={d.value}
                style={[styles.dropdownItem, data === d.value && styles.dropdownItemActive]}
                onPress={() => { setData(d.value); setOpenDropdown(null); }}
              >
                <Text style={[styles.dropdownItemText, data === d.value && styles.dropdownItemTextActive]}>
                  {d.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Telefone */}
        <Text style={[styles.label, { marginTop: 16 }]}>Número de telefone, para contato.</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: (88) 993..."
          placeholderTextColor="#9ca3af"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        {/* Botões */}
        <View style={styles.actions}>
          <Pressable style={styles.btnVoltar} onPress={() => router.back()}>
            <Text style={styles.btnVoltarText}>Voltar</Text>
          </Pressable>

          <Pressable
            style={[styles.btnEnviar, loading && styles.btnDisabled]}
            onPress={handleEnviar}
            disabled={loading}
          >
            <Text style={styles.btnEnviarText}>
              {loading ? "Enviando..." : "Enviar Doação"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const VERDE = Colors.verdeAgua ?? "#4DBFA8";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 120 },

  orfanatoNome: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 24,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ff8a00",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  /* Dropdown */
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  dropdownText: { fontSize: 14, color: "#1a1a1a" },
  dropdownPlaceholder: { fontSize: 14, color: "#9ca3af" },
  arrow: {
    fontSize: 22,
    color: "#9ca3af",
    transform: [{ rotate: "90deg" }],
  },
  arrowOpen: {
    transform: [{ rotate: "-90deg" }],
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginTop: 4,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  dropdownItem: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f3f4f6",
  },
  dropdownItemActive: { backgroundColor: "#E6F9F0" },
  dropdownItemText: { fontSize: 14, color: "#374151" },
  dropdownItemTextActive: { color: VERDE, fontWeight: "700" },

  /* Input telefone */
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#1a1a1a",
    backgroundColor: "#fff",
  },

  /* Botões */
  actions: { marginTop: 32, gap: 12 },
  btnVoltar: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
  },
  btnVoltarText: { color: VERDE, fontWeight: "700", fontSize: 15 },
  btnEnviar: {
    height: 50,
    borderRadius: 12,
    backgroundColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: { opacity: 0.6 },
  btnEnviarText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});