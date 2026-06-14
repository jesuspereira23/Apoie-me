import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const { userType } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.verdeAgua,
        tabBarInactiveTintColor: '#999',
      }}
    >
      {/* Tab do Doador/Apoiador */}
      <Tabs.Screen
        name="apoiador"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          href: userType === 'doador' ? undefined : null,
        }}
      />

      {/* Tab do Orfanato */}
      <Tabs.Screen
        name="orfanato"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          href: userType === 'orfanato' ? undefined : null,
        }}
      />
    </Tabs>
  );
}