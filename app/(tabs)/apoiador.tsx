import { StyleSheet, Text, View } from 'react-native';

export default function ApoiadorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Área do Apoiador</Text>
      <Text style={styles.text}>
        Aqui você poderá ver as necessidades dos orfanatos e escolher como ajudar.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  text: { fontSize: 14, textAlign: 'center', color: '#555' },
});
