import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { API_BASE } from '@/constants/api';
import { getCurrentUser, setCurrentUser } from './authStore';

const palette = {
  teal: '#36b6ac',
  darkText: '#333333',
  muted: '#8c8f94',
  bg: '#ffffff',
  field: '#f1f2f4',
};

const conditionsList = [
  'Hipertension arterial',
  'Diabetes',
  'Problemas Cardiacos',
  'Problemas respiratorios',
  'Colesterol alto',
  'Problemas Renales',
];

export default function EditarPerfilScreen() {
  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [fecha, setFecha] = useState(''); // YYYY-MM-DD
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [genero, setGenero] = useState<'Femenino' | 'Masculino'>('Femenino');
  const [condiciones, setCondiciones] = useState<string[]>([]);
  const [otro, setOtro] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}?action=get_user&id=${user.id}`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || 'No se pudo cargar');
        const u = json.user;
        setNombre(u.nombre || '');
        setApellidos(u.apellidos || '');
        setEmail(u.email || '');
        setFecha(u.fecha_nacimiento || '');
        setAltura(String(u.altura_cm ?? ''));
        setPeso(String(u.peso_kg ?? ''));
        setGenero(u.genero === 'Masculino' ? 'Masculino' : 'Femenino');
        setCondiciones(Array.isArray(u.condiciones) ? u.condiciones : []);
        setOtro(u.otro || '');
      } catch (err: any) {
        Alert.alert('Error', err.message || 'No se pudo cargar la informacion');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user]);

  const toggleCondicion = (item: string) => {
    setCondiciones((prev) => (prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]));
  };

  const saveProfile = async () => {
    if (!user) {
      Alert.alert('Sesion', 'Debes iniciar sesion.');
      return;
    }
    if (!nombre.trim() || !apellidos.trim() || !email.trim() || !fecha.trim() || !altura.trim() || !peso.trim()) {
      Alert.alert('Campos requeridos', 'Completa todos los campos.');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        id: user.id,
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        email: email.trim().toLowerCase(),
        fecha_nacimiento: fecha.trim(),
        altura_cm: parseInt(altura, 10),
        peso_kg: parseInt(peso, 10),
        genero,
        condiciones,
        otro: otro.trim() || null,
      };
      const res = await fetch(`${API_BASE}?action=update_user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'No se pudo guardar');
      setCurrentUser({ ...user, nombre: payload.nombre, apellidos: payload.apellidos, email: payload.email });
      Alert.alert('Guardado', 'Perfil actualizado', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={10}>
            <Ionicons name='chevron-back' size={22} color={palette.darkText} />
          </Pressable>

          <Text style={styles.title}>Editar perfil</Text>
          <Text style={styles.subtitle}>Actualiza tu informacion personal</Text>

          {loading && <ActivityIndicator color={palette.teal} />}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nombre(s)</Text>
            <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder='Ej: Ana' placeholderTextColor={palette.muted} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Apellidos</Text>
            <TextInput style={styles.input} value={apellidos} onChangeText={setApellidos} placeholder='Ej: Aguilar' placeholderTextColor={palette.muted} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Correo electronico</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder='correo@ejemplo.com'
              placeholderTextColor={palette.muted}
              autoCapitalize='none'
              keyboardType='email-address'
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TextInput
              style={styles.input}
              value={fecha}
              onChangeText={setFecha}
              placeholder='YYYY-MM-DD'
              placeholderTextColor={palette.muted}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.half]}>
              <Text style={styles.label}>Altura (cm)</Text>
              <TextInput
                style={styles.input}
                value={altura}
                onChangeText={(t) => setAltura(t.replace(/[^0-9]/g, ''))}
                placeholder='165'
                placeholderTextColor={palette.muted}
                keyboardType='numeric'
              />
            </View>
            <View style={[styles.fieldGroup, styles.half]}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                value={peso}
                onChangeText={(t) => setPeso(t.replace(/[^0-9]/g, ''))}
                placeholder='60'
                placeholderTextColor={palette.muted}
                keyboardType='numeric'
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Genero</Text>
            <View style={styles.row}>
              <Pressable
                style={[styles.chip, genero === 'Femenino' && styles.chipActive]}
                onPress={() => setGenero('Femenino')}
              >
                <Text style={[styles.chipText, genero === 'Femenino' && styles.chipTextActive]}>Femenino</Text>
              </Pressable>
              <Pressable
                style={[styles.chip, genero === 'Masculino' && styles.chipActive]}
                onPress={() => setGenero('Masculino')}
              >
                <Text style={[styles.chipText, genero === 'Masculino' && styles.chipTextActive]}>Masculino</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Condiciones</Text>
            <View style={styles.card}>
              {conditionsList.map((c) => {
                const checked = condiciones.includes(c);
                return (
                  <Pressable key={c} style={styles.conditionRow} onPress={() => toggleCondicion(c)}>
                    <Text style={styles.conditionText}>{c}</Text>
                    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                      {checked && <Ionicons name='checkmark' size={14} color='#fff' />}
                    </View>
                  </Pressable>
                );
              })}
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                value={otro}
                onChangeText={setOtro}
                placeholder='Otro...'
                placeholderTextColor={palette.muted}
              />
            </View>
          </View>

          <Pressable style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={saveProfile} disabled={loading}>
            {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.saveText}>Guardar cambios</Text>}
          </Pressable>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 14,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: palette.darkText,
  },
  subtitle: {
    fontSize: 13,
    color: palette.muted,
  },
  fieldGroup: {
    gap: 6,
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
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  half: {
    flex: 1,
  },
  chip: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: palette.field,
  },
  chipActive: {
    backgroundColor: palette.teal,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.darkText,
  },
  chipTextActive: {
    color: '#fff',
  },
  card: {
    marginTop: 6,
    backgroundColor: palette.field,
    borderRadius: 12,
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
    fontWeight: '700',
    color: palette.darkText,
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
  saveButton: {
    marginTop: 16,
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
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
