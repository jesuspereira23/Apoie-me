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
        <Text style={styles.titleTop}>Transforme vidas</Text>
        <Text style={styles.titleBottom}>Apoie um orfanato</Text>
        <Text style={styles.subtitle}>
          Conectamos orfanatos que precisam{"\n"}com pessoas que querem fazer a diferença.
        </Text>   


        {/* Ilustração central */}
        <Image source={require('../assets/images/img-crianca.png')} style={styles.illustration} resizeMode="contain" />

        <View style={styles.cardContainer}>
          {/* Cards com ícones */}
          <View style={styles.row}>
            <View style={[styles.card, styles.cardDivider]}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.verdeAgua }]}>
                <Ionicons name="heart" size={20} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Apoie</Text>
              <Text style={styles.cardText}>Dê itens, tempo ou recursos.</Text>
            </View>
            <View style={[styles.card, styles.cardDivider]}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.laranja }]}>
                <MaterialIcons name="favorite" size={20} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Fortaleça</Text>
              <Text style={styles.cardText}>Ajude orfanatos a cuidarem melhor das crianças.</Text>
            </View>
            <View style={styles.card}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.azul }]}>
                <Ionicons name="people" size={20} color="#fff" />
              </View>
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

          {/* Rodapé */}
          <View style={styles.footerContainer}>
            <Ionicons name="shield-checkmark" size={32} color={Colors.verdeAguaClaro} style={styles.shieldIcon} />
            <Text style={styles.footer}>
              Sua doação é segura e transparente.{"\n"}
              Apoiamos orfanatos com responsabilidade.
            </Text>
          </View>
        </View>
      </View>  

      {/* Modal de ajuda */}
      <Modal visible={showHelp} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Como funciona?</Text>

            <View style={styles.modalSection}>
              <Ionicons name="heart-outline" size={28} color={Colors.verdeAguaEscuro} style={styles.modalIcon} />
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
              <MaterialIcons name="home" size={28} color={Colors.verdeAguaEscuro} style={styles.modalIcon} />
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
  logo: { width: 150, height: 150, marginBottom: 16 },
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
  titleTop: {
  fontSize: 22,
  fontWeight: '700',
  textAlign: 'center',
  color: '#333',
  marginBottom: 2,
  },
  titleBottom: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    color: Colors.verdeAguaClaro,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,       // aumenta espaçamento entre linhas
    paddingHorizontal: 24 // deixa mais estreito no celular
  },

  title: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  illustration: { width: 270, height: 270, marginBottom: -50, position: 'relative', zIndex: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18, backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden' },
  card: { flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4 },
  cardDivider: { borderRightWidth: 1, borderRightColor: '#e0e0e0' },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  cardTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  cardText: { fontSize: 11, textAlign: 'center', color: '#555' },
  primaryButton: { backgroundColor: Colors.verdeAgua, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginBottom: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  buttonIconRight: { marginLeft: 20 },
  primaryButtonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  secondaryButton: { borderWidth: 1, borderColor: Colors.verdeAgua, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  secondaryButtonText: { color: Colors.verdeAgua, fontWeight: '600', textAlign: 'center' },
  link: { color: Colors.verdeAguaClaro, marginBottom: 7, textAlign: 'center', alignSelf: 'center' },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
    paddingHorizontal: 20,
  },
  shieldIcon: {
    marginRight: 10,
  },
  footer: {
    fontSize: 11,
    color: '#666',
    textAlign: 'left',
    lineHeight: 18,
  },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '90%', maxWidth: 420, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 16, color: Colors.verdeAguaEscuro, textAlign: 'center' },
  modalSection: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  modalIcon: { marginRight: 12, marginTop: 2 },
    modalSectionTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    marginTop: 4, 
    marginBottom: 6, 
    color: Colors.verdeAguaEscuro 
  },
  modalText: { 
    fontSize: 14, 
    color: '#444', 
    marginBottom: 10, 
    lineHeight: 20 
  },
  closeButton: { 
    backgroundColor: Colors.verdeAguaEscuro, 
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