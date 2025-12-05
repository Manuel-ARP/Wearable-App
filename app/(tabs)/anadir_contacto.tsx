import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { API_BASE } from '@/constants/api';
import { getCurrentUser } from '../authStore';

const palette = {
  teal: '#36b6ac',
  darkText: '#4d4d4d',
  muted: '#8c8f94',
  lightBg: '#f5f6f8',
  card: '#ffffff',
};

// Pantalla de formulario para anadir un contacto de emergencia.
export default function AnadirContactoScreen() {
  const params = useLocalSearchParams();
  const isEdit = !!params.id;
  const user = getCurrentUser();
  const [nombre, setNombre] = useState((params.nombre as string) || '');
  const [apellidos, setApellidos] = useState((params.apellidos as string) || '');
  const [telefono, setTelefono] = useState((params.telefono as string) || '');
  const [email, setEmail] = useState((params.email as string) || '');
  const [relacion, setRelacion] = useState((params.relacion as string) || '');
  const [loading, setLoading] = useState(false);

  // Sincroniza campos cuando se llega de nuevo con otros params (edicion repetida).
  useEffect(() => {
    if (isEdit) {
      setNombre((params.nombre as string) || '');
      setApellidos((params.apellidos as string) || '');
      setTelefono((params.telefono as string) || '');
      setEmail((params.email as string) || '');
      setRelacion((params.relacion as string) || '');
    }
  }, [isEdit, params.nombre, params.apellidos, params.telefono, params.email, params.relacion]);

  const isValid = nombre.trim() && apellidos.trim() && telefono.trim() && email.trim() && user;

  const handleSave = async () => {
    if (!isValid || !user) {
      Alert.alert('Faltan datos', 'Completa todos los campos y asegúrate de haber iniciado sesión.');
      return;
    }
    try {
      setLoading(true);
      const endpoint = isEdit ? 'update_contact' : 'add_contact';
      const res = await fetch(`${API_BASE}?action=${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id ? Number(params.id) : undefined,
          user_id: user.id,
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          email: email.trim().toLowerCase(),
          telefono: telefono.trim(),
          relacion: relacion.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'No se pudo guardar');
      }
      // Limpiar campos para permitir agregar otro contacto.
      setNombre('');
      setApellidos('');
      setTelefono('');
      setEmail('');
      setRelacion('');

      Alert.alert('Listo', isEdit ? 'Cambios guardados' : 'Contacto guardado', [
        !isEdit ? { text: 'Agregar otro', style: 'default' } : undefined,
        { text: 'Volver', onPress: () => router.back() },
      ].filter(Boolean) as any);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Ocurrió un problema al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>{isEdit ? 'Editar Contacto' : 'Anadir Contacto'}</Text>
          </View>

          <Text style={styles.subtitle}>
            Notificaremos a esta persona en caso de presentar valores criticos
          </Text>

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
            <Text style={styles.label}>Telefono</Text>
            <TextInput
              style={styles.input}
              placeholder="555-123-1551"
              keyboardType="phone-pad"
              placeholderTextColor={palette.muted}
              value={telefono}
              onChangeText={setTelefono}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Correo electronico</Text>
            <TextInput
              style={styles.input}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={palette.muted}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Relacion (Ej. Hijo/a, Doctor)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Hijo/a"
              placeholderTextColor={palette.muted}
              value={relacion}
              onChangeText={setRelacion}
            />
          </View>

          <Pressable style={[styles.saveButton, (!isValid || loading) && styles.saveButtonDisabled]} onPress={handleSave} disabled={!isValid || loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={styles.saveButtonText}>{isEdit ? 'Guardar cambios' : 'Guardar Contacto'}</Text>
            )}
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.lightBg,
    paddingHorizontal: 4,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.darkText,
  },
  subtitle: {
    fontSize: 13,
    color: palette.muted,
    lineHeight: 18,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: palette.darkText,
    fontWeight: '700',
  },
  input: {
    backgroundColor: palette.card,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: palette.darkText,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  saveButton: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.teal,
    borderRadius: 18,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 4,
  },
  cancelText: {
    color: '#2f80ed',
    fontSize: 15,
    fontWeight: '600',
  },
});
