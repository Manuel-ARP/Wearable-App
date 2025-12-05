import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { API_BASE } from '@/constants/api';
import { setCurrentUser } from './authStore';

const palette = {
  teal: '#36b6ac',
  darkText: '#333333',
  muted: '#8c8f94',
  bg: '#ffffff',
  field: '#f1f2f4',
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Completa los datos', 'Ingresa correo y contrasena.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Credenciales invalidas');
      }
      if (json.user) {
        setCurrentUser(json.user);
      }
      Alert.alert('Bienvenido', 'Ingreso exitoso', [{ text: 'OK', onPress: () => router.replace('/') }]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Text style={styles.brand}>
            <Text style={styles.brandDark}>Wear</Text>
            <Text style={styles.brandTeal}>Able</Text>
          </Text>
          <Pressable hitSlop={10} onPress={() => router.back()}>
            <Ionicons name='close' size={22} color={palette.darkText} />
          </Pressable>
        </View>

        <Text style={styles.title}>Inicio de sesion</Text>
        <Text style={styles.subtitle}>Ingresa a tu cuenta</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder='correo@ejemplo.com'
            placeholderTextColor={palette.muted}
            autoCapitalize='none'
            keyboardType='email-address'
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder='****************'
            placeholderTextColor={palette.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable style={[styles.primaryButton, loading && styles.primaryButtonDisabled]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.primaryText}>Iniciar sesion</Text>}
        </Pressable>

        <View style={styles.inlineText}>
          <Text style={styles.mutedText}>No tienes una cuenta? </Text>
          <Pressable onPress={() => router.push('/registro_paso1')}>
            <Text style={styles.linkText}>Registrarse</Text>
          </Pressable>
        </View>

        <Pressable style={styles.forgotButton}>
          <Text style={styles.linkText}>Olvidaste tu contraseña?</Text>
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brand: {
    fontSize: 26,
    fontWeight: '800',
  },
  brandDark: {
    color: palette.darkText,
  },
  brandTeal: {
    color: palette.teal,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.darkText,
  },
  subtitle: {
    fontSize: 13,
    color: palette.muted,
  },
  fieldGroup: {
    gap: 6,
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.darkText,
  },
  input: {
    backgroundColor: palette.field,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: palette.darkText,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: palette.teal,
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  inlineText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 10,
  },
  mutedText: {
    fontSize: 13,
    color: palette.darkText,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 13,
    color: palette.teal,
    fontWeight: '700',
  },
  forgotButton: {
    marginTop: 12,
    alignItems: 'center',
  },
});
