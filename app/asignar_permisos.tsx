import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const palette = {
  teal: '#36b6ac',
  darkText: '#333333',
  muted: '#8c8f94',
  bg: '#f5f6f8',
  card: '#ffffff',
  border: '#e5e7eb',
};

const permissions = [
  { id: 'dashboard', label: 'Ver Dashboard Principal', icon: 'apps-outline' },
  { id: 'alerts', label: 'Recibir Alertas', icon: 'notifications-outline' },
  { id: 'history', label: 'Ver historial completo', icon: 'document-text-outline' },
  { id: 'studies', label: 'Acceder a estudios medicos', icon: 'document-outline' },
  { id: 'export', label: 'Exportar datos', icon: 'share-outline' },
];

export default function AsignarPermisosScreen() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    dashboard: true,
    alerts: true,
    history: true,
    studies: true,
    export: true,
  });

  const togglePerm = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Ionicons name="chevron-back" size={24} color={palette.darkText} onPress={() => router.back()} />
          <Text style={styles.header}>Asignar Permisos</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.subtitle}>
          Define a que informacion tendra acceso tu Cuidador seleccionado
        </Text>

        <View style={styles.guardianCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={30} color={palette.muted} />
          </View>
          <Text style={styles.guardianName}>Dr. Gael Soto</Text>
        </View>

        <Text style={styles.sectionTitle}>Nivel de acceso</Text>

        <View style={styles.permsCard}>
          {permissions.map((perm, index) => (
            <View key={perm.id} style={styles.permRow}>
              <View style={styles.permInfo}>
                <Ionicons name={perm.icon as any} size={22} color={palette.teal} />
                <Text style={styles.permLabel}>{perm.label}</Text>
              </View>
              <Switch
                trackColor={{ false: '#d1d5db', true: '#9ee5dc' }}
                thumbColor={toggles[perm.id] ? '#36b6ac' : '#f4f3f4'}
                value={!!toggles[perm.id]}
                onValueChange={() => togglePerm(perm.id)}
              />
              {index < permissions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <Pressable style={styles.saveButton}>
          <Text style={styles.saveText}>Guardar cambios</Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 32,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: palette.darkText,
  },
  subtitle: {
    fontSize: 14,
    color: palette.muted,
    lineHeight: 20,
  },
  guardianCard: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e8eaed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guardianName: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.darkText,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: palette.darkText,
    marginTop: 8,
  },
  permsCard: {
    marginTop: 8,
    backgroundColor: palette.card,
    borderRadius: 14,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  permRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  permInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  permLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.darkText,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginTop: 10,
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: palette.teal,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  saveText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 6,
  },
  cancelText: {
    color: '#2f80ed',
    fontSize: 16,
    fontWeight: '600',
  },
});
