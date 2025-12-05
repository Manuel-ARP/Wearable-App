import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const palette = {
  darkText: '#333333',
  muted: '#8c8f94',
  bg: '#ffffff',
  border: '#e5e7eb',
};

const appPermissions = [
  {
    id: 'sms',
    title: 'Enviar mensajes SMS',
    detail: 'Para enviar alertas y demas notificaciones de tu dispositivo wearable',
  },
  {
    id: 'phone',
    title: 'Telefono',
    detail: 'Para responder o recibir llamadas en caso de una emergencia',
  },
  {
    id: 'contacts',
    title: 'Acceder a los contactos',
    detail: 'Accede a tus contactos para conectar con ellos para notificarles de su estado y en caso de emergencia',
  },
  {
    id: 'location',
    title: 'Acceder a la ubicacion',
    detail: 'Esencial para realizar un seguimiento de tus estados de salud y actualizar tu informacion medica',
  },
  {
    id: 'device',
    title: 'Acceder a la informacion del dispositivo',
    detail: 'Para sincronizar el estado del dispositivo en tu dispositivo wearable',
  },
  {
    id: 'notifications',
    title: 'Acceder a las notificaciones',
    detail: 'Para mantener al tanto de tu estado y las alertas tanto a tu dispositivo como a tus contactos y medico',
  },
  {
    id: 'activity',
    title: 'Acceder a la informacion de actividad',
    detail: 'Permite que la aplicacion y el wearable acceda a la informacion de actividad para realizar un seguimiento de tus estados de salud',
  },
];

export default function MenuPermisosScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Ionicons name="chevron-back" size={24} color={palette.darkText} onPress={() => router.back()} />
          <Text style={styles.header}>Permisos de aplicaciones</Text>
        </View>

        <View style={styles.list}>
          {appPermissions.map((item) => (
            <Pressable key={item.id} style={styles.row}>
              <View style={styles.textBlock}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.detail}>{item.detail}</Text>
              </View>
              <View style={styles.trailing}>
                <Text style={styles.status}>Otorgado</Text>
                <Ionicons name="chevron-forward" size={16} color={palette.darkText} />
              </View>
            </Pressable>
          ))}
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
    fontSize: 24,
    fontWeight: '700',
    color: palette.darkText,
  },
  list: {
    marginTop: 8,
    gap: 12,
    paddingBottom: 80,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    gap: 12,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.darkText,
  },
  detail: {
    fontSize: 13,
    color: palette.muted,
    lineHeight: 18,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  status: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.darkText,
  },
});
