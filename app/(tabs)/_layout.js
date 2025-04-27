import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="map" color={color} size={24} />,
          title: 'Map',
        }}
      />
      <Tabs.Screen
        name="wines"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="wine" color={color} size={24} />,
          title: 'Wines',
        }}
      />
      <Tabs.Screen
        name="wineries"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="business" color={color} size={24} />,
          title: 'Wineries',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person" color={color} size={24} />,
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}