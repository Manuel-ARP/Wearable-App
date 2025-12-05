import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { setRegistroData } from './registroStore';

const palette = {
  teal: '#36b6ac',
  darkText: '#333333',
  muted: '#8c8f94',
  bg: '#ffffff',
  field: '#f1f2f4',
};

export default function RegistroPaso2Screen() {
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const isValid = altura.trim().length > 0 && peso.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={palette.darkText} />
        </Pressable>

        <Text style={styles.title}>Crea tu cuenta</Text>
        <Text style={styles.subtitle}>Paso 2: Informacion Personal</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Altura</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 165 cm"
            placeholderTextColor={palette.muted}
            value={altura}
            onChangeText={(text) => setAltura(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Peso</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 60 kg"
            placeholderTextColor={palette.muted}
            value={peso}
            onChangeText={(text) => setPeso(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
          />
        </View>

        <Pressable
          style={[styles.primaryButton, !isValid && styles.primaryButtonDisabled]}
          onPress={() => {
            if (!isValid) return;
            setRegistroData({
              alturaCm: altura.trim(),
              pesoKg: peso.trim(),
            });
            router.push('/registro_paso3');
          }}
        >
          <Text style={styles.primaryText}>Siguiente</Text>
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
  primaryButton: {
    marginTop: 32,
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
});
