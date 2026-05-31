import { StyleSheet, Text, View } from 'react-native';

export default function OrfanatoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Área do Orfanato</Text>
      <Text style={styles.text}>
        Aqui os orfanatos podem cadastrar necessidades, criar campanhas e prestar contas.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  text: { fontSize: 14, textAlign: 'center', color: '#555' },
});
