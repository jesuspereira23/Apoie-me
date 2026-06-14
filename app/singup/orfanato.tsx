import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ImageBackground, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../../constants/Colors';
import { supabase } from '../../lib/supabase';

export default function SignUpOrfanatoScreen() {
  const [step, setStep] = useState(1);

  // Etapa 1
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  // Etapa 2
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  function handleNextStep() {
    if (!nome || !email) {
      Alert.alert('Atenção', 'Preencha nome e e-mail para continuar.');
      return;
    }
    setStep(2);
  }

  async function handleSignUp() {
    if (!senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha a senha e a confirmação.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password: senha });

    if (error) {
      Alert.alert('Erro', error.message);
      return;
    }

    const { error: insertError } = await supabase.from('orfanatos').insert({
      user_id: data.user?.id,
      nome,
      cnpj,
      email,
      endereco,
      telefone,
    });

    if (insertError) {
      Alert.alert('Erro', insertError.message);
      return;
    }

    router.replace('/(tabs)/orfanato');
  }

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.background}
      imageStyle={{ resizeMode: 'cover' }}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 24}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.card}>

              {/* Logo */}
              <Image source={require('../../assets/images/logo-sbg.png')} style={styles.logo} resizeMode="contain" />

              {/* Etapa */}
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>Etapa {step}/2</Text>
              </View>

              {step === 1 ? (
                <>
                  {/* Header — texto à esquerda e imagem à direita */}
                  <View style={styles.headerSection}>
                    <View style={styles.headerText}>
                      <Text style={styles.titleBlack}>Cadastro de</Text>
                      <Text style={styles.titleGreen}>Orfanato</Text>
                      <Text style={styles.subtitle}>
                        Cadastre sua instituição e{'\n'}conecte-se a pessoas{'\n'}dispostas a ajudar
                      </Text>
                    </View>

                    <Image 
                      source={require('../../assets/images/img-crianca-casa.png')} 
                      style={styles.illustration} 
                      resizeMode="contain" 
                    />
                  </View>


                  {/* Formulário */}
                  <View style={styles.formBox}>
                    {/* Nome */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Nome da instituição</Text>
                      <MaterialIcons name="home" size={18} color={Colors.verdeAgua} style={styles.inputIcon} />
                      <TextInput placeholder="Digite o nome do orfanato" style={styles.input} value={nome} onChangeText={setNome} />
                    </View>

                    {/* CNPJ */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>CNPJ</Text>
                      <MaterialIcons name="badge" size={18} color={Colors.verdeAgua} style={styles.inputIcon} />
                      <TextInput placeholder="00.000.000/0000-00" style={styles.input} value={cnpj} onChangeText={setCnpj} keyboardType="numeric" />
                    </View>

                    {/* Endereço */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Endereço</Text>
                      <MaterialIcons name="location-on" size={18} color={Colors.verdeAgua} style={styles.inputIcon} />
                      <TextInput placeholder="Rua, número, bairro, cidade, estado" style={styles.input} value={endereco} onChangeText={setEndereco} />
                    </View>

                    {/* Telefone */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Telefone</Text>
                      <MaterialIcons name="phone" size={18} color={Colors.verdeAgua} style={styles.inputIcon} />
                      <TextInput placeholder="(00) 00000-0000" style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>E-mail</Text>
                      <MaterialIcons name="email" size={18} color={Colors.verdeAgua} style={styles.inputIcon} />
                      <TextInput placeholder="exemplo@gmail.com" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    </View>

                    {/* Botão principal */}
                    <Pressable style={styles.button} onPress={handleNextStep}>
                      <Text style={styles.buttonText}>Próxima Etapa</Text>
                    </Pressable>

                    {/* Link secundário */}
                    <Pressable style={styles.secondaryButton} onPress={() => router.push('../login')}>
                      <Text style={styles.secondaryButtonText}>Já possui cadastro? - Entrar</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  {/* Header etapa 2 */}
                  <View style={styles.headerSection}>
                    <View style={styles.headerText}>
                      <Text style={styles.title}>Crie sua senha</Text>
                      <Text style={styles.subtitle}>
                        Crie uma senha segura para acessar o painel do seu orfanato
                      </Text>
                    </View>
                  </View>

                  {/* Formulário */}
                  <View style={styles.formBox}>
                    <Text style={styles.sectionTitle}>Dados de acesso</Text>

                    {/* Senha */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Senha</Text>
                      <MaterialIcons name="lock" size={18} color={Colors.verdeAgua} style={styles.inputIcon} />
                      <TextInput placeholder="Digite sua senha" style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />
                    </View>

                    {/* Confirmar senha */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Confirmar senha</Text>
                      <MaterialIcons name="lock" size={18} color={Colors.verdeAgua} style={styles.inputIcon} />
                      <TextInput placeholder="Digite sua senha novamente" style={styles.input} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />
                    </View>

                    <Text style={styles.helperText}>A senha deve ter pelo menos 6 caracteres</Text>

                    {/* Botão principal */}
                    <Pressable style={styles.button} onPress={handleSignUp}>
                      <Text style={styles.buttonText}>Cadastrar Orfanato</Text>
                    </Pressable>

                    {/* Voltar */}
                    <Pressable style={styles.secondaryButton} onPress={() => setStep(1)}>
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
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.04)' },
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'transparent',
    borderRadius: 24,
    padding: 12,
  },
  logo: {
    width: 200,
    height: 110,
    alignSelf: 'center',
    marginBottom: 8,
  },
  illustration: {
  width: 160,
  height: 160,
  resizeMode: 'contain',
  marginLeft: 12,
  },  
  stepBadge: {
    alignSelf: 'center',
    backgroundColor: Colors.verdeAgua,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  stepBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  headerSection: {
  width: '100%',
  marginBottom: 10,
  flexDirection: 'row',       // coloca lado a lado
  alignItems: 'center',
  justifyContent: 'space-between',
  },
  headerText: {
  flex: 1,                    // ocupa espaço à esquerda
  marginRight: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.verdeAgua,
    marginBottom: 4,
    textAlign: 'left',
  },
  titleBlack: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 30,
  },
  titleGreen: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.verdeAgua,
    lineHeight: 30,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 16,
    marginBottom: 6,
    textAlign: 'left',
  },
  formBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  inputGroup: { position: 'relative', marginBottom: 10 },
  inputLabel: { fontSize: 11, color: '#6b7280', marginBottom: 4, fontWeight: '600' },
  inputIcon: { position: 'absolute', left: 12, top: 34, zIndex: 1 },
  input: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingLeft: 42,
    paddingRight: 12,
    backgroundColor: '#f8fafc',
    color: '#111827',
    fontSize: 14,
  },
  helperText: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 8,
    marginTop: -2,
  },
  button: {
    backgroundColor: Colors.verdeAgua,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 8,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.verdeAgua,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 4,
  },
  secondaryButtonText: { color: Colors.verdeAgua, fontWeight: '600', fontSize: 14 },
});