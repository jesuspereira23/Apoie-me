import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../../constants/Colors';
import { supabase } from '../../lib/supabase';

export default function SignUpOrfanatoScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
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
    <ImageBackground source={require('../../assets/images/background.png')} style={styles.background} imageStyle={{ resizeMode: 'cover' }}>
        <View style={styles.overlay}>
            <View style={styles.card}>
            <MaterialIcons name="home" size={48} color={Colors.laranja} style={styles.icon} />
            <Text style={styles.title}>Cadastro de Orfanato</Text>
            <Text style={styles.subtitle}>Conecte sua instituição com apoiadores </Text>

            {/* Inputs */}
            <TextInput placeholder="Nome da instituição" style={styles.input} value={nome} onChangeText={setNome} />
            <TextInput placeholder="CNPJ" style={styles.input} value={cnpj} onChangeText={setCnpj} />
            <TextInput placeholder="Endereço" style={styles.input} value={endereco} onChangeText={setEndereco} />
            <TextInput placeholder="Telefone" style={styles.input} value={telefone} onChangeText={setTelefone} />
            <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
            <TextInput placeholder="Senha" style={styles.input} secureTextEntry value={senha} onChangeText={setSenha} />

            <Pressable style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </Pressable>
            </View>
        </View>
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.30)', paddingHorizontal: 20 },
  card: { width: '100%', maxWidth: 420, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, elevation: 6 },
  
  icon: { alignSelf: 'center', marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', color: Colors.laranja, marginBottom: 6 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 18 },
  input: { borderWidth: 1, borderColor: '#e6e6e6', borderRadius: 12, padding: 14, marginBottom: 12, backgroundColor: '#fff' },
  button: { backgroundColor: Colors.laranja, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
