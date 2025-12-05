import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { setRegistroData } from './registroStore';

const palette = {
  teal: '#36b6ac',
  darkText: '#333333',
  muted: '#8c8f94',
  bg: '#ffffff',
  field: '#f1f2f4',
  border: '#e5e7eb',
};

export default function RegistroPaso1Screen() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');

  const isValid =
    nombre.trim().length > 0 &&
    apellidos.trim().length > 0 &&
    email.includes('@') &&
    password.length >= 6 &&
    dia.length >= 1 &&
    mes.length >= 1 &&
    anio.length === 4;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.titleRow}>
            <Text style={styles.title}>Crea tu cuenta</Text>
            <Pressable hitSlop={10} onPress={() => router.back()}>
              <Ionicons name="close" size={22} color={palette.darkText} />
            </Pressable>
          </View>
          <Text style={styles.subtitle}>Paso 1: Informacion Personal</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nombre(s)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Ana"
            placeholderTextColor={palette.muted}
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Apellidos</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Aguilar"
            placeholderTextColor={palette.muted}
            value={apellidos}
            onChangeText={setApellidos}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Correo electronico</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={palette.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Contrasena</Text>
          <TextInput
            style={styles.input}
            placeholder="Minimo 6 caracteres"
            placeholderTextColor={palette.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Fecha de nacimiento</Text>
          <View style={styles.rowThree}>
            <TextInput
              style={[styles.input, styles.flexInput]}
              placeholder="Dia"
              placeholderTextColor={palette.muted}
              value={dia}
              onChangeText={(text) => {
                const digits = text.replace(/\D/g, '').slice(0, 2);
                setDia(digits);
              }}
              onBlur={() => {
                if (!dia) return;
                let num = Math.min(parseInt(dia, 10), 31);
                if (num < 1) num = 1;
                const padded = num.toString().padStart(2, '0');
                setDia(padded);
              }}
              keyboardType="numeric"
              maxLength={2}
            />
            <TextInput
              style={[styles.input, styles.flexInput]}
              placeholder="Mes"
              placeholderTextColor={palette.muted}
              value={mes}
              onChangeText={(text) => {
                const digits = text.replace(/\D/g, '').slice(0, 2);
                setMes(digits);
              }}
              onBlur={() => {
                if (!mes) return;
                let num = Math.min(parseInt(mes, 10), 12);
                if (num < 1) num = 1;
                const padded = num.toString().padStart(2, '0');
                setMes(padded);
              }}
              keyboardType="numeric"
              maxLength={2}
            />
            <TextInput
              style={[styles.input, styles.flexInput]}
              placeholder="Anio"
              placeholderTextColor={palette.muted}
              value={anio}
              onChangeText={(text) => setAnio(text.replace(/\D/g, '').slice(0, 4))}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
        </View>

          <Pressable
            style={[styles.primaryButton, !isValid && styles.primaryButtonDisabled]}
            onPress={() => {
              if (!isValid) return;
              const fecha = `${anio.padStart(4, '0')}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
              setRegistroData({
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
                email: email.trim().toLowerCase(),
                password,
                fechaNacimiento: fecha,
              });
              router.push('/registro_paso2');
            }}
          >
            <Text style={styles.primaryText}>Siguiente</Text>
          </Pressable>

          <View style={styles.inlineText}>
            <Text style={styles.mutedText}>Ya tienes una cuenta? </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.linkText}>Iniciar Sesion</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.darkText,
  },
  subtitle: {
    fontSize: 13,
    color: palette.darkText,
    fontWeight: '700',
  },
  fieldGroup: {
    gap: 6,
    marginTop: 10,
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
  flexInput: {
    flex: 1,
  },
  rowThree: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    marginTop: 24,
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
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  inlineText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
  },
  mutedText: {
    fontSize: 13,
    color: palette.darkText,
    fontWeight: '700',
  },
  linkText: {
    fontSize: 13,
    color: palette.teal,
    fontWeight: '700',
  },
});
