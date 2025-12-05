import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const palette = {
  teal: '#36b6ac',
  darkText: '#333333',
  muted: '#8c8f94',
  bg: '#ffffff',
  border: '#e5e7eb',
};

// Ocultamos el header nativo para evitar doble flecha de regreso.
export const options = {
  headerShown: false,
};

export default function AjustesScreen() {
  const [alerts, setAlerts] = useState(true);
  const [voice, setVoice] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Ionicons name="chevron-back" size={24} color={palette.darkText} onPress={() => router.back()} />
          <Text style={styles.header}>Ajustes</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>Region</Text>
          <View style={styles.valueRow}>
            <Text style={styles.valueText}>Mexico</Text>
            <Ionicons name="chevron-forward" size={18} color={palette.darkText} />
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>Idioma</Text>
          <View style={styles.valueRow}>
            <Text style={styles.valueText}>Espanol</Text>
            <Ionicons name="chevron-forward" size={18} color={palette.darkText} />
          </View>
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextBlock}>
            <Text style={styles.toggleLabel}>Alertas de conexion</Text>
            <Text style={styles.toggleDetail}>
              Recibe notificaciones cuando tu dispositivo wearable se conecte o desconecte de tu telefono
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#d1d5db', true: '#9ee5dc' }}
            thumbColor={alerts ? '#36b6ac' : '#f4f3f4'}
            value={alerts}
            onValueChange={setAlerts}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextBlock}>
            <Text style={styles.toggleLabel}>Asistente de voz</Text>
            <Text style={styles.toggleDetail}>
              Utiliza la asistente de voz para realizar ciertas acciones por medio de comandos de voz
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#d1d5db', true: '#9ee5dc' }}
            thumbColor={voice ? '#36b6ac' : '#f4f3f4'}
            value={voice}
            onValueChange={setVoice}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextBlock}>
            <Text style={styles.toggleLabel}>Notificaciones</Text>
            <Text style={styles.toggleDetail}>
              Recibe notificaciones de esta aplicacion en este dispositivo
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#d1d5db', true: '#9ee5dc' }}
            thumbColor={notifications ? '#36b6ac' : '#f4f3f4'}
            value={notifications}
            onValueChange={setNotifications}
          />
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 32,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: palette.darkText,
    flex: 1,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  sectionLabel: {
    fontSize: 16,
    color: palette.darkText,
    fontWeight: '700',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.darkText,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  toggleTextBlock: {
    flex: 1,
    gap: 4,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.darkText,
  },
  toggleDetail: {
    fontSize: 12,
    color: palette.muted,
    lineHeight: 16,
  },
});
