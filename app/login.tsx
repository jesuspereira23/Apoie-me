import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import { supabase } from "../lib/supabase";
import { loginSchema, type LoginForm } from "../lib/validation";
import { replaceWithRetry } from "../utils/navigation";


export default function LoginScreen() {
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  // ref para o bottom sheet
  const modalizeRef = useRef<Modalize>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", senha: "" },
  });

  const darkGreen = (Colors as any).verdeAguaEscuro ?? Colors.verdeAgua;

  function openRegisterSheet() {
    modalizeRef.current?.open();
  }

  function closeRegisterSheet() {
    modalizeRef.current?.close();
  }

  function goToOrfanato() {
    closeRegisterSheet();
    router.push("/signup/orfanato");
  }

  function goToDoador() {
    closeRegisterSheet();
    router.push("/signup/doador");
  }

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    try {
      // 1) Autentica no Supabase
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.senha,
      });

      if (signInError) {
        Alert.alert("Erro ao entrar", signInError.message);
        return;
      }

      const userId = authData.user?.id;
      if (!userId) {
        Alert.alert("Erro", "Não foi possível obter o identificador do usuário.");
        return;
      }

      // 2) Verifica se existe registro na tabela doadores
      const { data: doadorData, error: doadorError } = await supabase
        .from("doadores")
        .select("id, user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (doadorError) {
        console.warn("Erro ao consultar doadores:", doadorError.message);
      }

      if (doadorData) {
        // Redireciona para a área do doador (apoiador)
        await replaceWithRetry("/(tabs)/doador/home");
        return;
      }

      // 3) Verifica se existe registro na tabela orfanatos
      const { data: orfanatoData, error: orfanatoError } = await supabase
        .from("orfanatos")
        .select("id, user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (orfanatoError) {
        console.warn("Erro ao consultar orfanatos:", orfanatoError.message);
      }

      if (orfanatoData) {
        // Redireciona para a área do orfanato
        await replaceWithRetry("/(tabs)/orfanato/home");
        return;
      }

      // 4) Se não encontrado em nenhuma tabela
      Alert.alert(
        "Atenção",
        "Login efetuado, mas não foi encontrado um perfil associado (doador ou orfanato)."
      );
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ImageBackground
        source={require("../assets/images/background.png")}
        style={styles.background}
        imageStyle={{ resizeMode: "cover" }}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 24}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
              <Pressable
                onPress={() => router.back()}
                style={styles.backButtonLeft}
                hitSlop={8}
                accessibilityLabel="Voltar"
              >
                <MaterialIcons name="arrow-back" size={20} color={Colors.verdeAgua} />
              </Pressable>

              <Image
                source={require("../assets/images/logo-sbg.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>Seja Bem Vindo{"\n"}De Volta!!!</Text>

              <View style={styles.card}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>E-mail</Text>
                      <View style={styles.inputWrapper}>
                        <MaterialIcons
                          name="email"
                          size={20}
                          color={Colors.verdeAgua}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={[
                            styles.input,
                            errors.email ? styles.inputErrorBorder : null,
                          ]}
                          placeholder="Digite seu e-mail"
                          placeholderTextColor="#9ca3af"
                          value={value}
                          onChangeText={onChange}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          returnKeyType="next"
                        />
                      </View>
                      {errors.email && (
                        <Text style={styles.errorText}>{errors.email.message}</Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="senha"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Senha</Text>
                      <View style={styles.inputWrapper}>
                        <MaterialIcons
                          name="lock"
                          size={20}
                          color={Colors.verdeAgua}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={[
                            styles.input,
                            { paddingRight: 48 },
                            errors.senha ? styles.inputErrorBorder : null,
                          ]}
                          placeholder="Digite sua senha"
                          placeholderTextColor="#9ca3af"
                          value={value}
                          onChangeText={onChange}
                          secureTextEntry={!senhaVisivel}
                          returnKeyType="done"
                          onSubmitEditing={handleSubmit(onSubmit)}
                        />
                        <Pressable
                          style={styles.eyeButton}
                          onPress={() => setSenhaVisivel(!senhaVisivel)}
                        >
                          <MaterialIcons
                            name={senhaVisivel ? "visibility" : "visibility-off"}
                            size={20}
                            color="#6b7280"
                          />
                        </Pressable>
                      </View>
                      {errors.senha && (
                        <Text style={styles.errorText}>{errors.senha.message}</Text>
                      )}
                    </View>
                  )}
                />

                <Pressable
                  style={[
                    styles.button,
                    { backgroundColor: isValid ? darkGreen : Colors.verdeAgua },
                    (!isValid || loading) ? styles.buttonDisabled : null,
                  ]}
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading || !isValid}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Entrar</Text>
                  )}
                </Pressable>

                <Pressable style={styles.secondaryButton} onPress={openRegisterSheet}>
                  <Text style={styles.secondaryButtonText}>
                    Não Possui Cadastro? <Text style={styles.secondaryButtonBold}>Cadastrar</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ImageBackground>

      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        handleStyle={{ backgroundColor: "#e6f6f5" }}
        modalStyle={{ backgroundColor: "transparent" }}
        overlayStyle={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      >
        <View style={sheetStyles.container}>
          <Text style={sheetStyles.title}>Escolha o tipo de cadastro</Text>

          <Pressable
            style={[sheetStyles.optionButton, { backgroundColor: Colors.verdeAgua }]}
            onPress={goToOrfanato}
          >
            <Text style={sheetStyles.optionText}>Cadastrar como Orfanato</Text>
          </Pressable>

          <Pressable
            style={[sheetStyles.optionButton, { backgroundColor: "#0ea5a3" }]}
            onPress={goToDoador}
          >
            <Text style={sheetStyles.optionText}>Cadastrar como Doador</Text>
          </Pressable>

          <Pressable style={sheetStyles.cancel} onPress={closeRegisterSheet}>
            <Text style={sheetStyles.cancelText}>Cancelar</Text>
          </Pressable>
        </View>
      </Modalize>
    </>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(255,255,255,0.04)" },
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    position: "relative",
  },
  logo: {
    width: 250,
    height: 160,
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 35,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  inputWrapper: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    top: 13,
    zIndex: 1,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingLeft: 42,
    paddingRight: 12,
    backgroundColor: "#f8fafc",
    color: "#111827",
    fontSize: 14,
  },
  inputErrorBorder: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 2,
    zIndex: 2,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.verdeAgua,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 14,
  },
  secondaryButtonBold: {
    color: Colors.verdeAgua,
    fontWeight: "700",
  },
  backButtonLeft: {
    position: "absolute",
    left: 12,
    top: Platform.OS === "ios" ? 18 : 12,
    zIndex: 40,
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
});

const sheetStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  optionButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  optionText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  cancel: {
    marginTop: 12,
    paddingVertical: 8,
  },
  cancelText: {
    color: "#6b7280",
    fontSize: 14,
  },
});
