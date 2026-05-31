import { router } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../constants/Colors';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (!error && data.user) {
      router.push('../tabs/apoiador'); // ou lógica para decidir aba
    }
  }

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background} imageStyle={{ resizeMode: 'cover' }}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Bem-vindo</Text>
          <Text style={styles.subtitle}>Faça login para continuar</Text>

          <TextInput placeholder="Email" placeholderTextColor="#666" style={styles.input} value={email} onChangeText={setEmail} />
          <TextInput placeholder="Senha" placeholderTextColor="#666" style={styles.input} secureTextEntry value={senha} onChangeText={setSenha} />

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>

          <Text style={styles.footer}>
            Não tem conta? <Text style={styles.link} onPress={() => router.push('../signup/doador')}>Cadastre-se</Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.30)', paddingHorizontal: 20 },
  card: { width: '100%', maxWidth: 420, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, elevation: 6 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 6, color: Colors.azul },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 18, color: '#666' },
  input: { borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 12, padding: 14, marginBottom: 12, backgroundColor: '#fff' },
  button: { backgroundColor: Colors.azul, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  footer: { textAlign: 'center', marginTop: 16, color: '#555' },
  link: { color: Colors.verdeAgua, fontWeight: '600' },
});
