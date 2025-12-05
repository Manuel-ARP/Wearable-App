import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contactos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="anadir_contacto"
        options={{
          href: null,
          title: 'Anadir contacto',
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: 'Dispositivos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="ipad.and.iphone" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="temperatura"
        options={{
          href: null,
          title: 'Temperatura',
        }}
      />
      <Tabs.Screen
        name="pulso"
        options={{
          href: null,
          title: 'Pulso',
        }}
      />
      <Tabs.Screen
        name="presion"
        options={{
          href: null,
          title: 'Presion',
        }}
      />
      <Tabs.Screen
        name="oxigeno"
        options={{
          href: null,
          title: 'Oxigeno',
        }}
      />
      <Tabs.Screen
        name="sueno"
        options={{
          href: null,
          title: 'Sueno',
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="line.3.horizontal" color={color} />,
        }}
      />
    </Tabs>
  );
}
