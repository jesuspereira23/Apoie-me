// app/(tabs)/orfanato/home.tsx
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Colors from "../../../constants/Colors";
import { supabase } from "../../../lib/supabase";

const CATEGORIAS = [
  { label: "Alimentos", value: "alimentos" },
  { label: "Higiene", value: "higiene" },
  { label: "Roupas", value: "roupas" },
  { label: "Financeiro", value: "financeiro" },
];

export default function OrfanatoHome() {
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handlePedirDoacao() {
    if (!categoria) {
      Alert.alert("Atenção", "Selecione o tipo de doação.");
      return;
    }
    if (!descricao.trim()) {
      Alert.alert("Atenção", "Descreva a necessidade.");
      return;
    }
    const qtd = parseInt(quantidade, 10);
    if (!qtd || qtd < 1) {
      Alert.alert("Atenção", "Informe uma quantidade válida.");
      return;
    }

    setLoading(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes?.user?.id;
      if (!userId) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      // Busca o id do orfanato vinculado ao usuário logado
      const { data: orfanato, error: orfanatoError } = await supabase
        .from("orfanatos")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (orfanatoError || !orfanato) {
        Alert.alert("Erro", "Orfanato não encontrado para este usuário.");
        return;
      }

      const { error } = await supabase.from("necessidades").insert({
        item: descricao.trim(),
        categoria,
        quantidade: qtd,
        status: "pendente",
        orfanato_id: orfanato.id,
      });

      if (error) throw error;

      Alert.alert("Sucesso", "Pedido de doação criado!", [
        {
          text: "Ver pedidos",
          onPress: () => (router.push as any)("/(tabs)/orfanato/necessidades"),
        },
        {
          text: "Novo pedido",
          onPress: () => {
            setCategoria("");
            setDescricao("");
            setQuantidade("1");
          },
        },
      ]);
    } catch (e: any) {
      console.warn("create error:", e?.message ?? e);
      Alert.alert("Erro", "Não foi possível criar o pedido.");
    } finally {
      setLoading(false);
    }
  }

  const categoriaLabel =
    CATEGORIAS.find((c) => c.value === categoria)?.label ?? "Ex: Roupas...";

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
        {/* Hero Banner — flutuante com bordas arredondadas */}
        <View style={styles.heroWrap}>
          <View style={styles.hero}>
            <View style={styles.heroContent}>
              <Text style={styles.heroText}>
                Juntos podemos{"\n"}transformar vidas{"\n"}e construir um{"\n"}futuro melhor.
              </Text>
            </View>
            <Image
              source={require("../../../assets/images/img-crianca-casa.png")}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Formulário */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>
            O que eu{"\n"}
            <Text style={styles.sectionTitleAccent}>Necessito?</Text>
          </Text>

          {/* Dropdown de categoria */}
          <Text style={styles.label}>Que tipo de Doação?</Text>
          <Pressable
            style={styles.dropdown}
            onPress={() => setDropdownOpen((v) => !v)}
          >
            <Text
              style={[
                styles.dropdownText,
                categoria ? styles.dropdownTextSelected : styles.dropdownPlaceholder,
              ]}
            >
              {categoriaLabel}
            </Text>
            <Text style={[styles.dropdownArrow, dropdownOpen && styles.dropdownArrowOpen]}>
              ›
            </Text>
          </Pressable>

          {dropdownOpen && (
            <View style={styles.dropdownList}>
              {CATEGORIAS.map((c) => (
                <Pressable
                  key={c.value}
                  style={[
                    styles.dropdownItem,
                    categoria === c.value && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setCategoria(c.value);
                    setDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      categoria === c.value && styles.dropdownItemTextActive,
                    ]}
                  >
                    {c.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Descrição */}
          <Text style={[styles.label, { marginTop: 14 }]}>Descrição</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Ex: Camisa Tamanho M, Azul, ..."
            placeholderTextColor="#9ca3af"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Quantidade */}
          <Text style={[styles.label, { marginTop: 14 }]}>Quantidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 5"
            placeholderTextColor="#9ca3af"
            value={quantidade}
            onChangeText={(v) => setQuantidade(v.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
          />

          {/* Botão */}
          <Pressable
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handlePedirDoacao}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? "Enviando..." : "Pedir Doação"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const VERDE = Colors.verdeAgua ?? "#4DBFA8";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f5f5" },
  scroll: { paddingBottom: 120 },

  /* ── Hero ── */
  heroWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  hero: {
    backgroundColor: VERDE,
    borderRadius: 20,
    minHeight: 160,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  heroContent: {
    flex: 1,
    paddingBottom: 20,
  },
  heroText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  heroImage: {
    width: 140,
    height: 160,
  },

  /* ── Formulário ── */
  formSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: 30,
    marginBottom: 18,
  },
  sectionTitleAccent: {
    color: VERDE,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ff8a00",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  /* Dropdown */
  dropdown: {
    height: 46,
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
  dropdownTextSelected: { color: "#1a1a1a" },
  dropdownPlaceholder: { color: "#9ca3af" },
  dropdownArrow: {
    fontSize: 20,
    color: "#9ca3af",
    transform: [{ rotate: "90deg" }],
  },
  dropdownArrowOpen: {
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f3f4f6",
  },
  dropdownItemActive: { backgroundColor: "#E6F9F0" },
  dropdownItemText: { fontSize: 14, color: "#374151" },
  dropdownItemTextActive: { color: VERDE, fontWeight: "700" },

  /* Input simples (quantidade) */
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#1a1a1a",
    backgroundColor: "#fff",
  },

  /* Textarea */
  textarea: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#1a1a1a",
    minHeight: 100,
    backgroundColor: "#fff",
  },

  /* Botão principal */
  btn: {
    backgroundColor: VERDE,
    borderRadius: 14,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  /* Link secundário */
  linkBtn: { alignItems: "center", paddingVertical: 8 },
  linkBtnText: { color: VERDE, fontWeight: "600", fontSize: 13 },
});