import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';

export default function HomeScreen() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={styles.background}
      resizeMode="cover">
      
      {/* Header com ícone de ajuda */}
      <View style={styles.header}>
        <Pressable onPress={() => setShowHelp(true)}>
          <Ionicons name="help-circle-outline" size={28} color="#00b894" />
        </Pressable>
      </View>

      <View style={[styles.container, styles.contentScale]}>
        {/* Logo */}
        <Image source={require('../assets/images/logo-sbg.png')} style={styles.logo} resizeMode="contain" />

        {/* Títulos */}
        <Text style={styles.title}>Transforme vidas. Apoie um orfanato.</Text>
        <Text style={styles.subtitle}>
          Conectamos orfanatos que precisam com pessoas que querem fazer a diferença.
        </Text>

        {/* Ilustração central */}
        <Image source={require('../assets/images/img-crianca.png')} style={styles.illustration} resizeMode="contain" />

        <View style={styles.cardContainer}>
          {/* Cards com ícones */}
          <View style={styles.row}>
            <View style={[styles.card, styles.cardDivider]}>
              <Ionicons name="heart-outline" size={32} color={Colors.verdeAgua} />
              <Text style={styles.cardTitle}>Apoie</Text>
              <Text style={styles.cardText}>Dê itens, tempo ou recursos.</Text>
            </View>
            <View style={[styles.card, styles.cardDivider]}>
              <MaterialIcons name="home" size={32} color={Colors.laranja} />
              <Text style={styles.cardTitle}>Fortaleça</Text>
              <Text style={styles.cardText}>Ajude orfanatos a cuidarem melhor das crianças.</Text>
            </View>
            <View style={styles.card}>
              <Ionicons name="people" size={32} color={Colors.azul} />
              <Text style={styles.cardTitle}>Transforme</Text>
              <Text style={styles.cardText}>Sua doação gera impacto positivo e contínuo.</Text>
            </View>
          </View>

          {/* Botões principais */}
          <Pressable style={styles.primaryButton} onPress={() => router.push('../singup/doador')}>
            <Text style={styles.primaryButtonText}>Quero ser um apoiador</Text>
            <Ionicons name="heart" size={18} color="#fff" style={styles.buttonIconRight} />
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => router.push('../singup/orfanato')}>
            <Text style={styles.secondaryButtonText}>Sou um orfanato</Text>
          </Pressable>

          <Pressable onPress={() => router.push('../login')}>
            <Text style={styles.link}>Entrar</Text>
          </Pressable>
        </View>

        {/* Rodapé */}
        <Text style={styles.footer}>
          Dados de cadastro e transparência disponíveis na plataforma.
        </Text>
      </View>

      {/* Modal de ajuda */}
      <Modal visible={showHelp} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Como funciona?</Text>

            <View style={styles.modalSection}>
              <Ionicons name="heart-outline" size={28} color={Colors.verdeAgua} style={styles.modalIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.modalSectionTitle}>Se você for um apoiador:</Text>
                <Text style={styles.modalText}>
                  • Pode doar itens, tempo ou recursos.{"\n"}
                  • Conecta-se com orfanatos cadastrados.{"\n"}
                  • Acompanha o impacto das suas doações.
                </Text>
              </View>
            </View>

            <View style={styles.modalSection}>
              <MaterialIcons name="home" size={28} color={Colors.laranja} style={styles.modalIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.modalSectionTitle}>Se você for um orfanato:</Text>
                <Text style={styles.modalText}>
                  • Cadastra sua instituição na plataforma.{"\n"}
                  • Recebe apoio de doadores e voluntários.{"\n"}
                  • Ganha visibilidade e transparência.
                </Text>
              </View>
            </View>

            <Pressable style={styles.closeButton} onPress={() => setShowHelp(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  header: { position: 'absolute', top: 40, right: 20, zIndex: 10 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 12 },
  contentScale: { transform: [{ scale: 0.92 }] },
  logo: { width: 190, height: 190, marginBottom: 16 },
  cardContainer: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 24,
    marginTop: -8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 13, textAlign: 'center', color: '#666', marginBottom: 18 },
  illustration: { width: 270, height: 270, marginBottom: -50, position: 'relative', zIndex: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18, backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden' },
  card: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  cardDivider: { borderRightWidth: 1, borderRightColor: '#e0e0e0' },
  cardTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  cardText: { fontSize: 11, textAlign: 'center', color: '#555' },
  primaryButton: { backgroundColor: Colors.verdeAgua, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginBottom: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  buttonIconRight: { marginLeft: 20 },
  primaryButtonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  secondaryButton: { borderWidth: 1, borderColor: Colors.verdeAgua, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  secondaryButtonText: { color: Colors.verdeAgua, fontWeight: '600', textAlign: 'center' },
  link: { color: Colors.azul, marginBottom: 14, textAlign: 'center', alignSelf: 'center' },
  footer: { fontSize: 9, color: '#999', textAlign: 'center', marginTop: 16, paddingBottom: 4 },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '90%', maxWidth: 420, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 16, color: Colors.verdeAgua, textAlign: 'center' },
  modalSection: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  modalIcon: { marginRight: 12, marginTop: 2 },
    modalSectionTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    marginTop: 4, 
    marginBottom: 6, 
    color: Colors.laranja 
  },
  modalText: { 
    fontSize: 14, 
    color: '#444', 
    marginBottom: 10, 
    lineHeight: 20 
  },
  closeButton: { 
    backgroundColor: Colors.azul, 
    paddingVertical: 12, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 16 
  },
  closeButtonText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 15 
  },
});
