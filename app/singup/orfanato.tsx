import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ImageBackground, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../../constants/Colors';
import { supabase } from '../../lib/supabase';

export default function SignUpOrfanatoScreen() {
  const [email, setEmail] = useState('');
  const [senha] = useState('ApoieMe@123');
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');

  async function handleSignUp() {
    const { data, error } = await supabase.auth.signUp({ email, password: senha });
    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      await supabase.from('orfanatos').insert({
        user_id: data.user?.id,
        nome,
        cnpj,
        email,
        endereco,
        telefone,
      });
      router.push('../tabs/orfanato');
    }
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
                <Text style={styles.stepBadgeText}>1/2</Text>
              </View>

              {/* Header com título e ilustração */}
              <View style={styles.headerSection}>
                <View style={styles.headerText}>
                  <Text style={styles.title}>Cadastro de Orfanato</Text>
                  <Text style={styles.subtitle}>
                    Cadastre sua instituição e conecte-se a pessoas dispostas a ajudar
                  </Text>
                </View>
                <Image source={require('../../assets/images/img-crianca-casa.png')} style={styles.illustration} resizeMode="contain" />
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
                  <TextInput placeholder="exemplo@gmail.com" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
                </View>

                {/* Botão principal */}
                <Pressable style={styles.button} onPress={handleSignUp}>
                  <Text style={styles.buttonText}>Cadastrar Orfanato</Text>
                </Pressable>

                {/* Link secundário */}
                <Pressable style={styles.secondaryButton} onPress={() => router.push('../login')}>
                  <Text style={styles.secondaryButtonText}>Já possui cadastro? - Entrar</Text>
                </Pressable>
              </View>
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
    width: 200,   // logo maior
    height: 110,
    alignSelf: 'center',
    marginBottom: 8,
  },
  stepBadge: {
    alignSelf: 'center',     // centralizado abaixo da logo
    backgroundColor: Colors.verdeAgua,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,        // espaço antes do header
  },
  stepBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  headerText: { flex: 1, marginRight: 8 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.verdeAgua,
    marginBottom: 4,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 16,
    marginBottom: 6,
    textAlign: 'left',
  },
  illustration: { width: 130, height: 130, resizeMode: 'contain' },
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
