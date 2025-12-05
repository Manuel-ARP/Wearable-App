import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getCurrentUser, clearCurrentUser } from '../authStore';

const palette = {
  teal: '#36b6ac',
  darkText: '#333333',
  muted: '#8c8f94',
  bg: '#f5f6f8',
  card: '#ffffff',
  border: '#e5e7eb',
};

// Opciones del menu.
const menuItems = [
  { id: 'settings', label: 'Ajustes' },
  { id: 'guardian', label: 'Gestion de guardian' },
  { id: 'permissions', label: 'Permisos' },
  { id: 'feedback', label: 'Comentarios' },
  { id: 'version', label: 'Version de la app', trailing: 'v. 001' },
  { id: 'about', label: 'Acerca de esta aplicacion' },
  { id: 'privacy', label: 'Aviso de privacidad' },
  { id: 'contact', label: 'Contacto medico' },
];

export default function MenuScreen() {
  const user = getCurrentUser();
  const displayName = user?.nombre ? `Hola, ${user.nombre}` : 'Nombre del usuario';

  const handleLogout = () => {
    Alert.alert('Cerrar sesion', '¿Estas seguro de cerrar sesion?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Si, salir',
        style: 'destructive',
        onPress: () => {
          clearCurrentUser();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Perfil</Text>

        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={palette.muted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{displayName}</Text>
          </View>
          {user && (
            <Pressable hitSlop={10} onPress={() => router.push('/editar_perfil')}>
              <Ionicons name="create-outline" size={20} color={palette.muted} />
            </Pressable>
          )}
        </View>

        {!user && (
          <Pressable style={styles.loginButton} onPress={() => router.push('/login')}>
            <Text style={styles.loginText}>Iniciar sesion</Text>
          </Pressable>
        )}

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.id}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: palette.border },
              ]}
              onPress={() => {
                if (item.id === 'settings') router.push('/ajustes');
                if (item.id === 'guardian') router.push('/guardian');
                if (item.id === 'permissions') router.push('/menu_permisos');
              }}
            >
              <Text style={styles.menuLabel}>{item.label}</Text>
              <View style={styles.trailing}>
                {item.trailing ? <Text style={styles.menuTrailing}>{item.trailing}</Text> : null}
                <Ionicons name="chevron-forward" size={18} color={palette.muted} />
              </View>
            </Pressable>
          ))}
        </View>

        {user && (
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar sesion</Text>
          </Pressable>
        )}
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
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.darkText,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    padding: 14,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.darkText,
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: palette.teal,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  loginText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  menuCard: {
    backgroundColor: palette.card,
    borderRadius: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: palette.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.darkText,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuTrailing: {
    fontSize: 13,
    color: palette.muted,
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: 8,
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
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
