import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { z } from "zod";
import Colors from "../../constants/Colors";
import { supabase } from "../../lib/supabase";
import {
  signUpDoadorBaseSchema,
  signUpDoadorSchema,
} from "../../lib/validation";

type FormValues = z.infer<typeof signUpDoadorSchema>;

export default function SignUpDoadorScreen() {
  const [step, setStep] = useState<1 | 2>(1);
  const [empresa, setEmpresa] = useState(false);
  const [loading, setLoading] = useState(false);

  // estados para visibilidade das senhas
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
    setFocus,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(signUpDoadorSchema),
    mode: "onChange",
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const watchedStep1 = watch(["nome", "email"]);
  const step1Valid = signUpDoadorBaseSchema
    .pick({ nome: true, email: true })
    .safeParse({ nome: watchedStep1[0], email: watchedStep1[1] }).success;
  const watchedSenha = watch("senha");
  const watchedConfirmar = watch("confirmarSenha");
  const step2Valid =
    watchedSenha.length >= 8 &&
    watchedConfirmar.length >= 8 &&
    watchedSenha === watchedConfirmar &&
    !errors.senha &&
    !errors.confirmarSenha;

  const darkGreen = (Colors as any).verdeAguaEscuro ?? Colors.verdeAgua;

  function focusFirstError() {
    const keys = Object.keys(errors) as (keyof FormValues)[];
    if (keys.length > 0) setFocus(keys[0] as any);
  }

  async function onNextStep() {
    const values = getValues();
    const result = signUpDoadorBaseSchema
      .pick({ nome: true, email: true })
      .safeParse({ nome: values.nome, email: values.email });

    if (!result.success) {
      await trigger(["nome", "email"]);
      focusFirstError();
      return;
    }

    setStep(2);
  }

  async function handleSignUp(data: FormValues) {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.senha,
      });

      if (authError) {
        Alert.alert("Erro", authError.message);
        return;
      }

      const { error: insertError } = await supabase.from("doadores").insert({
        user_id: authData.user?.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        empresa,
      });

      if (insertError) {
        Alert.alert("Erro", insertError.message);
        return;
      }

      router.replace("/(tabs)/apoiador");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
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
            <View style={styles.card}>
              {/* Botão de voltar no canto superior esquerdo */}
              <Pressable
                onPress={() => router.back()}
                style={styles.backButtonLeft}
                hitSlop={8}
                accessibilityLabel="Voltar"
              >
                <MaterialIcons name="arrow-back" size={22} color={Colors.verdeAgua} />
              </Pressable>


              {/* Ilustração absoluta só na etapa 1 */}
              {step === 1 && (
                <View style={styles.illustrationAbsolute}>
                  <Image
                    source={require("../../assets/images/img-familia.png")}
                    style={styles.illustration}
                    resizeMode="contain"
                  />
                </View>
              )}

              <Image
                source={require("../../assets/images/logo-sbg.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>Etapa {step}/2</Text>
              </View>

              {step === 1 ? (
                <>
                  <View style={styles.headerSection}>
                    <View style={styles.headerText}>
                      <Text style={styles.titleBlack}>Cadastro de</Text>
                      <Text style={styles.titleGreen}>Doador</Text>
                      <Text style={styles.subtitle1}>
                        Faça parte dessa{"\n"}rede do bem e{"\n"}transforme
                        vidas com{"\n"}generosidade
                      </Text>
                    </View>
                  </View>

                  <View style={styles.formBox}>
                    {/* Nome */}
                    <Controller
                      control={control}
                      name="nome"
                      render={({ field: { onChange, value } }) => (
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>Nome</Text>
                          <MaterialIcons
                            name="person"
                            size={18}
                            color={Colors.verdeAgua}
                            style={styles.inputIcon1}
                          />
                          <TextInput
                            placeholder="Digite seu nome"
                            style={[
                              styles.input,
                              errors.nome ? styles.inputErrorBorder : null,
                            ]}
                            value={value}
                            onChangeText={onChange}
                            returnKeyType="next"
                            onSubmitEditing={() => setFocus("telefone" as any)}
                          />
                          {errors.nome && (
                            <Text style={styles.errorText}>
                              {errors.nome.message}
                            </Text>
                          )}
                        </View>
                      )}
                    />

                    {/* Empresa - checkbox */}
                    <Pressable
                      style={styles.checkboxRow}
                      onPress={() => setEmpresa(!empresa)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          empresa && styles.checkboxChecked,
                        ]}
                      >
                        {empresa && (
                          <MaterialIcons name="check" size={14} color="#fff" />
                        )}
                      </View>
                      <Text style={styles.checkboxLabel}>
                        Empresa (opcional)
                      </Text>
                    </Pressable>

                    {/* Telefone */}
                    <Controller
                      control={control}
                      name="telefone"
                      render={({ field: { onChange, value } }) => (
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>Telefone</Text>
                          <MaterialIcons
                            name="phone"
                            size={18}
                            color={Colors.verdeAgua}
                            style={styles.inputIcon1}
                          />
                          <MaskedTextInput
                            mask="(99) 99999-9999"
                            placeholder="(00) 00000-0000"
                            style={[
                              styles.input,
                              errors.telefone ? styles.inputErrorBorder : null,
                            ]}
                            value={value}
                            onChangeText={onChange}
                            keyboardType="phone-pad"
                            returnKeyType="next"
                            onSubmitEditing={() => setFocus("email" as any)}
                          />
                          {errors.telefone && (
                            <Text style={styles.errorText}>
                              {errors.telefone.message}
                            </Text>
                          )}
                        </View>
                      )}
                    />

                    {/* Email */}
                    <Controller
                      control={control}
                      name="email"
                      render={({ field: { onChange, value } }) => (
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>E-mail</Text>
                          <MaterialIcons
                            name="email"
                            size={18}
                            color={Colors.verdeAgua}
                            style={styles.inputIcon1}
                          />
                          <TextInput
                            placeholder="exemplo@gmail.com"
                            style={[
                              styles.input,
                              errors.email ? styles.inputErrorBorder : null,
                            ]}
                            value={value}
                            onChangeText={onChange}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            returnKeyType="done"
                          />
                          {errors.email && (
                            <Text style={styles.errorText}>
                              {errors.email.message}
                            </Text>
                          )}
                        </View>
                      )}
                    />

                    <Pressable
                      style={[
                        styles.button,
                        {
                          backgroundColor: step1Valid
                            ? darkGreen
                            : Colors.verdeAgua,
                        },
                        !step1Valid ? styles.buttonDisabled : null,
                      ]}
                      onPress={onNextStep}
                      disabled={!step1Valid}
                    >
                      <Text style={styles.buttonText}>Próxima Etapa</Text>
                    </Pressable>

                    <Pressable
                      style={styles.secondaryButton}
                      onPress={() => router.push("../login")}
                    >
                      <Text style={styles.secondaryButtonText}>
                        Já possui cadastro? - Entrar
                      </Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  {/* Título e imagem centralizados acima do formBox */}
                  <View style={styles.step2Header}>
                    <Text style={styles.titleBlack}>Crie sua senha</Text>
                    <Text style={styles.subtitle}>
                      Crie uma senha segura para acessar{"\n"}a conta do seu
                      orfanato
                    </Text>
                    <Image
                      source={require("../../assets/images/img-familia.png")}
                      style={styles.illustrationCenter}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.formBox}>
                    {/* Dados de acesso com ícone */}
                    <View style={styles.sectionHeader}>
                      <MaterialIcons
                        name="lock"
                        size={20}
                        color={Colors.verdeAgua}
                        style={{ marginRight: 8 }}
                      />
                      <View>
                        <Text style={styles.sectionTitle}>Dados de acesso</Text>
                        <Text style={styles.sectionSubtitle}>
                          Sua conta deve estar sempre segura
                        </Text>
                      </View>
                    </View>

                    {/* Senha */}
                    <Text style={styles.fieldLabel}>Senha</Text>
                    <Controller
                      control={control}
                      name="senha"
                      render={({ field: { onChange, value } }) => (
                        <View style={styles.inputGroup}>
                          <MaterialIcons
                            name="lock"
                            size={18}
                            color={Colors.verdeAgua}
                            style={styles.inputIcon}
                          />
                          <TextInput
                            placeholder="Digite sua senha"
                            style={[
                              styles.input,
                              { paddingRight: 48 },
                              errors.senha ? styles.inputErrorBorder : null,
                            ]}
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry={!senhaVisivel}
                            returnKeyType="next"
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

                          <Text style={styles.helperText}>
                            Mínimo de 8 caracteres com letras e números
                          </Text>
                          {errors.senha && (
                            <Text style={styles.errorText}>
                              {errors.senha.message}
                            </Text>
                          )}
                        </View>
                      )}
                    />

                    {/* Confirmar senha */}
                    <Text style={styles.fieldLabel}>Confirmar senha</Text>
                    <Controller
                      control={control}
                      name="confirmarSenha"
                      render={({ field: { onChange, value } }) => (
                        <View style={styles.inputGroup}>
                          <MaterialIcons
                            name="lock"
                            size={18}
                            color={Colors.verdeAgua}
                            style={styles.inputIcon}
                          />
                          <TextInput
                            placeholder="Digite sua senha novamente"
                            style={[
                              styles.input,
                              { paddingRight: 48 },
                              errors.confirmarSenha
                                ? styles.inputErrorBorder
                                : null,
                            ]}
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry={!confirmarSenhaVisivel}
                            returnKeyType="done"
                          />
                          <Pressable
                            style={styles.eyeButton}
                            onPress={() =>
                              setConfirmarSenhaVisivel(!confirmarSenhaVisivel)
                            }
                          >
                            <MaterialIcons
                              name={
                                confirmarSenhaVisivel ? "visibility" : "visibility-off"
                              }
                              size={20}
                              color="#6b7280"
                            />
                          </Pressable>

                          <Text style={styles.helperText}>
                            As senhas precisam ser igual
                          </Text>
                          {errors.confirmarSenha && (
                            <Text style={styles.errorText}>
                              {errors.confirmarSenha.message}
                            </Text>
                          )}
                        </View>
                      )}
                    />

                    <Pressable
                      style={[
                        styles.button,
                        {
                          backgroundColor: step2Valid ? darkGreen : Colors.verdeAgua,
                        },
                        (!step2Valid || loading) ? styles.buttonDisabled : null,
                      ]}
                      onPress={handleSubmit(handleSignUp)}
                      disabled={loading || !step2Valid}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <View style={styles.buttonInner}>
                          <Text style={styles.buttonText}>
                            Cadastrar Doador
                          </Text>
                          <MaterialIcons
                            name="people"
                            size={20}
                            color="#fff"
                            style={styles.buttonIcon}
                          />
                        </View>
                      )}
                    </Pressable>

                    <Pressable
                      style={styles.secondaryButton}
                      onPress={() => setStep(1)}
                    >
                      <Text style={styles.secondaryButtonText}>Voltar</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
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
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "transparent",
    borderRadius: 24,
    padding: 12,
    paddingRight: 24,
    position: "relative",
    overflow: "visible",
  },
  logo: {
    width: 200,
    height: 110,
    alignSelf: "center",
    marginBottom: 8,
  },
  illustrationAbsolute: {
    position: "absolute",
    right: 8,
    top: 125,
    width: 160,
    height: 200,
    zIndex: 4,
    elevation: 0,
    overflow: "visible",
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  illustration: {
    width: "130%",
    height: "130%",
    resizeMode: "contain",
  },
  stepBadge: {
    alignSelf: "center",
    backgroundColor: Colors.verdeAgua,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
    zIndex: 6,
  },
  stepBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  headerSection: {
    width: "100%",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    zIndex: 6,
  },
  headerText: {
    flex: 1,
    marginRight: 8,
    zIndex: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.verdeAgua,
    marginBottom: 4,
    textAlign: "left",
  },
  titleBlack: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 30,
  },
  titleGreen: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.verdeAgua,
    lineHeight: 30,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: "#4b5563",
    lineHeight: 16,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle1: {
    fontSize: 12,
    color: "#4b5563",
    lineHeight: 16,
    marginBottom: 6,
    textAlign: "left",
  },
  formBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 8,
  },
  step2Header: {
    width: "100%",
    alignItems: "center",
    marginBottom: -40,
    zIndex: 6,
  },
  illustrationCenter: {
    width: 180,
    height: 180,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 1,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: "#6b7280",
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  inputGroup: { position: "relative", marginBottom: 10 },
  inputLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 4,
    fontWeight: "600",
  },
  inputIcon: { position: "absolute", left: 12, top: 14, zIndex: 1 },
  inputIcon1: { position: "absolute", left: 12, top: 34, zIndex: 1 },
  input: {
    width: "100%",
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
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.verdeAgua,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: Colors.verdeAgua,
  },
  checkboxLabel: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },
  helperText: {
    fontSize: 11,
    color: "#9ca3af",
    marginBottom: 8,
    marginTop: -2,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    marginBottom: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  secondaryButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.verdeAgua,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 4,
  },
  secondaryButtonText: {
    color: Colors.verdeAgua,
    fontWeight: "600",
    fontSize: 14,
  },

  /* botão olho para alternar visibilidade da senha */
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 2,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonLeft: {
    position: "absolute",
    left: 12,
    top: Platform.OS === "ios" ? 12 : 12,
    zIndex: 40,
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff", // fundo circular branco
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },

});
