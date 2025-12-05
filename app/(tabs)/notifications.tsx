import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const palette = {
  background: '#f1f2f4',
  card: '#ffffff',
  darkText: '#333333',
  muted: '#8c8f94',
  red: '#f1767c',
  yellow: '#f2c94c',
};

// Lista mock de notificaciones a mostrar.
const notifications = [
  {
    id: '1',
    title: 'Sra. Elena Ramirez',
    detail: 'Pulso Alto: 150 / 100',
    time: 'Hoy 14:23 PM',
    color: palette.red,
    icon: 'heart',
  },
  {
    id: '2',
    title: 'Sra. Elena Ramirez',
    detail: 'Temperatura alta: 40.2 C',
    time: 'Hoy 16:15 PM',
    color: palette.yellow,
    icon: 'thermometer',
  },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Notificaciones</Text>
        <Text style={styles.subtitle}>
          Aqui se mostraran los valores que puedan considerarse inusuales presentados en el
          transcurso del dia.
        </Text>

        {notifications.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={[styles.iconBadge, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon as any} size={22} color="#fff" />
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.detail}>{item.detail}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 32,
    gap: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.darkText,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: palette.muted,
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: palette.card,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.darkText,
  },
  detail: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.muted,
  },
  time: {
    fontSize: 12,
    color: palette.muted,
  },
});
