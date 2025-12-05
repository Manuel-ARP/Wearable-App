import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getRegistroData, resetRegistroData } from './registroStore';
import { API_BASE } from '@/constants/api';

const palette = {
  teal: '#36b6ac',
  darkText: '#333333',
  muted: '#8c8f94',
  bg: '#ffffff',
  field: '#f1f2f4',
};

const conditions = [
  'Hipertension arterial',
  'Diabetes',
  'Problemas Cardiacos',
  'Problemas respiratorios',
  'Colesterol alto',
  'Problemas Renales',
];

export default function RegistroPaso4Screen() {
  const [selected, setSelected] = useState<string[]>(['Hipertension arterial']);
  const [other, setOther] = useState('');
  const [loading, setLoading] = useState(false);

  const toggle = (item: string) => {
    setSelected((prev) => (prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]));
  };

  const handleSubmit = async () => {
    const data = getRegistroData();
    if (!data.nombre || !data.apellidos || !data.email || !data.password || !data.fechaNacimiento || !data.alturaCm || !data.pesoKg || !data.genero) {
      Alert.alert('Faltan datos', 'Completa los pasos anteriores antes de finalizar.');
      return;
    }

    const payload = {
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email,
      password: data.password,
      fecha_nacimiento: data.fechaNacimiento,
      altura_cm: data.alturaCm,
      peso_kg: data.pesoKg,
      genero: data.genero === 'f' ? 'Femenino' : 'Masculino',
      condiciones: selected,
      otro: other.trim() ? other.trim() : null,
    };

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'No se pudo registrar');
      }
      resetRegistroData();
      Alert.alert('Registro completado', 'Tu cuenta ha sido creada.', [
        { text: 'OK', onPress: () => router.replace('/login') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Ocurrio un error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={10}>
          <Ionicons name='chevron-back' size={22} color={palette.darkText} />
        </Pressable>

        <Text style={styles.title}>Crea tu cuenta</Text>
        <Text style={styles.subtitle}>Paso 4: Historial medico</Text>

        <Text style={styles.question}>Presentas alguna de las siguientes condiciones?</Text>

        <View style={styles.card}>
          {conditions.map((item) => {
            const isChecked = selected.includes(item);
            return (
              <Pressable key={item} style={styles.conditionRow} onPress={() => toggle(item)}>
                <Text style={styles.conditionText}>{item}</Text>
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && <Ionicons name='checkmark' size={14} color='#fff' />}
                </View>
              </Pressable>
            );
          })}

          <View style={styles.conditionRow}>
            <Text style={styles.conditionText}>Otro...</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder='Por favor describelo...'
            placeholderTextColor={palette.muted}
            value={other}
            onChangeText={setOther}
          />
        </View>

        <Text style={styles.question}>Estudios medicos (opcional)</Text>
        <Pressable style={styles.uploadButton}>
          <Text style={styles.uploadText}>Adjuntar archivo</Text>
        </Pressable>

        <Pressable style={[styles.primaryButton, loading && styles.primaryButtonDisabled]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.primaryText}>Finalizar Registro</Text>}
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
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
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
  question: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: palette.darkText,
  },
  card: {
    marginTop: 8,
    backgroundColor: palette.field,
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conditionText: {
    fontSize: 14,
    color: palette.darkText,
    fontWeight: '700',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: palette.darkText,
  },
  uploadButton: {
    marginTop: 8,
    backgroundColor: palette.field,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: palette.darkText,
    fontSize: 14,
    fontWeight: '700',
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
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
