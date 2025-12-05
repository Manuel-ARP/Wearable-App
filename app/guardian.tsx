import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const palette = {
  teal: '#36b6ac',
  darkText: '#333333',
  muted: '#8c8f94',
  lightBg: '#f5f6f8',
  card: '#ffffff',
  badgeBg: '#e3f4f2',
};

// Lista mock de guardianes.
const guardians = [
  { id: '1', name: 'Dr. Gael Soto', role: 'Acceso Completo' },
  { id: '2', name: 'Hija Ana Gomez', role: 'Solo alertas' },
];

export default function GuardianScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Ionicons name="chevron-back" size={24} color={palette.darkText} onPress={() => router.back()} />
          <Text style={styles.header}>Guardianes</Text>
        </View>
        <Text style={styles.subtitle}>Personas encargadas de monitorear tus mediciones de salud.</Text>

        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Anadir Guardian</Text>
        </Pressable>

        <View style={styles.list}>
          {guardians.map((guardian) => (
            <View key={guardian.id} style={styles.card}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={30} color={palette.muted} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{guardian.name}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{guardian.role}</Text>
                </View>
              </View>
              <Pressable hitSlop={10} onPress={() => router.push('/asignar_permisos')}>
                <Ionicons name="create-outline" size={18} color={palette.muted} />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.lightBg,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.darkText,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subtitle: {
    fontSize: 13,
    color: palette.muted,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.teal,
    borderRadius: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: 14,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#e8eaed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.darkText,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.badgeBg,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: palette.teal,
    fontSize: 12,
    fontWeight: '700',
  },
});
